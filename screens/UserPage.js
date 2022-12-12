import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

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

    // Get the current user
    var currId = authentication.currentUser.uid;

    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);
        const userRef2 = doc(db, "users", currId);

        getDoc(userRef)
            .then((doc) => {
                setUser(doc.data().userName);
                setFollowers(doc.data().followers);
                setFollowing(doc.data().following);
                setReviews(doc.data().reviews);

                if (doc.data().followers.includes(currId) == true) {
                    setFollow(true);
                } else {
                    setFollow(false);
                }
            })

        getDoc(userRef2)
            .then((doc2) => {
                setUserFollowing(doc2.data().following);
                setUserFollowers(doc2.data().followers);
            })
    }, [])

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
        <View>
            <View style={styles.backgroundContainer}>
                <View style={styles.verticalProfileContainer}>
                    <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                        <View style={styles.circle}>
                            <Image source={require("../assets/defaultPic.png")} style={styles.circle} />
                        </View>
                        <Text>Username: {username}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {isFollow ? (
                        <TouchableOpacity
                            onPress={Unfollow}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Unfollow</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={Follow}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Follow</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.followContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Posts</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>0</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text, styles.subText]}>Followers</Text>
                        <Text onPress={() => navigation.navigate("Followers", { followerArray: followers })} style={[styles.text, { fontSize: 24 }]}>{followers.length}</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Following</Text>
                        <Text onPress={() => navigation.navigate("Following", { followingArray: following })} style={[styles.text, { fontSize: 24 }]}>{following.length}</Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={[styles.text, { fontSize: 18, padding: 10, paddingBottom: 0 }]}>POSTS</Text>
            </View>
            <View style={styles.container2}>
                {/* <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                </ScrollView> */}
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
        </View>
    )
}

const styles = StyleSheet.create({
    verticalProfileContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        margin: 10,
        width: 'auto',
        height: "auto"

    },
    backgroundContainer: {
        backgroundColor: "white"
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
        paddingTop: 5,
    },
    item: {
        flexDirection: "row",
        marginTop: 10,
        padding: 10,
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: 5,
        alignItems: "center",
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemText: {
        fontSize: 35
    },
    horizontalProfileContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
    circle: {
        width: 100,
        height: 100,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 100,
    },
    followContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 15
    },
    statsBox: {
        alignItems: "center",
        flex: 1,
        paddingBottom: 15
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    verticalImageContainer: {
        width: 370,
        height: 250,
        borderRadius: 12,
        backgroundColor: "grey",
        overflow: "hidden",
        marginVertical: 6,
        marginHorizontal: 10
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        marginTop: 5
    },
    button: {
        backgroundColor: '#0366fc',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})