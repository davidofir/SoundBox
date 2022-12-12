import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard} from 'react-native';



const RatingPage = ({route}) => {
    
    const artistName = route.params.paramArtistName
    const songName = route.params.paramSongName
    const searchedArtistName = route.params.paramSearchedArtist
    const isSearched = route.params.paramSearched
    //test = isSearched

    //const childPath = `review/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

    const [defaultRating, setdefaultRating] = useState(2)
    const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5])
    
    const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

    //Profanity API
    const [text, setText] = useState('')
    const url = `https://www.purgomalum.com/service/json?text=${text}`
    async function getCensoredText() {
        const response = await fetch(url);
        const data = await response.json();
        const message = `${defaultRating} stars \n ${data.result}`;
        alert(message);
    }
    
    /*
    const SaveReview = async () => {
        
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put()

        firebase.firestore()
            .collection("artists")
            .doc(firebase.auth().artistName)
            .collection("userReviews")
            .add({
                
                songName,
                defaultRating,
                message,
                creation: firebase.firestore.FieldValue.serverTimestamp()

            })

    }
    */

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
    if (isSearched == 0) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.textStyle}> Rate This Song </Text>
                <Text style={styles.textStyleSong}> {songName}</Text>
                <Text style={styles.textStyleArtist}> {artistName}</Text>
    
                <CustomRatingBar />
                <Text style={styles.textStyle}>
                    {defaultRating + ' / ' + maxRating.length}
                </Text>
    
                <TextInput
                    style={styles.input}
                    onChangeText={text => setText(text)}
                    placeholder="Write a review (optional)"
                    keyboardType="alphabetical"
                    multiline = {true}
                    
                    
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.buttonStyle}
                    onPress={getCensoredText}
                >
                    <Text style={{ color: 'white' }}>Save Review</Text>
                </TouchableOpacity>
            </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    } else {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.textStyle}> Rate This Song </Text>
                <Text style={styles.textStyleSong}> {songName}</Text>
                <Text style={styles.textStyleArtist}> {searchedArtistName}</Text>
    
                <CustomRatingBar />
                <Text style={styles.textStyle}>
                    {defaultRating + ' / ' + maxRating.length}
                </Text>
    
                <TextInput
                    style={styles.input}
                    onChangeText={text => setText(text)}
                    placeholder="Write a review (optional)"
                    keyboardType="alphabetical"
                    multiline = {true}
                    
                    
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.buttonStyle}
                    onPress={getCensoredText}
                >
                    <Text style={{ color: 'white' }}>Save Review</Text>
                </TouchableOpacity>
            </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
    

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
        color:"lightslategrey"
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