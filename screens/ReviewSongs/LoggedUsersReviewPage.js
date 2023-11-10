
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TextInput, setText} from 'react-native';
import { getSongReviews } from './ReviewStorage';
const defaultCoverArt = require('../../assets/defaultSongImage.png')
import StarRating from 'react-native-star-rating-widget';
const LoggedUsersReviewPage = ({navigation, route }) => {
    const { review } = route.params;

    // Default values or null checks
    const songName = review?.songName;
    const finalArtistName = review?.artistName;
    const rating = review?.rating;
    const postedDate = review?.creationTime;
    const albumImage = review?.albumImgURL;
    const reviewText = review?.review;
  //Set the title of the page
  useLayoutEffect(() => {
    navigation.setOptions({
        title: "Your Review:"
    });
}, [navigation]);

    if (!review) {
        // Handle the case where review is null or empty
        return (
        <View>
            <Text style={styles.noReviewsText}>You have not reviewed this song yet!</Text>
        </View>
        );
    }
    
    return(
        <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Album Art */}
                <Image 
                    source={albumImage ? { uri: albumImage } : defaultCoverArt} 
                    style={styles.modalAlbumArt} 
                    />
                {/* Text Container for song and artist names */}
                <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                {/* Song name */}
                <Text style={styles.modalStyleSong}>{songName}</Text>
                {/* Artist name */}
                <Text style={styles.modalStyleArtist}>{finalArtistName}</Text>
                {/* Date posted */}
                <Text style={styles.StyleDate}>Posted: {new Date(postedDate).toLocaleString('en-CA', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}, {new Date(postedDate).toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })}</Text>
                </View>
            </View>
            <View pointerEvents="none" style={styles.container}>
                  <StarRating
                      rating={rating}
                      editable={false} //stars non-interactive
                      starSize={50}
                      onChange={() => {}}
                      enableSwiping ={false}
                  />
                  <Text style={styles.textStyle}>{"(" + rating + " / 5)"}</Text>
                  <Text style={styles.input}>{reviewText}</Text>
              </View>
        </View>

    )
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
    modalAlbumArt: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    
        marginHorizontal: 10,
        marginVertical: 20,
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
        fontSize: 30,
        color: '#353a42',
        marginTop: 60,
        textAlign: 'center'
    },
    input: {
        height: 450,
        width: 360,
        margin: 22,
        borderWidth: 1,
        padding: 5,
        fontSize: 15,
        textAlignVertical: 'top', 
      },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
      },
    
      modalHeaderButton: {
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0)', // Transparent button
      },
      modalContent: {
        flex: 1,
        marginVertical: 20,
        alignItems: 'center',
      },
      modalStyleSong: {
        fontSize: 20,
        marginTop: 0,
        alignItems: "baseline",
        fontWeight: "bold"
      },
      modalStyleArtist: {
        fontSize: 17,
        marginTop: 0,
        alignItems: "baseline",
        fontWeight: "bold",
        color: "#4e4c4c"
      },
      StyleDate: {
        fontSize: 16,
        marginTop: 10,
        alignItems: "baseline",
      },
      buttonContainer: {
        flexDirection: 'row',
        borderRadius: 4,
        marginHorizontal: 10,
        marginTop: 20,
      },
      button: {
        padding: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 5, 
        borderWidth: 1, 
        borderColor: '#000',
        borderRadius: 15, 
      },
      reviewContainer: {
        flexDirection: 'row', // !!! Make sure the container allows for the items to be side by side
        padding: 10,
        justifyContent: 'space-between', // add space between the buttons
        alignItems: 'center',
      },
      buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
      },
      reviewText: {
        fontWeight: 'bold',
      },
      rating: {
        marginTop: 4,
      },

});

export default LoggedUsersReviewPage;