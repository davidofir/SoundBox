import React, { useEffect, useState } from 'react';
import { Feather, Entypo } from "@expo/vector-icons";


import { TouchableHighlight } from 'react-native-gesture-handler';
import { authentication, db } from "../../firebase";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import axios from 'axios';
import { getListUserReviews } from '../../domain/RecommendRepository/RecommendationRepository';
import { getUserReviewData } from '../../domain/FirebaseRepository/UserRepository';
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';


export async function getRecommendedSongs() {
  const trackModel = new TrackModel();
  try {
    const songRecs = await trackModel.fetchRecommendedSongs();
    
    // Fetch cover art for the top six songs
    const topSixSongs = songRecs.similartracks.track.slice(0, 6);
    const songsWithCoverArt = await Promise.all(
      topSixSongs.map(async (song) => {
        const coverArtUrl = await searchAndFetchSongCoverArt(song.name, song.artist.name);
        return { ...song, coverArtUrl };
      })
    );

    // Add the rest of the songs with null for cover art URL
    const restOfTheSongs = songRecs.similartracks.track.slice(6).map(song => ({ ...song, coverArtUrl: null }));

    return [...songsWithCoverArt, ...restOfTheSongs];
  } catch (error) {
    console.error('Error fetching recommended songs:', error);
    return null;
  }
}



