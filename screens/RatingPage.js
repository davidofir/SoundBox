import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { authentication, db } from "../firebase";
import { loggedInUser } from "./Register/Register";


const RatingPage = ({ navigation, route }) => {

    const [reviews, setReviews] = useState([]);
    const artistName1 = route.params.paramArtistName
    const songName = route.params.paramSongName
    const searchedArtistName = route.params.paramSearchedArtist
    const isSearched = route.params.paramSearched
    var finalArtistName = ""

    if (isSearched == 0) {
        finalArtistName = artistName1
    } else {
        finalArtistName = searchedArtistName
    }

    //const userRef = doc(db, "users", userId);
    var userId = authentication.currentUser.uid
    //test = isSearched

    //firebase doc named after the artist the review is under
    const docRef = doc(db, "artists", finalArtistName, songName, userId)

    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                setReviews(doc.data().reviews);
            })
    }, [])

    //const childPath = `review/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

    const [defaultRating, setdefaultRating] = useState(2)
    const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5])


    //-------------MUST CHANGE--------------
    const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

    //Profanity API
    const [text, setText] = useState('')
    const url = `https://www.purgomalum.com/service/json?text=${text}`

    async function getCensoredText() {
        const response = await fetch(url);
        const data = await response.json();
        var message = data.result;
        //if they do not want to include a message
        if (message == null) {
            message = ""
        }
        storeReview(message);
    }

    //sending the review to be stored in firebase
    function storeReview(message) {

        const reviewData = {

            artistName: finalArtistName,
            songName: songName,
            creationTime: new Date().toUTCString(),
            rating: defaultRating,
            review: message,

        }

        reviews.push(reviewData);
        const userRef = doc(db, "users", userId);
        updateDoc(userRef, {
            reviews: reviews
        })

        setDoc(docRef, reviewData).then(() => {
            console.log("Document has been added")
        })
            .catch(error => {
                console.log(error);
            })


        navigation.navigate("Discover")
    }








    const CustomRatingBar = () => {
        return (
            <View style={styles.customRatingBarStyle}>
                {
                    maxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                                onPress={() => setdefaultRating(item)}
                            >
                                <Image
                                    style={styles.starImgStyle}
                                    source={
                                        item <= defaultRating
                                            ? { uri: starImgFilled }
                                            : { uri: starImgCorner }
                                    }
                                />

                            </TouchableOpacity>
                        )
                    })
                }

            </View>
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.textStyle}> Rate This Song </Text>
                <Text style={styles.textStyleSong}> {songName}</Text>
                <Text style={styles.textStyleArtist}> {finalArtistName}</Text>

                <CustomRatingBar />
                <Text style={styles.textStyle}>
                    {defaultRating + ' / ' + maxRating.length}
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

export default RatingPage