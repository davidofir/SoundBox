import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, 
  TouchableWithoutFeedback, Keyboard, Modal, Animated, ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc, collection, setDoc, arrayUnion, getDocs } from "firebase/firestore";
import { authentication, db } from "../../firebase";
import Toast from 'react-native-toast-message';
import defaultCoverArt from '../../assets/defaultSongImage.png';
import StarRating from 'react-native-star-rating-widget'; //Source: https://github.com/bviebahn/react-native-star-rating-widget#animationConfig
import SongReviewsPage from "./SongReviewsPage";
import {storeReviewData, RatingModel, getSongReviews} from "./ReviewStorage";

const RatingPage = ({ navigation, route }) => {
  const userId = authentication.currentUser.uid;
  const {
    paramSongName: songName,
    paramSearched: isSearched,
    paramSongGenre: songGenre,
    paramCoverArtUrl: coverArtUrl,
    paramArtistName: artistName,
    paramSearchedArtist: searchedArtistName
  } = route.params;
  const finalArtistName = isSearched === 1 ? artistName : searchedArtistName;

  const defaultCoverArtUri = Image.resolveAssetSource(defaultCoverArt).uri;
  const albumArt = coverArtUrl === 3 ? defaultCoverArtUri : coverArtUrl;

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalY] = useState(new Animated.Value(Dimensions.get('window').height));
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const windowHeight = Dimensions.get('window').height;

  const [avgRating, setAvgRating] = useState(0); 
  const [numberOfReviews, setNumberOfReviews] = useState(0); 
  const [usersReview, setUsersReview] = useState(null);
  const [usersStarRating, setUsersStarRating] = useState(0);
  //Set the title of the page
  useLayoutEffect(() => {
      navigation.setOptions({
          title: songName 
      });
  }, [navigation]);


  useEffect(() => {
        prepareReviewButtons();
  }, []);

  const prepareReviewButtons = async () => {
    const fetchedReviews = await getSongReviews(songName, artistName);
    fetchStarRatingAverage(fetchedReviews);
    fetchUserReview(fetchedReviews);
  }

  const fetchStarRatingAverage = (fetchedReviews) => {
    try {
        if (fetchedReviews.length != 0){
          // Summing up the ratings
          const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
          const average = totalRating / fetchedReviews.length;
          setAvgRating(Number(average.toFixed(2))); 
          setNumberOfReviews(fetchedReviews.length);
        } else {
          setAvgRating(0)
          setNumberOfReviews(fetchedReviews.length);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    } 
};

  const fetchUserReview = (fetchedReviews) => {
    const userReview = fetchedReviews.find(review => review.userId === userId);

    if (userReview) {
      // Found the user's review
      
      setUsersReview(userReview); // Set the found review in state
      setUsersStarRating(userReview.rating)

    } else {
      setUsersReview(null); // Set state to null if no review is found
      setUsersStarRating(0)
    }
  }
  // Function to handle opening the modal
  const openModal = () => {

    setModalVisible(true);
    Animated.timing(modalY, {
      toValue: windowHeight * 0.1, // animate to top
      duration: 500, // in milliseconds
      useNativeDriver: false,
    }).start();
  };

  // Function to handle closing the modal
  const closeModal = () => {
    Animated.timing(modalY, {
      toValue: windowHeight, // animate back to bottom
      duration: 500, // in milliseconds
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false); // hide the modal after animation
    });
  };

  //profanity filter
  const getCensoredTextAndStore = async () => {

    const url = `https://www.purgomalum.com/service/json?text=${text}`;
    const response = await fetch(url);
    const data = await response.json();
    var message = data.result || "";
    storeReview(message);
  };

  const storeReview = async (message) => {
    try {

      setIsLoading(true); // Start loading

      await storeReviewData(userId, finalArtistName, songName, songGenre, rating, message);

      // Close modal and show toast notification
      closeModal();
      showToast('Success!', 'Review Successfully Posted');

    } catch (error) {
      console.error("Failed to store review:", error);
      showToast('Error', 'Failed to post review');
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };
  
  const showToast = (title, message) => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: title,
      text2: message,
      visibilityTime: 6000,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <Image source={{ uri: albumArt }} style={styles.albumArtStyle} />
          <Text style={styles.textStyleSong}>{songName}</Text>
          <Text style={styles.textStyleArtist}>{finalArtistName}</Text>

          {/* Trigger button for the modal */}
          <TouchableOpacity onPress={openModal} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Review This Song</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Your Review</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("SongReviewsPage", {
              songName: songName,
              artistName: artistName,
            })}
            >
              <Text style={styles.reviewText}>View Reviews ({numberOfReviews})</Text>
              <Text style={styles.rating}>Average Rating: {avgRating}★'s</Text>
              
            </TouchableOpacity>
          </View>

          {/* Modal Definition */}
          <Modal
            animationType="none" // we are using Animated for the modal animation
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                style={[
                  styles.modalView,
                  {
                    // Use the interpolate function to translate the Y position
                    transform: [
                      {
                        translateY: modalY.interpolate({
                          inputRange: [0, 300],
                          outputRange: [0, 300],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Modal header with buttons */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeModal} style={styles.modalHeaderButton}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  {isLoading ? (
                    <ActivityIndicator size="medium" color="#040f13" />
                  ) : (
                    <Text style={styles.modalHeaderText}>Reviewing:</Text>
                  )}
                  <TouchableOpacity onPress={getCensoredTextAndStore} style={styles.modalHeaderButton}>
                    <Text style={styles.modalSaveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>

                {/* Modal content */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Album Art */}
                  <Image source={{ uri: albumArt }} style={styles.modalAlbumArt} />
                  {/* Text Container for song and artist names */}
                  <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                    {/* Song name */}
                    <Text style={styles.modalStyleSong}>{songName}</Text>
                    {/* Artist name */}
                    <Text style={styles.modalStyleArtist}>{finalArtistName}</Text>
                  </View>
                </View>
                <View style={styles.modalContent}>
                  <StarRating rating={rating} onChange={setRating} starSize={50} />
                  <Text style={styles.textStyle}>{rating + " / 5"}</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setText}
                    placeholder="Write a review (optional)"
                    keyboardType="default"
                    multiline={true}
                  />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Toast />
    </>
  );

};
export default RatingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 0,
    marginBottom: 15,
  },

  textStyleSong: {
    fontSize: 29,
    marginTop: 0,
    alignItems: "baseline",
    fontWeight: "bold"
  },
  textStyleArtist: {
    fontSize: 23,
    marginTop: 0,
    alignItems: "baseline",
    fontWeight: "bold",
    color: "#4e4c4c"
  },
  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: 'row',
    marginTop: 30,
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover"
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    backgroundColor: 'black',
    fontSize: 40,
    color: "white"
  },
  buttonTextStyle: {
    color: "white"
  },
  modalView: {
    position: 'absolute',
    bottom: 0, // start from bottom
    width: '100%', // cover full screen width
    height: "100%",
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 10

  },
  modalCancelButtonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveButtonText: {
    color: '#00ab66',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHeaderText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalAlbumArt: {
    width: 100,
    height: 100,
    resizeMode: 'contain',

    marginHorizontal: 10,
    marginVertical: 20,
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
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: 'green',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    height: 250,
    width: 360,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
  },
  albumArtStyle: {
    width: 230,
    height: 230,
    resizeMode: 'contain', //the image scales to fit within the dimensions and maintain its aspect ratio
    marginVertical: 20,
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
