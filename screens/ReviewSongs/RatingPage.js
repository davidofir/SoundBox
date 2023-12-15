import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, 
  TouchableWithoutFeedback, Keyboard, Modal, Animated, ActivityIndicator, Linking, ScrollView, Alert
} from "react-native";
import { authentication, db } from "../../firebase";
import Toast from 'react-native-toast-message';
import defaultCoverArt from '../../assets/defaultSongImage.png';
import StarRating from 'react-native-star-rating-widget'; //Source: https://github.com/bviebahn/react-native-star-rating-widget#animationConfig

import {storeReviewData, RatingModel, getSongReviews} from "./ReviewStorage";
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { getTrackID } from "../../domain/SpotifyAPI/SpotifyAPI";

const RatingPage = ({ navigation, route }) => {
  const userId = authentication.currentUser.uid;
  const {
    paramSongName: songName,
    paramSearched: isSearched,
    paramCoverArtUrl: coverArtUrl,
    paramArtistName: possibleArtistName,
    paramSearchedArtist: searchedArtistName
  } = route.params;
  const artistName = isSearched === 1 ? searchedArtistName : possibleArtistName;
  const defaultCoverArtUri = Image.resolveAssetSource(defaultCoverArt).uri;
  const albumArt = coverArtUrl === 3 ? defaultCoverArtUri : coverArtUrl;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButtons, setIsLoadingButtons] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalY] = useState(new Animated.Value(Dimensions.get('window').height));
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const windowHeight = Dimensions.get('window').height;
  const [avgRating, setAvgRating] = useState(0); 
  const [numberOfReviews, setNumberOfReviews] = useState(0); 
  const [usersReview, setUsersReview] = useState(null);
  const [usersStarRating, setUsersStarRating] = useState(0);
  const [albumTitle, setAlbumTitle] = useState("");
  const [datePublished, setDatePublished] = useState();
  const [duration, setDuration] = useState();
  const [genres, setGenres] = useState();
  const [reviewButton, setReviewButton] = useState("Review This Song")

  //Set the title of the page
  useLayoutEffect(() => {
      navigation.setOptions({
          title: "Review" 
      });
  }, [navigation]);

  useEffect(() => {
    setIsLoadingButtons(true)
    prepareReviewButtons();
    prepareTrackInfo() 
}, []);

