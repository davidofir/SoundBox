import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { doc, getDoc, updateDoc, collection, setDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { authentication, db } from "../../firebase";
import { Modal, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';

//Source: https://github.com/bviebahn/react-native-star-rating-widget#animationConfig
import StarRating from 'react-native-star-rating-widget';

const defaultCoverArt = require('../../assets/defaultSongImage.png')

class RatingModel {
  constructor(userId) {
    this.userId = userId;
  }

  async getUserReviews() {
    const userRef = doc(db, "users", this.userId);
    const docSnapshot = await getDoc(userRef);
    const userData = docSnapshot.data();
    return userData.reviews || [];
  }

  async addReview(reviewData) {
    const userRef = doc(db, "users", this.userId);
    await updateDoc(userRef, {
      reviews: [...reviewData],
    });
  }
}

class RatingViewModel {
  constructor(userId) {
    this.model = new RatingModel(userId);
    this.defaultRating = 0;
    this.maxRating = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  }

  async getUserReviews() {
    return await this.model.getUserReviews();
  }

  async addReview(reviewData) {
    await this.model.addReview(reviewData);
  }

  getDefaultRating() {
    return this.defaultRating;
  }

  setDefaultRating(rating) {
    this.defaultRating = rating;
  }

  getMaxRating() {
    return this.maxRating;
  }
}

const RatingPage = ({ navigation, route }) => {
  const userId = authentication.currentUser.uid;
  const viewModel = new RatingViewModel(userId);

  const [reviews, setReviews] = useState([]);
  const artistName1 = route.params.paramArtistName;
  const songName = route.params.paramSongName;
  const searchedArtistName = route.params.paramSearchedArtist;
  const isSearched = route.params.paramSearched;
  const songGenre = route.params.paramSongGenre
  var albumArt = route.params.paramCoverArtUrl 
  if( albumArt == 3){
    albumArt = Image.resolveAssetSource(defaultCoverArt).uri;
  }
  var finalArtistName = "";

  //Loading wheel
  const [isLoading, setIsLoading] = useState(false);


  // State for modal visibility and animation
const [modalVisible, setModalVisible] = useState(false);
const [modalY] = useState(new Animated.Value(300)); // initial position off screen
const windowHeight = Dimensions.get('window').height;
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
 

  if (isSearched === 0) {
    finalArtistName = artistName1;
  } else {
    finalArtistName = searchedArtistName;
  }

  const [defaultRating, setDefaultRating] = useState(viewModel.getDefaultRating());
  const maxRating = viewModel.getMaxRating();
  const [text, setText] = useState("");
  const url = `https://www.purgomalum.com/service/json?text=${text}`;

  useEffect(() => {
    async function loadReviews() {
      const userReviews = await viewModel.getUserReviews();
      setReviews(userReviews);
    }
    loadReviews();
  }, []);

  const [rating, setRating] = useState(viewModel.getDefaultRating());

  const getCensoredTextAndStore = async () => {
    const response = await fetch(url);
    const data = await response.json();
    var message = data.result || "";
    storeReview(message);
  };

  const storeReview = async (message) => {

    try{
      
      setIsLoading(true); // Start loading

      // Generating a new document inside the 'reviews' collection
      // Firestore will automatically create a unique ID for this document
      const reviewRef = doc(collection(db, "reviews"));
      var reviewUUID = reviewRef.id
      const reviewData = {
        id: reviewRef.id, // Firestore generated unique ID
        userId: userId, 
        artistName: finalArtistName,
        songName: songName,
        creationTime: new Date().toISOString(), 
        rating: rating,
        review: message,
        genre: songGenre,
        likes: []
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

      // Optionally update the user's document with the new review ID.
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        reviewIds: arrayUnion(reviewRef.id)
      });

      // Add the new review to the local state if you're managing it on the client-side.
      setReviews(prevReviews => [...prevReviews, reviewData]);

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
  
  // Make sure showToast is defined or use the Toast.show() method you have
  const showToast = (title, message) => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>

        <Image
          source={{ uri: albumArt }}
          style={styles.albumArtStyle}
        />
        <Text style={styles.textStyleSong}> {songName}</Text>
        <Text style={styles.textStyleArtist}> {finalArtistName}</Text>

        {/* Trigger button for the modal */}
        <TouchableOpacity
          onPress={openModal}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonTextStyle}>Review This Song</Text>
        </TouchableOpacity>

        
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

          {/* modal content */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Album Art */}
            <Image
              source={{ uri: albumArt }}
              style={styles.modalAlbumArt}
            />
            {/* Text Container for song and artist names */}
            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}> 
              {/* Song name */}
              <Text style={styles.modalStyleSong}> 
                {songName}
              </Text>
              {/* Artist name */}
              <Text style={styles.modalStyleArtist}>
                {finalArtistName}
              </Text>
            </View>
          </View>
          <View style={styles.modalContent}>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={50}
            
            />
            <Text style={styles.textStyle}>
              {rating + " / " + maxRating.length / 2}
            </Text>


            <TextInput
              style={styles.input}
              onChangeText={text => setText(text)}
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
    // modal styling,
    position: 'absolute',
    bottom: 0, // start from bottom
    width: '100%', // cover full screen width
    height: "100%", 
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 10
    // Add shadow or elevation based on your preference
  },

  modalCancelButtonText: {
    color: 'gray', // Changed to green to match your screenshot
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveButtonText: {
    color: '#00ab66', // Changed to green to match your screenshot
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHeaderText: {
    color: 'black', // Changed to white to match your screenshot
    fontSize: 20, // Adjust the font size as needed
    fontWeight: 'bold', // If you want the text to be bold
  },
  modalAlbumArt: {
    width: 100, // Set the width as per your requirement
    height: 100, // Set the height as per your requirement
    resizeMode: 'contain', // This will ensure the image scales to fit within the dimensions and maintain its aspect ratio

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
    width: 230, // Set the width as per your requirement
    height: 230, // Set the height as per your requirement
    resizeMode: 'contain', // This will ensure the image scales to fit within the dimensions and maintain its aspect ratio
    marginVertical: 20, // Optional: Adds some vertical space above and below the image
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
    alignItems: 'center', // This centers children horizontally in the container
  },

});
