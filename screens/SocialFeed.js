import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

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

    /* old change
    useEffect(() => {
        for (let i = 0; i < following.length; i++) {
            const userRef2 = doc(db, "users", following[i]);
            getDoc(userRef2)
                .then((doc) => {
                    for (let i = 0; i < doc.data().reviews.length; i++) {
                        tempeviews.push(doc.data().reviews[i]);
                        setReviews(tempeviews);
                    }
                })
        }
    }, [reviews])
    */

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
        <View>
            {/* <View style={styles.backgroundContainer}>
                <View style={styles.verticalProfileContainer}>
                    <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                        <View style={styles.circle} />
                        <Text>Email: {authentication.currentUser?.email}</Text>
                    </View>
                </View>
                <View style={styles.followContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Posts</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>14</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text, styles.subText]}>Followers</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>124</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Following</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>119</Text>
                    </View>
                </View>
            </View> */}
            <View style={styles.horizontalProfileContainer}>
                <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: "500" }]}>Disover Artists</Text>
                <Text onPress={() => navigation.navigate("Discover")} style={[styles.text, { fontSize: 18, padding: 10 }]}>View all</Text>
            </View>
            <View style={{ marginTop: 10 }}>
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
                {/* <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                    <View>
                        <View style={styles.verticalImageContainer} />
                    </View>
                </ScrollView> */}
            </View>
            <View style={styles.container2}>
                <FlatList
                    data={reviews}
                    renderItem={({ item }) => (
                        <View style={styles.postContainer}>
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
        alignItems: 'center',
        justifyContent: "flex-start",
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
    imageContainer: {
        width: 120,
        height: 150,
        borderRadius: 12,
        backgroundColor: "black",
        overflow: "hidden",
        marginHorizontal: 6
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
    postContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        padding: 10,
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
    },
    postContent: {
        marginTop: 10,
    },
    artistName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        marginTop: 5,
    },
    ratingText: {
        fontSize: 14,
        marginTop: 5,
    },
    songName: {
        fontSize: 14,
        marginTop: 5,
    },
})