const prepareTrackInfo = async () => {
  this.trackModel = new TrackModel();
  try {
      const trackInfo = await this.trackModel.fetchTrackInfo(songName, artistName);
      
      // Check if 'album' object exists. If not, set "Released as A Single"
      if (trackInfo.track && trackInfo.track.album) {
          setAlbumTitle(trackInfo.track.album.title);
      } else {
          setAlbumTitle("(Released as A Single)");
      }

      // Set duration if available
      if (trackInfo.track && trackInfo.track.duration) {
        const durationInMilliseconds = trackInfo.track.duration;
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;

        // Format the time to XX:XX
        const formattedDuration = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
        if (duration == '00:00'){
          setDuration("duration not available");
        } else {
          setDuration(formattedDuration);
        }
    } else {
        setDuration("duration not available");
    }


      // Check if 'wiki' object exists for publish date
      if (trackInfo.track && trackInfo.track.wiki) {
        const fullPublishedDate = trackInfo.track.wiki.published;
        const datePublished = fullPublishedDate.split(",")[0]; // Take only the date part
        setDatePublished(datePublished);
      } else {
          setDatePublished("Publish date not available");
      }

      // Set genre if available
      if (trackInfo.track && trackInfo.track.toptags && trackInfo.track.toptags.tag && trackInfo.track.toptags.tag.length > 0) {
        const excludedTags = ['joaoaksnes', 'MySpotigramBot', "-1001819731063"]; // Add more tags to exclude here
        const filteredTags = trackInfo.track.toptags.tag.filter(tag => !excludedTags.includes(tag.name));
        const genres = filteredTags.map(tag => tag.name);
    
        let topTwoGenres = '';
        if (genres.length > 0) {
            topTwoGenres = genres.slice(0, 2).join(", ");
        } else {
            topTwoGenres = "Tags not available";
        }
    
        setGenres(topTwoGenres);
    } else {
        setGenres("Tags not available");
    }

  } catch (error) {
      console.error("Error getting track info", error);
  }
}

  const prepareReviewButtons = async () => {
    const fetchedReviews = await getSongReviews(songName, artistName);
    fetchStarRatingAverage(fetchedReviews);
    fetchLoggedUserReview(fetchedReviews);
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

  const fetchLoggedUserReview = (fetchedReviews) => {
    const userReview = fetchedReviews.find(review => review.userId === userId);

    if (userReview) {
      // Found the user's review
      
      setUsersReview(userReview); // Set the found review in state
      setUsersStarRating(userReview.rating)
      setReviewButton("Update Your Review")
    } else {
      setUsersReview(null); // Set state to null if no review is found
      setUsersStarRating(null)
    }
    setIsLoadingButtons(false)

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

      await storeReviewData(userId, artistName, songName, rating, coverArtUrl, message);

      // Close modal and show toast notification
      closeModal();
      showToast('Success!', 'Review Successfully Posted');
      prepareReviewButtons();
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

  const openSpotify = async () => {
    let trackId = null;
  
    try {
      trackId = await getTrackID(songName, artistName);
      if (trackId) {
        const spotifyUri = `spotify:track:${trackId}`;
  
        // Prompt the user with a confirmation dialog
        Alert.alert(
          'Open Spotify',
          'Do you want to open this song in Spotify?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            { 
              text: 'OK', 
              onPress: () => {
                // Check if the Spotify app is installed
                Linking.canOpenURL(spotifyUri).then((supported) => {
                  if (supported) {
                    Linking.openURL(spotifyUri);
                  } else {
                    // Open the track in the Spotify web if the app is not installed
                    Linking.openURL(`https://open.spotify.com/track/${trackId}`);
                  }
                });
              }
            },
          ],
          { cancelable: true }
        );
      } else {
        showToast('Error', 'Spotify Link Not Found');
      }
    } catch (error) {
      console.log(error);
      showToast('Error', 'There was a problem fetching the Spotify link');
    }
  };
  
  const openAppleMusic = async () => {
    try {
      // Construct the Apple Music URL for the app
      const appleMusicAppUrl = `apple-music://music.apple.com/search?term=${songName}+${artistName}`;
  
      // Check if the Apple Music app is installed
      const supported = await Linking.canOpenURL(appleMusicAppUrl);
  
      if (supported) {
        await Linking.openURL(appleMusicAppUrl); // Open in the Apple Music app
        
      } else {
        // Construct the Apple Music URL for the web
        const appleMusicWebUrl = `https://music.apple.com/search?term=${songName}+${artistName}`;
        await Linking.openURL(appleMusicWebUrl); // Open in the web browser
        
      }
    } catch (error) {
    }
  };
  
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView>
          
          <View style={styles.songInfoContainer}>
            
            
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={openSpotify} style={{ paddingRight: 15, marginTop: 180 }}>
                <Image
                  source={require('../../assets/spotify.png')}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
              <Image source={{ uri: albumArt }} style={styles.albumArtStyle} />
              <TouchableOpacity onPress={openAppleMusic} style={{ paddingLeft: 15, marginTop: 180 }}>
                <Image
                  source={require('../../assets/appleMusic.png')}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textStyleSong}>{songName}</Text>
            <Text style={styles.textStyleArtist}>{artistName}</Text>

 
            {/*Song Info */}
            <View style={styles.infoContainer}>
              <View style={styles.labelColumn}>
                <Text style={styles.textStyleLabel}>Album: {albumTitle.length > 28 ? '\n' : ''}</Text>
                <Text style={styles.textStyleLabel}>Date Published:</Text>
                <Text style={styles.textStyleLabel}>Duration:</Text>
                <Text style={styles.textStyleLabel}>Tags:</Text>
              </View>
              <View style={styles.valueColumn}>
                <Text style={styles.textStyleInfo}>{albumTitle}</Text>
                <Text style={styles.textStyleInfo}>{datePublished}</Text>
                <Text style={styles.textStyleInfo}>{duration}</Text>
                <Text style={styles.textStyleInfo}>{genres}</Text>
              </View>
            </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("LoggedUsersReviewPage", {
              review: usersReview
            })}>
              {isLoadingButtons ? (
                  <ActivityIndicator size="medium" color="#040f13" />
              ) : (
                  <View>
                      <Text style={styles.buttonText}>View Your Review</Text>
                      
                      {usersStarRating !== null ? (
                          <View pointerEvents="none">
                              <StarRating
                                  rating={usersStarRating}
                                  editable={false} //stars non-interactive
                                  starSize={20}
                                  onChange={() => {}}
                                  enableSwiping={false}
                                  color="black"
                              />
                          </View>
                      ) : (
                          <Text style={styles.noReviewText}>(No Review Found)</Text>
                      )}
                  </View>
              )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("SongReviewsPage", {
              songName: songName,
              artistName: artistName,
            })}
            >
              {isLoadingButtons ? (
                    <ActivityIndicator size="medium" color="#040f13" />
                  ) : (
                    <View>
                      <Text style={styles.reviewText}>View Reviews ({numberOfReviews})</Text>
                      <Text style={styles.rating}>Average Rating: {avgRating}★'s</Text>
                    </View>

                  )}
            </TouchableOpacity>
          </View>

          {/* Trigger button for the modal */}
          <TouchableOpacity onPress={openModal} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>{reviewButton}</Text>
          </TouchableOpacity>
         
          {/* Modal Definition */}
          <Modal
            animationType="none" // Animated for the modal animation
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
                    <Text style={styles.modalStyleArtist}>{artistName}</Text>
                  </View>
                </View>
                <View style={styles.modalContent}>
                  <StarRating rating={rating} onChange={setRating} starSize={50}  />
                  <Text style={styles.textStyle}>{"(" + rating + " / 5)"}</Text>
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
          
          </ScrollView>
      </TouchableWithoutFeedback>
      <Toast />
    </>
  );
};

