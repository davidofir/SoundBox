import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../firebase";
import { PanResponder } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

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
    this.defaultRating = 2;
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
  var finalArtistName = "";

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

  const getCensoredText = async () => {
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

    navigation.navigate("Discover");
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textStyle}> Rate This Song </Text>
        <Text style={styles.textStyleSong}> {songName}</Text>
        <Text style={styles.textStyleArtist}> {finalArtistName}</Text>
        
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
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={() => { getCensoredText() }}
        >
          <Text style={{ color: 'white' }}>Save Review</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    fontSize: 23,
    marginTop: 20,
  },
  textStyleSong: {
    fontSize: 29,
    marginTop: 20,
    alignItems: "baseline",
    fontWeight: "bold"
  },
  textStyleArtist: {
    fontSize: 23,
    marginTop: 20,
    alignItems: "baseline",
    fontWeight: "bold",
    color: "lightslategrey"
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
  input: {
    height: 150,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
