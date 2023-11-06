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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../../firebase";
import { Modal, Animated } from 'react-native';
import Toast from 'react-native-toast-message';

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
    const reviewData = {
      artistName: finalArtistName,
      songName: songName,
      creationTime: new Date().toUTCString(),
      rating: rating,
      review: message,
      genre: songGenre,
    };

    const updatedReviews = [...reviews, reviewData];
    setReviews(updatedReviews);
    await viewModel.addReview(updatedReviews);

    closeModal();

    Toast.show({
      type: 'success', // 'success | 'error' | 'info'
      position: 'bottom',
      text1: 'Success!',
      text2: 'Review Successfully Posted',
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40, // distance from the bottom of the screen
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
          <Text style={styles.modalHeaderText}>Reviewing:</Text>
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