export default RatingPage;

const styles = StyleSheet.create({
  songInfoContainer: {
    backgroundColor: '#e3e4e6', 
    borderRadius: 10,
    padding: 10,
    margin: 10, 
    alignItems: 'center',
 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.70,
    shadowRadius: 3.22,
    elevation: 9,
    
  },

  textStyle: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 0,
    marginBottom: 15,
  },

  textStyleSong: {
    fontSize: 29,
    marginTop: 10,
    alignItems: "baseline",
    fontWeight: "bold",
    textAlign: 'center',
  },
  textStyleArtist: {
    fontSize: 23,
    marginTop: 0,
    alignItems: "baseline",
    fontWeight: "bold",
    color: "#4e4c4c",
    textAlign: 'center',
    marginBottom: 0
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 10,
    marginHorizontal: 9
  },
  labelColumn: {
    width: 120, 
    paddingRight: 10,
    
  },
  valueColumn: {
    flex: 1, // Take up remaining space
    alignItems: 'flex-end', 
  },
  textStyleLabel: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textStyleInfo: {
    marginBottom: 20,
    textAlign: 'right', // Align text to the right
  },
  buttonStyle: {
    backgroundColor: '#24364D',  
    paddingVertical: 15,       
    paddingHorizontal: 30,    
    borderRadius: 25,         
    alignSelf: 'stretch',       
    marginHorizontal: 20,       
    justifyContent: 'center',   
    alignItems: 'center',  
    marginVertical: 5,     
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 60
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: 'bold',         
  },
  modalView: {
    position: 'absolute',
    bottom: 0, 
    width: '100%', 
    height: "100%",
    backgroundColor: '#F4F4F4',
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
    borderColor: 'black',
    borderWidth: 0.3,

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
  input: {
    height: 250,
    width: 360,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
    textAlignVertical: 'top', 
  },
  albumArtStyle: {
    width: 230,
    height: 230,
    resizeMode: 'contain', 
    marginVertical: 0,
    borderColor: 'black',
    borderWidth: 0.3
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
    marginTop: 7,
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
    height: 70, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    alignItems: "center",
    alignContent: "center",
    fontSize: 12
  },
  scrollViewContent: {
    paddingTop: 20, 
    paddingBottom: 20, 
  },
});
