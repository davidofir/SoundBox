import React, { useEffect, useState } from 'react'
import { Feather, Entypo } from "@expo/vector-icons";
import {
  StyleSheet,

  TextInput,
  Text,
  View,
  Keyboard,
  Button,
  FlatList,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { authentication, db } from "../firebase";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";


const Recommendations = ({navigation, route}) => {

    const topArtists = []
    const topGenres = []
    const [reviews, setReviews] = useState([]);
    var userId = authentication.currentUser.uid
    var reviewCount = 0
    var reviewArray = []
    var currentArtist = ""
    var artistIndex = ""
    var currentReview = 0
    // Query Firestore database with current UID

    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                
                setReviews(doc.data().reviews);
                
                //get length of array for number of reviews
                reviewCount = doc.data().reviews.length
                //get the array of reviews
                reviewArray = doc.data().reviews
                getTopUserArtists()
            })
    }, [])

    function getTopUserArtists(){


        
        //for each review
        var meanReviewList = []
        for (let i = 0; i < reviewCount; i++ ){
            //get the current artist name
            currentArtist = reviewArray[i].artistName
            currentReview = reviewArray[i].rating
            //load current review and put artist and rating into an array

            //value = true if the current artist is already in the list | else = false
            var isAlreadyInList = meanReviewList.some((product) => product.name.includes(currentArtist))

            //check if the artist is already in the list
            if (isAlreadyInList == true){
                //get the index of the artist
                artistIndex = meanReviewList.findIndex(obj => obj.name === currentArtist)

              
                //add one to the count
                meanReviewList[artistIndex].count ++
                //add the review score to that total artists score
                meanReviewList[artistIndex].rating =  meanReviewList[artistIndex].rating + currentReview
                

         
            } else {

                //if the artist is not already in the list, add it
                meanReviewList.push({name: reviewArray[i].artistName, rating: reviewArray[i].rating, count: 1})
            }


        }
        //console.log(meanReviewList)

        var finalListCount = meanReviewList.length
        var totalScore = 0
        //take the average of each of the reviews now in the list
        for (let j = 0; j < finalListCount; j++ ){
            //get the current artist name
            
            //for each of the reviews
            //find the mean by dividing total score of reviews by the amount of reviews for that artist
            totalScore = meanReviewList[j].rating / meanReviewList[j].count
            
            //put the total score back in the review array
            meanReviewList[j].rating = totalScore

            
        }
        console.log(meanReviewList)
    }

    return (
   
            <View style={styles.container}>
                <FlatList
                    data={reviews}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemText}>
                                Artist: {item.artistName}{"\n"}
                                Review: {item.review}{"\n"}
                                Rating: {item.rating}{"\n"}
                                Song: {item.songName}
                            </Text>
                        </View>
                    )}
                />
            </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#fff',
        alignItems: 'center',

    },
    textStyle: {
        textAlign: 'top',
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
        padding: 10,
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

export default Recommendations