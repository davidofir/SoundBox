import React, { useEffect, useState } from "react";
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

const RatingModel = {

  async getUserReviews(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);  
    return docSnapshot.data()?.reviews || [];
  },

  async getUserData(userId) {
    const userRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    return userData.userName
  },

  async addReview(userId, reviewData) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      reviews: arrayUnion(reviewData),
    });
  },
};

const RatingPage = ({ navigation, route }) => {
  const userId = authentication.currentUser.uid;
  const [reviews, setReviews] = useState([]);
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
  const [defaultRating, setDefaultRating] = useState(0);
  const maxRating = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    const loadReviews = async () => {
      const userReviews = await RatingModel.getUserReviews(userId);
      setReviews(userReviews);
    };
    loadReviews();
  }, []);

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

      // Generating a new document inside the 'reviews' collection
      // Firestore will automatically create a unique ID for this document
      const reviewRef = doc(collection(db, "reviews"));
      var reviewUUID = reviewRef.id
      const reviewData = {
        id: reviewRef.id, // Firestore generated unique ID
        userId: userId,
        username: await RatingModel.getUserData(userId),
        artistName: finalArtistName,
        songName: songName,
        creationTime: new Date().toISOString(),
        rating: rating,
        review: message,
        genre: songGenre,
        likes: [],
      };

      // Save the review data to the new document in the 'reviews' collection.
      await setDoc(reviewRef, reviewData);

      // Reference the 'artists' collection and the specific artist's document.
      const artistDocRef = doc(db, "artists", finalArtistName);

      // Reference the specific song's document.
      const songDocRef = doc(artistDocRef, "songs", songName);

      // Check if the song already exists.
      const songDocSnapshot = await getDoc(songDocRef);
      if (!songDocSnapshot.exists()) {
        // If the song does not exist, create a new song document with the first review ID.
        await setDoc(songDocRef, {
          reviewIds: [reviewUUID] // Use the ID from the reviewRef.
        });
      } else {
        // If the song exists, add the review ID to the song's document.
        await updateDoc(songDocRef, {
          reviewIds: arrayUnion(reviewRef.id)
        });
      }

      // update the user's document with the new review ID.
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        reviewIds: arrayUnion(reviewRef.id)
      });

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
              <Text style={styles.reviewText}>View Reviews</Text>
              <Text style={styles.rating}>Avg Rating: 2 stars</Text>
              
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
                  <Text style={styles.textStyle}>{rating + " / " + maxRating.length / 2}</Text>
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
    margin: 5, // This adds space between the buttons
    borderWidth: 1, // Adjust as needed
    borderColor: '#000',
    borderRadius: 15, // This should be enough to create a rounded look
  },
  reviewContainer: {
    flexDirection: 'row', // Make sure the container allows for the items to be side by side
    padding: 10,
    justifyContent: 'space-between', // This will add space between the buttons
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
