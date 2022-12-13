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

    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                
                setReviews(doc.data().reviews);
                
            })
    }, [])


    function getTopUserArtists(){

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