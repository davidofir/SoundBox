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
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';



export async function getRecommendedSongs() {
  const trackModel = new TrackModel()
  try {
      const recommendedSongs = await trackModel.fetchRecommendedSongs();
      return recommendedSongs
      
  } catch (error) {
      console.error('Error fetching recommended songs:', error);
      return null
  }
}

//get all of the logged users reviews
async function getUserReviews(){

  return reviews
}

