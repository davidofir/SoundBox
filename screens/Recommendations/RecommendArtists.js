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

    var fetchedArtists = await fetchArtistsFromLastFM(topArtists)
    console.log(fetchedArtists)
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
    const artistMap = new Map();
    const lambda = 0.5; // Might need to adjust after further testing and more reviews are made

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

    // Convert Map to Array and calculate the mean and weighted score for each artist.
    const meanReviewList = Array.from(artistMap.entries()).map(([name, data]) => {
        const averageRating = data.rating / data.count;
        return {
            name: name,
            rating: averageRating,
            count: data.count,
            weightedScore: averageRating + (lambda * data.count)
        };
    });

  // Find the top 2 artists with the highest weighted scores.
  meanReviewList.sort((a, b) => b.weightedScore - a.weightedScore);
  const topTwoArtists = meanReviewList.slice(0, 2).map(artist => artist.name);

  return topTwoArtists;
}
  
async function fetchArtistsFromAPI(artists) {
    try {
      const artistResponses = await Promise.all(
        artists.map(artist => axios.get(`http://192.168.1.133:8080/recommend?artist_name=${artist}`))
      );
  
      const combinedArtists = [];
      const addedArtistsSet = new Set();
  
      // Iterate over each API response
      for (let response of artistResponses) {
        // Iterate over each recommended artist
        for (let artist of response.data.recommended_artists) {
          // Check if we already added this artist or if we reached the limit of 6
          if (!addedArtistsSet.has(artist) && combinedArtists.length < 6) {
            combinedArtists.push(artist);
            addedArtistsSet.add(artist);
          }
        }
      }
  
      return combinedArtists;
  
    } catch (error) {
      console.error('Fetch error:', error);
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
        const artistImagesList = [];
        for (const artistName of fetchedArtists) {
            const artistImages = await getArtistImage(artistName);
            var imageURL = ""

            if (artistImages.length > 0) {
              // get first image
              imageURL = artistImages[0].url;

            } else {
                imageURL = ""
            }
            artistImagesList.push({
                artistName: artistName,
                imageUrl: imageURL
              });
          }
          return artistImagesList;
        }