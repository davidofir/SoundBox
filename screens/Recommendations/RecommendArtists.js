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


export async function fetchRecommendedArtists() {
    var reviews = await getUserReviews()
   
    var topArtists = await getTopUserArtists(reviews)

    var fetchedArtists = await fetchArtistsFromAPI(topArtists)
   
    var finalList = await compileRecommendations(fetchedArtists)

    return finalList
}

//get all of the logged users reviews
async function getUserReviews(){
    var currId = authentication.currentUser.uid;
    var reviews = await getUserReviewData(currId)
    return reviews
  }

  async function getTopUserArtists(reviewArray) {
    if (reviewArray.length === 0 || reviewArray == undefined) {
      return []; // Return an empty array if there are no reviews
    }
  
    const artistMap = new Map();
  
    // Build the map with aggregate ratings and counts.
    reviewArray.forEach(review => {
      const { artistName, rating } = review;
      if (artistMap.has(artistName)) {
        const currentArtistData = artistMap.get(artistName);
        artistMap.set(artistName, {
          rating: currentArtistData.rating + rating,
          count: currentArtistData.count + 1,
        });
      } else {
        artistMap.set(artistName, {
          rating: rating,
          count: 1,
        });
      }
    });
  
    // Convert Map to Array and calculate the mean rating for each artist.
    const meanReviewList = Array.from(artistMap.entries()).map(([name, data]) => {
      const averageRating = data.rating / data.count;
      return {
        name: name,
        rating: averageRating,
      };
    });
  
    // Sort artists by rating in descending order
    meanReviewList.sort((a, b) => b.rating - a.rating);
  
    let results = [];
  
    // Determine if there are any top-rated artists
    const topArtists = meanReviewList.filter(artist => artist.rating >= 2.5);
  
    // Add the top-rated artist if available, otherwise add the lowest-rated artist
    results.push(topArtists.length > 0 ? 
                 { name: topArtists[0].name, category: 'top' } : 
                 { name: meanReviewList[meanReviewList.length - 1].name, category: 'bottom' });
  
    // Add the second artist based on availability and ratings
    if (meanReviewList.length > 1) {
      if (topArtists.length > 1) {
        // If there's a second top-rated artist, add them
        results.push({ name: topArtists[1].name, category: 'top' });
      } else {
        // Otherwise, add the second-lowest rated artist
        results.push({ name: meanReviewList[meanReviewList.length - 2].name, category: 'bottom' });
      }
    }
  
    return results;
  }
  
  async function fetchArtistsFromAPI(artistData) {
    try {
      const artistResponses = await Promise.all(
        artistData.map(data => 
          axios.get(`https://alexsoundbox.pythonanywhere.com/recommend?artist_name=${encodeURIComponent(data.name)}&category=${encodeURIComponent(data.category)}`)
        )
      );
  
      const combinedArtists = [];
      const addedArtistsSet = new Set();
  
      // Limit the number of recommendations per artist
      const maxRecommendationsPerArtist = 10; // Adjust as needed
  
      // Iterate over each API response
      for (let response of artistResponses) {
        let count = 0;
        // Iterate over each recommended artist
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
      console.error('Fetch error from custom API:', error);
      // If an error occurred, fall back to the Last.FM API
      const artistNames = artistData.map(data => data.name);
      return await fetchArtistsFromLastFM(artistNames);
    }
  }
  

  async function fetchArtistsFromLastFM(artists){
    const apiKey = 'a7e2af1bb0cdcdf46e9208c765a2f2ca'; 
    
    try {
        const artistResponses = await Promise.all(
          artists.map(artist => axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${apiKey}&format=json&limit=3`))
        );
            
        const combinedArtists = [];
        const addedArtistsSet = new Set();
        
        // Assume artistResponses is an array of responses from Last.fm for each artist
        for (let response of artistResponses) {
          // Assume similarArtistsData is the correctly accessed path to the similar artists
          let similarArtistsData = response.data.similarartists.artist;
          for (let artistData of similarArtistsData) {
            let artistName = artistData.name;
            // Check if we already added this artist or if we reached the limit of 6
            if (!addedArtistsSet.has(artistName) && combinedArtists.length < 6) {
              combinedArtists.push(artistName);
              addedArtistsSet.add(artistName);
            }
          }
        }
        
        return combinedArtists;
    
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    async function compileRecommendations(fetchedArtists){
      return fetchedArtists.map(artistName => ({
        artistName: artistName,
        imageUrl: null // Initially no image URL
      }));
    }