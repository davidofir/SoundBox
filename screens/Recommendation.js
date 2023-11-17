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
  ScrollView
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { authentication, db } from "../firebase";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import axios from 'axios';



const Recommendations = ({ navigation, route }) => {
  const topArtists = [];
  const topGenres = [];
  const [reviews, setReviews] = useState([]);
  const [inputSong, setInputSong] = useState('');
  var userId = authentication.currentUser.uid;
  var reviewCount = 0;
  var reviewArray = [];
  var currentArtist = '';
  var artistIndex = '';
  var currentReview = 0;
  var favouriteArtist = '';
  const [apiResponse, setApiResponse] = useState(null); // Added state to store API response
  const [apiResponseSongs, setApiResponseSongs] = useState(null); // Added state to store song recommendations
  const [inputArtist, setInputArtist] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  // Query Firestore database with current UID

  useEffect(() => {
    const userRef = doc(db, 'users', userId);

    getDoc(userRef).then((doc) => {
      setReviews(doc.data().reviews);

      // Get the length of the array for the number of reviews
      reviewCount = doc.data().reviews.length;
      // Get the array of reviews
      reviewArray = doc.data().reviews;
      
      getTopUserArtists();
      fetchRecommendedSongs();
      
    });
  }, []);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      
      fetchRecommendedSongs();
    }
  }, [reviews]);

/*
  function printReviews() {
    reviews.forEach((item, index) => {
      console.log(`Review ${index}:`);
      console.log(`Artist: ${item.artistName}`);
      console.log(`Rating: ${item.rating}`);
      console.log(`Review: ${item.review}`);
      console.log(`Song: ${item.songName}`);
      console.log('------------------');
    });
  }
*/

  async function fetchUsersReviews(){
    
  }

  async function getTopUserArtists() {
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

  fetchSimilarArtists(topTwoArtists);
}


async function fetchSimilarArtists(artists) {
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

    setApiResponse(combinedArtists);

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function getTopRatedReview(reviews) {
  const maxRating = Math.max(...reviews.map(review => review.rating));
  const topRatedReviews = reviews.filter(review => review.rating === maxRating);

  // If there are multiple reviews with the highest rating, pick a random one.
  const randomReview = topRatedReviews[Math.floor(Math.random() * topRatedReviews.length)];
  
  return randomReview;
}

async function fetchRecommendedSongs() {
  const topReview = getTopRatedReview(reviews);
  if (topReview) {
    const apiKey = 'a7e2af1bb0cdcdf46e9208c765a2f2ca'; 
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${topReview.artistName}&track=${topReview.songName}&api_key=${apiKey}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.similartracks && data.similartracks.track) {
        setApiResponseSongs(data);
      } else {
        console.error('Invalid API response format for song recommendations');
      }
    } catch (error) {
      console.error(error);
    }
    
  }
}

async function fetchRecommendedSongsForSearch(artist, song) {
  const apiKey = 'a7e2af1bb0cdcdf46e9208c765a2f2ca'; 
  const url = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${song}&api_key=${apiKey}&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.similartracks && data.similartracks.track) {
      setSearchResults(data); // Save the search results to the new state
  } else {
      console.error('Invalid API response format for song recommendations');
  }
  } catch (error) {
    console.error(error);
  }
}

const ArtistItem = ({ artistName }) => (
  <View style={styles.artistItemContainer}>
    <View style={styles.circle} />
    <Text style={styles.artistName}>{artistName}</Text>
  </View>
);

return (
  <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 5}}>
<View style={styles.songInputContainer}>
    <Text style={styles.topHeader}>Find Similar Songs</Text>
    
    <TextInput
        style={styles.songInput}
        value={inputSong}
        onChangeText={(text) => setInputSong(text)}
        placeholder="Song name"
        placeholderTextColor="gray"
    />
    <TextInput
        style={styles.songInput}
        value={inputArtist}
        onChangeText={(text) => setInputArtist(text)}
        placeholder="Artist name"
        placeholderTextColor="gray"
    />
  
      <Button
          title="Get Recommended Songs"
          onPress={() => fetchRecommendedSongsForSearch(inputArtist, inputSong)}
      />
      {searchResults && (
        <View>
          <Text style={styles.header}>Search Results:</Text>
          {searchResults.similartracks.track.slice(0, 6).map((item, index) => (
            <Text key={index} style={styles.artistName}>{item.name}</Text>
          ))}
        </View>
      )}
    </View>
    <View>
      <Text style={styles.header}>Recommended Artists</Text>
      <FlatList 
          data={apiResponse && apiResponse.slice(0, 7)}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ArtistItem artistName={item} />}
      />
    </View>

    <View>
      <Text style={styles.header}>Recommended Songs For You</Text>
      {apiResponseSongs && apiResponseSongs.similartracks.track.slice(0, 6).map((item, index) => (
        <Text key={index} style={styles.ArtistName}>{item.name}</Text>
      ))}
    </View>

   

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
});

export default Recommendations;