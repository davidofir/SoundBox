import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const RecommendedSongs = ({ route }) => {
  const { apiResponseSongs } = route.params;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 5 }}>
      <View>
        <Text style={styles.header}>Recommended Songs For You</Text>
        {apiResponseSongs ? (
          <ScrollView horizontal={true}>
            {apiResponseSongs.similartracks.track.slice(0, 6).map((item, index) => (
              <View key={index} style={styles.box}>
                <Image
                  source={defaultCoverArt}
                  style={styles.image}
                />
                <Text style={styles.songName}>{/* song name here */}</Text>
                <Text style={styles.artistName}>{/* artist name here */}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RecommendedSongs;

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 25,
      },
    image: {
      width: 130, // Adjust the image width as needed
      height: 130, // Adjust the image height as needed
      alignSelf: 'center', // Center the image horizontally
    },
    songName: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center', // Center the text horizontally
    },
    artistName: {
      fontSize: 14,
      textAlign: 'center', // Center the text horizontally
    },
    box: {
      backgroundColor: 'lightgray',
      borderRadius: 10,
      margin: 10,
      padding: 10,
      width: 150, // Adjust the width as per your preference
    },
  });
  