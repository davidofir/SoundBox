import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchRecommendedArtists } from './RecommendArtists';

const ArtistRecommendations = ({ navigation }) => {
  const [artistRecommendations, setArtistRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const defaultCoverArt = require('../../assets/defaultSongImage.png');

  useEffect(() => {

    loadArtistRecommendations();

  }, []);

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

  return (
    <View>
      {/* Artist Recommendations Section */}
      <View style={styles.horizontalProfileContainer}>
        <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: '500' }]}>Discover Artists</Text>
        <Text onPress={() => navigation.navigate('ArtistsViewAllPage', { artists: artistRecommendations })} 
        style={[styles.text, { fontSize: 18, padding: 13 }]}>View all</Text>
      </View>
      <View style={styles.artistContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" style={styles.spinner} />
        ) : artistRecommendations && artistRecommendations.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {artistRecommendations.slice(0,6).map((artist, index) => (
              <View key={index} style={styles.artistView}>
                <Image
                  source={artist.imageUrl ? { uri: artist.imageUrl } : defaultCoverArt}
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
      {/* Artist Recommendations End */}
    </View>
  );
};

const styles = StyleSheet.create({
    artistContainer: {
      paddingLeft: 10,
      marginVertical: 5,
  },
  artistView: {
      alignItems: 'center', 
      marginRight: 10, 
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
  artistName: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5, 
      fontWeight: "bold"
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
  noArtistText: {
      textAlign: 'center',
  },
});

export default ArtistRecommendations;
