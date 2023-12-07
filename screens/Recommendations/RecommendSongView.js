import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getRecommendedSongs } from './RecommendSongs';

const SongRecommendations = ({ navigation }) => {
  const [songRecommendations, setSongRecommendations] = useState([]);
  const [allSongRecommendations, setAllSongRecommendations] = useState([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const defaultCoverArt = require('../../assets/defaultSongImage.png');
  useEffect(() => {
    loadSongRecommendations();
  }, []);

  async function loadSongRecommendations() {
    try {
      setIsLoadingSongs(true);
      const songRecs = await getRecommendedSongs();
      setSongRecommendations(songRecs);
      setAllSongRecommendations(songRecs.slice(0, 30));
      setIsLoadingSongs(false);
    } catch (error) {
      console.error('Failed to fetch song recommendations:', error);
      setIsLoadingSongs(false);
    }
  }

  const RecommendedSongCell = memo(({ songItem }) => {
  

    return (
      <TouchableOpacity onPress={() => {navigation.navigate('RatingPage', {      
        paramArtistName: songItem.artist.name,
        paramSongName: songItem.name,
        paramCoverArtUrl: songItem.coverArtUrl})}}>

        <View style={styles.songBox}>
          <Image
            source={songItem.coverArtUrl ? { uri: songItem.coverArtUrl } : defaultCoverArt}
            style={styles.songImage}
          />
          <Text style={styles.songName}>{songItem.name}</Text>
          <Text style={styles.artistName}>{songItem.artist.name}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View>
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
          data={songRecommendations.slice(0, 6)}
          renderItem={({ item }) => <RecommendedSongCell songItem={item} />}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Interact with the app to receive tailored recommendations based on your activity.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    horizontalProfileContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 5,
        width: 'auto',
        height: 'auto',
    },

    songBox: {
        alignItems: 'center',
        marginRight: 10,
    },
    songImage: {
        width: 150,
        height: 150,
        backgroundColor: '#333',
        overflow: 'hidden',
        marginHorizontal: 6,
    },
    songName: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    artistName: {
        fontSize: 14,
        textAlign: 'center',

    },
    spinner: {
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  
export default SongRecommendations;
