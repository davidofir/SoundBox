import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import * as UserRepository from "../domain/FirebaseRepository/UserRepository";
import { authentication, db } from "../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';
const eventsRepo = new EventsRepository;
export default UserPage = ({ navigation, route }) => {
    const [username, setUser] = useState('');
    const [userFollowers, setUserFollowers] = useState([]);
    const [userFollowing, setUserFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isFollow, setFollow] = useState(false);

    const { item } = route.params;

    // Get the searched user
    var userId = item.id
    async function generateRoom(user1, user2) {
        const combinedId = [user1, user2].sort().join('-');
        // Try getting the item from SecureStore
        const existingRoom = await SecureStore.getItemAsync(combinedId);
        if (!existingRoom) {
            await SecureStore.setItemAsync(combinedId, 'exists');
        }
        return combinedId;
    }
    // Get the current user
    var currId = authentication.currentUser.uid;

    // Query Firestore database with current UID
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                const userDoc2 = await getDoc(doc(db, "users", currId));
                const reviewData = await UserRepository.getUserReviewData(userId);

                setUser(userDoc.data().userName);
                setFollowers(userDoc.data().followers);
                setFollowing(userDoc.data().following);

                setUserFollowing(userDoc2.data().following);
                setUserFollowers(userDoc2.data().followers);

                if (userDoc.data().followers.includes(currId)) {
                    setFollow(true);
                } else {
                    setFollow(false);
                }

                setReviews(reviewData);
            } catch (error) {
                console.error("Error fetching user profile data:", error);
            }
        };

        fetchUserData();
    }, [userId, currId]);

    async function handlePress() {
        let roomId = await generateRoom(userId, currId);
        console.log(roomId);
        navigation.navigate("Chat", {
            roomId: roomId,
            userName: username
        });
    }
    // Unfollow user
    const Unfollow = () => {
        // Pass the whole followers list into an array
        // Update the array that is passed and cut the unfollowed user 
        // after modifying the array, update the array using the modified array
        var tempFollowers = followers;
        var tempFollowing = userFollowing;

        tempFollowers.splice(tempFollowers.indexOf(currId), 1);
        tempFollowing.splice(tempFollowing.indexOf(userId), 1);

        // update document
        const userRef = doc(db, "users", userId);
        updateDoc(userRef, {
            followers: tempFollowers
        })
        const userRef2 = doc(db, "users", currId);
        updateDoc(userRef2, {
            following: tempFollowing
        })

        setFollow(false);

    }

    // Follow user
    const Follow = () => {
        var tempFollowers = followers;
        var tempFollowing = userFollowing;

        tempFollowers.push(currId);
        tempFollowing.push(userId);

        // update document
        const userRef = doc(db, "users", userId);
        updateDoc(userRef, {
            followers: tempFollowers
        })
        const userRef2 = doc(db, "users", currId);
        updateDoc(userRef2, {
            following: tempFollowing
        })

        setFollow(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../assets/defaultPic.png')} style={styles.profileImage} />
                <Text style={styles.username}>{username || 'Loading...'}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <View style={styles.padding}>
                        {isFollow ? (
                            <TouchableOpacity onPress={Unfollow} style={styles.buttonStyle}>
                                <Text style={styles.buttonText}>Unfollow</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={Follow} style={styles.buttonStyle}>
                                <Text style={styles.buttonText}>Follow</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.padding}>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => {
                                handlePress();
                            }}
                        >
                            <Text style={styles.buttonText}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                    <Text style={styles.statsValue}>{reviews.length}</Text>
                    <Text style={styles.statsLabel}>Posts</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text onPress={() => navigation.navigate('Followers', { followerArray: followers })} style={styles.statsValue}>
                        {followers.length}
                    </Text>
                    <Text style={styles.statsLabel}>Followers</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text onPress={() => navigation.navigate('Following', { followingArray: following })} style={styles.statsValue}>
                        {following.length}
                    </Text>
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
        backgroundColor: '#1f1f2e',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        color: 'white',
        fontSize: 18,
        marginVertical: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonStyle: {
        width: 100,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    buttonText: {
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
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statsLabel: {
        color: 'gray',
        fontSize: 12,
    },
    postItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: '#3d3d59',
        borderRadius: 10,
    },
    postText: {
        fontSize: 16,
    },
    padding: {
        marginHorizontal: 6,
    },
    artistName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
    },
    ratingText: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
    },
    songName: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
    },
})