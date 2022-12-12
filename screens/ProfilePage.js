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
export default ProfilePage = ({ navigation }) => {
    const [username, setUser] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Get the current user
    var userId = authentication.currentUser.uid;

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
    }
})