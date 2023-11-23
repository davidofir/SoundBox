import React, { useEffect, useState, memo } from 'react';
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
  Image, TouchableOpacity,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { authentication, db } from "../../firebase";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import axios from 'axios';
import { fetchRecommendedArtists } from './RecommendArtists';
import { ActivityIndicator } from 'react-native';
import { fetchRecommendedSongs } from './RecommendSongs';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';
import SongsViewAllPage from './SongsViewAllPage';
const Recommendations = ({ navigation, route }) => {
  const topArtists = [];
  const topGenres = [];
  const [reviews, setReviews] = useState([]);
  const [inputSong, setInputSong] = useState('');
  var userId = authentication.currentUser.uid;


  const defaultCoverArt = require('../../assets/defaultSongImage.png');

  const [artistRecommendations, setArtistRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [songRecommendations, setSongRecommendations] = useState([]);
  const [allSongRecommendations, setAllSongRecommendations] = useState([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

    // Query Firestore database with current UID
    useEffect(() => {
      
      //get artist recommendations
      async function loadArtistRecommendations() {
          try {
              setIsLoading(true);
              const recommendations = await fetchRecommendedArtists();
              setArtistRecommendations(recommendations);
              setIsLoading(false);

          } catch (error) {
              console.error('Failed to fetch artist recommendations:', error);
              setIsLoading(false);
          }
      }
        loadArtistRecommendations();

        async function loadSongRecommendations() {
          try {
            setIsLoadingSongs(true);
            const songRecs = await fetchRecommendedSongs();
            
            const topSixSongs = songRecs.similartracks.track.slice(0, 6);
            const songsWithCoverArt = await Promise.all(
              topSixSongs.map(async (song) => {

                const coverArtUrl = await searchAndFetchSongCoverArt(song.name, song.artist.name);
                return { ...song, coverArtUrl };
              })
              
            );

            setSongRecommendations(songsWithCoverArt);
            setAllSongRecommendations(songRecs.similartracks.track.slice(0, 30))
            setIsLoadingSongs(false);
          } catch (error) {
            console.error('Failed to fetch song recommendations:', error);
            setIsLoadingSongs(false);
          }
        }
        
        loadSongRecommendations();

  }, [])


  
  const RecommendedSongCell = memo(({ songItem }) => {
    // Directly use the cover art URL from the song item
    return (
      <TouchableOpacity onPress={() => {/* handle press action here */}}>
        <View style={styles.songBox}>
          <Image
            source={songItem.coverArtUrl ? { uri: songItem.coverArtUrl } : defaultCoverArt}
            style={styles.songImage}
          />
          <Text style={styles.songName}>{songItem.name}</Text>
          <Text style={styles.artistName2}>{songItem.artist.name}</Text>
        </View>
      </TouchableOpacity>
    );
  });


  
return (
  <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 5}}>
    {/* Artist Recommendations Section */}
    <View style={styles.horizontalProfileContainer}>
      <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: '500' }]}>Discover Artists</Text>
      <Text onPress={() => navigation.navigate('Discover')} style={[styles.text, { fontSize: 18, padding: 13 }]}>View all</Text>
    </View>
    <View style={styles.artistContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="black" style={styles.spinner} />
      ) : artistRecommendations && artistRecommendations.length > 0 ? (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {artistRecommendations.map((artist, index) => (
            <View key={index} style={styles.artistView}>
              <Image
                source={artist.imageUrl ? { uri: artist.imageUrl } : require("../../assets/defaultPic.png")}
                style={styles.imageContainer}
              />
              <Text style={styles.artistName}>{artist.artistName}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noArtistText}>Interact with the app to receive tailored recommendations based on your activity.</Text>
      )}
    </View>

    {/* Song Recommendations Section */}
    <View style={styles.horizontalProfileContainer}>
      <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: '500' }]}>Discover Songs</Text>
      <Text onPress={() => navigation.navigate('SongsViewAllPage', { songs: allSongRecommendations })} 
      style={[styles.text, { fontSize: 18, padding: 13 }]}>View all</Text>
    </View>
    
    {isLoadingSongs ? (
      <ActivityIndicator size="large" color="black" />
    ) : songRecommendations && songRecommendations.length > 0 ? (
      <FlatList
        horizontal
        data={songRecommendations.slice(0, 6)} // Only take the first 6 songs
        renderItem={({ item }) => <RecommendedSongCell songItem={item} />}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    ) : (
      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Interact with the app to receive tailored recommendations based on your activity.
      </Text>
    )}
  </ScrollView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  artistContainer: {
    paddingLeft: 10,
    marginBottom: 40,
},
artistView: {
    alignItems: 'center', // Center items vertically
    marginRight: 10, // Add some spacing between the artist views
  },
  spinner: {
    height: 170, 
    alignItems: 'center',
    justifyContent: 'center',
},
imageContainer: {
  width: 120,
  height: 150,
  borderRadius: 12,
  backgroundColor: '#333',
  overflow: 'hidden',
  marginHorizontal: 6,
},
  artistName2: {
    textAlign: 'center', // Center the artist's name
  },
  horizontalProfileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 5,
    width: 'auto',
    height: 'auto',
},
  textStyle: {
    textAlign: 'top',
    fontSize: 23,
    marginTop: 20,
  },
  textStyleSong: {
    fontSize: 29,
    marginTop: 20,
    alignItems: 'baseline',
    fontWeight: 'bold',
  },
  textStyleArtist: {
    fontSize: 23,
    marginTop: 20,
    alignItems: 'baseline',
    fontWeight: 'bold',
    color: 'lightslategrey',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
    backgroundColor: 'black',
    fontSize: 40,
    color: 'white',
  },
  input: {
    height: 150,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 25,
  },
  topHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 0,
  },
  SongName: {
    fontSize: 18,
    marginVertical: 5,
  },
  songInputContainer: {
    marginTop: 20,
  },
  songInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    fontSize: 16,
    marginVertical: 5,
    borderRadius: 15,  
    
},

  flatListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top', 
  },
  
  artistItemContainer: {
    flex: 1,
    flexDirection: 'row',  // change this to row
    alignItems: 'center',  // vertically aligns both circle and text
    justifyContent: 'flex-start',
    padding: 5,
    width: '100%',  // adjust as needed
    marginBottom: 50
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 5,  // space between the circle and the text
    backgroundColor: 'lightgray'
  },

  artistName: {
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 8,
    flexShrink: 1,   // allows the text to shrink if needed
    width: '70%',    // adjust this as needed based on your design
  },
  image: {
    width: 100, // Adjust the image width as needed
    height: 100, // Adjust the image height as needed
    alignSelf: 'center', // Center the image horizontally
  },
  songBox: {
    alignItems: 'center', // Center items vertically
    marginRight: 10, // Add some spacing between the song views
    // Add any additional styling as needed
  },
  songImage: {
    width: 150,
    height: 150,
    backgroundColor: '#333',
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  songName: {
    marginTop: 5, // Space between the image and the text
    textAlign: 'center', // Center the song's name
    fontWeight: 'bold'
  },
  artistName: {
    fontSize: 14,
    textAlign: 'center', // Center the text horizontally
    fontWeight: 'bold'
  },
  box: {
    backgroundColor: '#F7F6F6',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    width: 150, 
    height: 170,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.30,
    shadowRadius: 1.22,
    elevation: 3,
  },
});

export default Recommendations;