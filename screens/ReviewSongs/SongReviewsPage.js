import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getSongReviews } from './ReviewStorage';

const SongReviewsPage = ({ route, navigation }) => {
    const { songName, artistName } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status

    //Set the title of the page
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Reviews For:" 
        });
    }, [navigation]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getSongReviews(songName, artistName);
    
                // Sorting reviews based on the number of likes (descending order)
                const sortedReviews = fetchedReviews.sort((a, b) => {
                    return b.likes.length - a.likes.length;
                });
    
                setReviews(sortedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false); // Set loading to false when the fetch is complete
            }
        };
    
        fetchReviews();
    }, []);

    const renderReview = (review) => {
        return (
            <View key={review.id} style={styles.reviewContainer}>
                <Text style={styles.reviewText}>User: {review.username}</Text>
                <Text style={styles.reviewText}>Rating: {review.rating}</Text>
                <Text style={styles.reviewText}>Review: {review.review}</Text>
                <Text style={styles.reviewText}>Date: {new Date(review.creationTime).toLocaleString()}</Text>
                <Text style={styles.reviewText}>Likes: {review.likes.length}</Text>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{songName}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="black" />
            ) : reviews.length > 0 ? (
                reviews.map(renderReview)
            ) : (
                <Text style={styles.noReviewsText}>There aren't any reviews for this song yet!
                </Text>
                
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reviewContainer: {
        backgroundColor: 'lightgray',
        padding: 15,
        borderRadius: 5,
        marginVertical: 8,
        width: '100%',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 3,
    },
    reviewText: {
        fontSize: 16,
        marginBottom: 5,
    },
    noReviewsText: {
        fontSize: 25,
        color: '#353a42',
        marginTop: 40,
        textAlign: 'center'
    },

});

export default SongReviewsPage;