import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const eventsRepo = new EventsRepository;
export default UserPage = ({ navigation, route }) => {
    const [username, setUser] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollow, setFollow] = useState(false);
    const { item } = route.params;

    // Get the searched user
    var userId = item.uid

    // Get the current user
    var currId = authentication.currentUser.uid;

    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);

        getDoc(userRef)
            .then((doc) => {
                setUser(doc.data().userName);
                setFollowers(doc.data().followers);
                setFollowing(doc.data().following);
                console.log(followers);

                if (followers.includes(currId) == true) {
                    setFollow(true);
                } else {
                    setFollow(false);
                }
            })
    }, [])

    // Unfollow user
    const Unfollow = () => {
        // Pass the whole followers list into an array
        // Update the array that is passed and cut the unfollowed user 
        // after modifying the array, update the array using the modified array
    }

    // Follow user
    const Follow = () => {
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
                    {following ? (
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
            <View>
                <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                </ScrollView>
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