import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons'; // Import the FontAwesome icons
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const eventsRepo = new EventsRepository;
export default SocialFeed = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [following, setFollowing] = useState([]);
    var tempeviews = reviews;

    // Get the current user
    var userId = authentication.currentUser.uid;

    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                setFollowing(doc.data().following);
                /*old change
                setReviews(doc.data().reviews);
                */
            })
    }, [])

    // new change
    useEffect(() => {
        for (let i = 0; i < following.length; i++) {
            const userRef2 = doc(db, "users", following[i]);
            getDoc(userRef2)
                .then((doc) => {
                    for (let i = 0; i < doc.data().reviews.length; i++) {
                        const userReviews = {
                            ...doc.data().reviews[i],
                            username: doc.data().userName,
                        };
                        tempeviews.push(userReviews);
                    }
                    setReviews([...tempeviews]);
                })
        }
    }, [following])

    return (
        < View style={styles.container} >
            <ScrollView>
                <View style={styles.horizontalProfileContainer}>
                    <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: '500' }]}>Discover Artists</Text>
                    <Text onPress={() => navigation.navigate('Discover')} style={[styles.text, { fontSize: 18, padding: 13 }]}>View all</Text>
                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View>
                            <Image source={require("../assets/artists/jayz.png")} style={styles.imageContainer} />
                        </View>
                        <View>
                            <Image source={require("../assets/artists/Yonce.png")} style={styles.imageContainer} />
                        </View>
                        <View>
                            <Image source={require("../assets/artists/cee.png")} style={styles.imageContainer} />
                        </View>
                        <View>
                            <Image source={require("../assets/artists/swift.png")} style={styles.imageContainer} />
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.container2}>
                    {reviews.map((item, index) => (
                        <View style={styles.postContainer} key={index}>
                            <View style={styles.postHeader}>
                                <Image source={require("../assets/defaultPic.png")} style={styles.profileImage} />
                                <Text style={styles.username}>{item.username}</Text>
                            </View>
                            <View style={styles.postContent}>
                                <Text style={styles.artistName}>Artist: {item.artistName}</Text>
                                <Text style={styles.reviewText}>Review: {item.review}</Text>
                                <Text style={styles.ratingText}>Rating: {item.rating}</Text>
                                <Text style={styles.songName}>Song: {item.songName}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Social Media Navigation Bar */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity>
                    <FontAwesome name="home" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <FontAwesome name="search" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Discover")}>
                    <FontAwesome name="plus-square" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <FontAwesome name="heart" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1f2e',
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    horizontalProfileContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 5,
        width: 'auto',
        height: 'auto',
    },
    imageContainer: {
        width: 120,
        height: 150,
        borderRadius: 12,
        backgroundColor: 'black',
        overflow: 'hidden',
        marginHorizontal: 6,
    },
    postContainer: {
        backgroundColor: '#3d3d59',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        width: 370,
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    text: {
        color: '#8c8c9c',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    postContent: {
        marginTop: 10,
    },
    artistName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    reviewText: {
        fontSize: 14,
        marginTop: 5,
        color: 'white',
    },
    ratingText: {
        fontSize: 14,
        marginTop: 5,
        color: 'white',
    },
    songName: {
        fontSize: 14,
        marginTop: 5,
        color: 'white',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1f1f2e',
        paddingBottom: 35,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#29293d',
    },
})