import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import useAccountProfileViewModel from "./AccountProfileViewModel";

//const eventsRepo = new EventsRepository;
export default ProfilePage = ({ navigation }) => {

    /* old changes
    const [username, setUser] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [reviews, setReviews] = useState([]);
    */

    // new changes - using viewmodel
    const { username, followers, following, reviews, image, navigateToFollowers, navigateToFollowing } = useAccountProfileViewModel(navigation);

    /* old changes
    // Get the current user
    var userId = authentication.currentUser.uid;
    */

    /* old changes
    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                setUser(doc.data().userName);
                setFollowers(doc.data().followers);
                setFollowing(doc.data().following);
                setReviews(doc.data().reviews);
                console.log(followers);
            })
    }, [])
    */

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={image ? { uri: image } : require('../../assets/defaultPic.png')} style={styles.profileImage} />
                <Text style={styles.username}>{username || 'Loading...'}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditAccount", { username })}>
                    <Text style={styles.editButtonText}>Edit Account</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                    <Text style={styles.statsValue}>{reviews.length}</Text>
                    <Text style={styles.statsLabel}>Posts</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text onPress={navigateToFollowers} style={styles.statsValue}>{followers.length}</Text>
                    <Text style={styles.statsLabel}>Followers</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text onPress={navigateToFollowing} style={styles.statsValue}>{following.length}</Text>
                    <Text style={styles.statsLabel}>Following</Text>
                </View>
            </View>
            <FlatList
                data={reviews}
                renderItem={({ item }) => (
                    <View style={styles.postItem}>
                        <Text style={styles.artistName}>Artist: {item.artistName}</Text>
                        <Text style={styles.reviewText}>Review: {item.review}</Text>
                        <Text style={styles.ratingText}>Rating: {item.rating}</Text>
                        <Text style={styles.songName}>Song: {item.songName}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        color: 'black',
        fontSize: 18,
        marginVertical: 10,
    },
    editButton: {
        backgroundColor: '#4f4f4f',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    statsBox: {
        alignItems: 'center',
        flex: 1,
    },
    statsValue: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statsLabel: {
        color: '#AEB5BC',
        fontSize: 12,
    },
    postItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    artistName: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        color: 'black',
        fontSize: 14,
        marginTop: 5,
    },
    ratingText: {
        color: 'black',
        fontSize: 14,
        marginTop: 5,
    },
    songName: {
        color: 'black',
        fontSize: 14,
        marginTop: 5,
    },
})