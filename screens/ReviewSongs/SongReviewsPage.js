// SongReviewsPage.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getSongReviews } from './ReviewStorage'; // Assume this is the correct path to getSongReviews function

const SongReviewsPage = ({ route }) => {

    const { songName, artistName } = route.params;

    useEffect(() => {
        // Assuming getSongReviews is an async function
        const fetchReviews = async () => {
        try {
            const reviews = await getSongReviews(songName, artistName);
            // Do something with the reviews
            console.log(reviews)
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
        };

        //Returns array of reviews for the song. if no reviews are found returns empty array.
        fetchReviews();
        
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Display Song Reviews Here</Text>
        
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SongReviewsPage;