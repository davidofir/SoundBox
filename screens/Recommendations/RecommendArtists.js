import React, { useEffect, useState } from 'react';
import { Feather, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  Button,
  FlatList,
  ScrollView,
  Image
} from 'react-native';

import { TouchableHighlight } from 'react-native-gesture-handler';
import { authentication, db } from "../../firebase";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import axios from 'axios';
import { getListUserReviews } from '../../domain/RecommendRepository/RecommendationRepository';
import { getUserReviewData } from '../../domain/FirebaseRepository/UserRepository';
import { getArtistImage } from '../../domain/SpotifyAPI/SpotifyAPI';
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { getTopUserArtists, getUserReviews } from './RecommendAlgorithm';
import { fetchArtistRecommendationFromAPI } from '../../domain/RecommendRepository/RecommendationRepository';


export async function fetchRecommendedArtists() {
    var reviews = await getUserReviews()
   
    var topArtists = await getTopUserArtists(reviews)

    var fetchedArtists = await processArtistRecommendations(topArtists)
   
    var finalList = await compileRecommendations(fetchedArtists)

    var finalListWithImages = await fetchArtistImages(finalList)
    
    return finalListWithImages
}

async function processArtistRecommendations(artistData) {
  try {
    const artistResponses = await fetchArtistRecommendationFromAPI(artistData);
    const combinedArtists = [];
    const addedArtistsSet = new Set();
    const maxRecommendationsPerArtist = 10; 

    for (let response of artistResponses) {
      let count = 0;
      for (let artist of response.data.recommended_artists) {
        if (count < maxRecommendationsPerArtist && !addedArtistsSet.has(artist)) {
          combinedArtists.push(artist);
          addedArtistsSet.add(artist);
          count++;
        }
      }
    }

    return combinedArtists;
  } catch (error) {
    console.error('Data processing error:', error);
    // If an error occurred, fall back to the Last.FM API
    const artistNames = artistData.map(data => data.name);
    return await processArtistRecommendationsLastFM(artistNames);
  }
}

  //IS ONLY RAN IF RECOMMENDATIONS API IS NOT RUNNING AS A FALLBACK
async function processArtistRecommendationsLastFM(artistNames) {
    console.log(artistNames)
    try {
      const trackModel = new TrackModel()
      // Fetching similar artists for each artist name using the API handler
      const rawArtistData = await trackModel.fetchArtistsFromLastFM(artistNames);
      console.log(rawArtistData)  
      return rawArtistData;
  
    } catch (error) {
      console.error('Error processing artist recommendations:', error);
      return []; // Optionally return an empty array or handle the error as needed
    }
}
  
async function compileRecommendations(fetchedArtists){
      return fetchedArtists.map(artistName => ({
        artistName: artistName,
        imageUrl: null // Initially no image URL
      }));
}

async function fetchArtistImages(finalList){
  const artists = await finalList;

  // Optionally, fetch images for each artist here
  const topSixArtistsWithImages = await Promise.all(
      artists.slice(0, 6).map(async artist => {
          const images = await getArtistImage(artist.artistName);
          return {
              ...artist,
              imageUrl: images.length > 0 ? images[0].url : null
          };
      })
  );

  // Combine the top six artists with images with the rest of the recommendations
  const finalRecommendations = [
    ...topSixArtistsWithImages,
    ...finalList.slice(6)
  ];

  return finalRecommendations;

}