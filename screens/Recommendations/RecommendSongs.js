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


export async function fetchRecommendedSongs() {
  var reviews = await getUserReviews()
  const topReview = getTopRatedReview(reviews);
  if (topReview) {
    const encodedSongTitle = encodeURIComponent(topReview.songName);
    const encodedArtistTitle = encodeURIComponent(topReview.artistName);
    const apiKey = 'a7e2af1bb0cdcdf46e9208c765a2f2ca'; 
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodedArtistTitle}&track=${encodedSongTitle}&api_key=${apiKey}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.similartracks && data.similartracks.track) {
        return data
      } else {
        console.error('Invalid API response format for song recommendations');
      }
    } catch (error) {
      console.error(error);
    }
    
  }
}

//get all of the logged users reviews
async function getUserReviews(){
  var currId = authentication.currentUser.uid;
  var reviews = await getUserReviewData(currId)
  return reviews
}

function getTopRatedReview(reviews) {
  const maxRating = Math.max(...reviews.map(review => review.rating));
  const topRatedReviews = reviews.filter(review => review.rating === maxRating);

  // If there are multiple reviews with the highest rating, pick a random one.
  const randomReview = topRatedReviews[Math.floor(Math.random() * topRatedReviews.length)];
  
  return randomReview;
} 