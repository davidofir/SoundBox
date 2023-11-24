import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome, Ionicons, Entypo, Fontisto } from '@expo/vector-icons';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import * as UserRepository from "../domain/FirebaseRepository/UserRepository";
import { authentication, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import StarRating from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';
import { getTrackID } from "../domain/SpotifyAPI/SpotifyAPI";
import { fetchRecommendedArtists } from './Recommendations/RecommendArtists';
import { ActivityIndicator } from 'react-native';
const defaultCoverArt = require('../assets/defaultSongImage.png');


const eventsRepo = new EventsRepository;
export default SocialFeed = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [following, setFollowing] = useState([]);
    const [artistRecommendations, setArtistRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Get the current user
    var userId = authentication.currentUser.uid;

    // Query Firestore database with current UID
    useEffect(() => {

        const userRef = doc(db, "users", userId);

        //get artist recommendations
        async function loadArtistRecommendations() {
            try {
                setIsLoading(true);
                const recommendations = await fetchRecommendedArtists();
                setArtistRecommendations(recommendations);
                setIsLoading(false);

            } catch (error) {
                console.error('Failed to fetch artist recommendations:', error);
                setIsLoading(false);
            }
        }
        loadArtistRecommendations();

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
        const fetchReviews = async () => {
            const tempReviews = [];

            for (let i = 0; i < following.length; i++) {
                const userRef2 = doc(db, "users", following[i]);
                const userDoc = await getDoc(userRef2);

                if (userDoc.data().reviewIds.length !== 0) {
                    const userReviews = await UserRepository.getUserReviewData(following[i]);
                    tempReviews.push(...userReviews);
                }
            }

            setReviews(tempReviews);
        };

        fetchReviews();
    }, [following])

    const LikePost = (item) => {
        var tempLikes = item.likes;

        tempLikes.push(userId)

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'reviews', item.id);
        updateDoc(reviewDoc, {
            likes: tempLikes
        })
    }

    const UnlikePost = (item) => {
        var tempLikes = item.likes;

        tempLikes.splice(tempLikes.indexOf(userId), 1);

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'reviews', item.id);
        updateDoc(reviewDoc, {
            likes: tempLikes
        })
    }

    const showToast = (title, message) => {
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: title,
            text2: message,
            visibilityTime: 6000,
            autoHide: true,
            bottomOffset: 40,
        });
    };

    const Post = ({ item, userId, LikePost, UnlikePost }) => {
        const [liked, setLiked] = useState(item.likes.includes(userId));

        const handleLike = () => {
            if (liked) {
                UnlikePost(item);
            } else {
                LikePost(item);
            }
            setLiked(!liked);
        };

        const openSpotify = async () => {
            trackId = null;
            var spotifyUri = `spotify:track:${trackId}`;

            try {
                trackId = await getTrackID(item.songName, item.artistName)
            } catch (error) {
                console.log(error)
            }

            if (trackId) {
                // Check if the Spotify app is installed
                Linking.canOpenURL(spotifyUri).then((supported) => {
                    //if app is installed open app. if not open web
                    if (supported) {
                        Linking.openURL(spotifyUri);
                    } else {
                        spotifyUri = `https://open.spotify.com/track/${trackId}`
                        Linking.openURL(spotifyUri);
                    }
                })
            } else {
                showToast('Error', 'Spotify Link Not Found');
            }
        };

        const openAppleMusic = async () => {
            try {
                // Construct the Apple Music URL for the app
                const appleMusicAppUrl = `apple-music://music.apple.com/search?term=${item.songName}+${item.artistName}`;

                // Check if the Apple Music app is installed
                const supported = await Linking.canOpenURL(appleMusicAppUrl);

                if (supported) {
                    await Linking.openURL(appleMusicAppUrl); // Open in the Apple Music app
                    console.log("Opened in Apple Music app");
                } else {
                    // Construct the Apple Music URL for the web
                    const appleMusicWebUrl = `https://music.apple.com/search?term=${item.songName}+${item.artistName}`;
                    await Linking.openURL(appleMusicWebUrl); // Open in the web browser
                    console.log("Opened in web browser");
                }
            } catch (error) {
            }
        };

        const onNavigate = (item) => {
            navigation.navigate('UserPage', { item });
        }

        const navigateProfile = async () => {
            try {
                const userRef = doc(db, "users", item.userId);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const tempUserData = userSnapshot.data();
                    const userData = { ...tempUserData, id: item.userId };

                    onNavigate(userData);
                } else {
                    console.error("User data not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        return (
            <View style={styles.postContainer}>
                <TouchableOpacity onPress={navigateProfile}>
                    <View style={styles.postHeader}>
                        <Image source={require("../assets/defaultPic.png")} style={styles.profileImage} />
                        <Text style={styles.username}>{item.username}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.albumContainer}>
                    <Image
                        source={item?.albumImgURL ? { uri: item.albumImgURL } : defaultCoverArt}
                        style={styles.modalAlbumArt}
                    />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                        <Text style={styles.modalStyleSong}>{item.songName}</Text>
                        <Text style={styles.modalStyleArtist}>{item.artistName}</Text>
                        <View style={styles.linksContainer}>
                            <TouchableOpacity onPress={openSpotify} style={{ marginRight: 10, marginTop: 10 }}>
                                <Entypo
                                    name="spotify"
                                    size={25}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openAppleMusic} style={{ marginTop: 10 }}>
                                <Fontisto
                                    name="applemusic"
                                    size={22}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.postContent}>
                    <View style={styles.likeContainer}>
                        <TouchableOpacity onPress={handleLike}>
                            <Ionicons
                                name={liked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={liked ? '#ee6055' : 'black'}
                                style={styles.likeIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.likeText}>{item.likes.length}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Comment", { item })}>
                            <Ionicons
                                name="chatbox-outline"
                                size={20}
                                color="black"
                                style={styles.commentIcon} />
                        </TouchableOpacity>
                        <Text style={styles.likeText}>{item.commentIds.length}</Text>
                    </View>

                    {/*<Text style={styles.artistName}>Artist: {item.artistName}</Text>*/}
                    <Text style={styles.reviewText}><Text style={styles.username}>{item.username}</Text> {item.review}</Text>
                    <Text style={styles.ratingText}>Rating:
                        <StarRating
                            rating={item.rating}
                            editable={false}
                            starSize={13}
                            onChange={() => { }}
                            enableSwiping={false}
                            color='black'
                        />
                    </Text>
                    {/*<Text style={styles.songName}>Song: {item.songName}</Text>*/}

                    <Text style={styles.StyleDate}>
                        {new Date(item.creationTime).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}, {new Date(item.creationTime).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        < View style={styles.container} >
            <ScrollView>
                {/* Recommendations */}
                <View style={styles.horizontalProfileContainer}>
                    <Text style={[styles.text, { fontSize: 22, padding: 10, fontWeight: '500' }]}>Discover Artists</Text>
                    <Text onPress={() => navigation.navigate('Discover')} style={[styles.text, { fontSize: 18, padding: 13 }]}>View all</Text>
                </View>
                <View style={styles.artistContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="black" style={styles.spinner} />
                    ) : artistRecommendations && artistRecommendations.length > 0 ? (
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {artistRecommendations.map((artist, index) => (
                                <View key={index} style={styles.artistView}>
                                    <Image
                                        source={artist.imageUrl ? { uri: artist.imageUrl } : require("../assets/defaultPic.png")}
                                        style={styles.imageContainer}
                                    />
                                    <Text style={styles.artistName}>{artist.artistName}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noArtistText}>Interact with the app to receive tailored recommendations based on your activity.</Text>
                    )}
                </View>
                {/* Recommendations End */}

                <View style={styles.container2}>
                    {reviews.map((item, index) => (
                        <Post
                            key={index}
                            item={item}
                            userId={userId}
                            LikePost={LikePost}
                            UnlikePost={UnlikePost}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Social Media Navigation Bar */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={() => navigation.replace("Home")}>
                    <FontAwesome name="home" size={24} color="#4f4f4f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <FontAwesome name="search" size={24} color="#4f4f4f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Discover")}>
                    <FontAwesome name="plus-square" size={24} color="#4f4f4f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Recommendations")}>
                    <FontAwesome name="heart" size={24} color="#4f4f4f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={24} color="#4f4f4f" />
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    artistContainer: {
        paddingLeft: 10,
    },
    artistView: {
        alignItems: 'center', // Center items vertically
        marginRight: 10, // Add some spacing between the artist views
    },
    spinner: {
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },

    artistName: {
        marginTop: 5, // Space between the image and the text
        textAlign: 'center', // Center the artist's name
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
        backgroundColor: '#333',
        overflow: 'hidden',
        marginHorizontal: 6,
    },
    postContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        margin: 15,
        padding: 15,
        width: 370,
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
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
        color: '#000',
    },
    postContent: {
        marginTop: 1,
    },
    artistName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    noArtistText: {
        textAlign: 'center',
        marginTop: 20, // Adjust as needed
        fontSize: 16, // Adjust as needed
    },
    reviewText: {
        fontSize: 16,
        marginTop: 5,
        color: '#333',
    },
    ratingText: {
        fontSize: 16,
        marginTop: 5,
        color: '#333',
    },
    songName: {
        fontSize: 16,
        marginTop: 5,
        color: '#333',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingBottom: 42,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    likeIcon: {
        marginRight: 8,
    },
    likeText: {
        fontSize: 14,
        color: '#333',
    },
    commentIcon: {
        marginLeft: 12,
        marginRight: 8,
    },
    albumContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalAlbumArt: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginRight: 10,
    },
    modalStyleSong: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalStyleArtist: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#4e4c4c",
        marginTop: 5,
    },
    StyleDate: {
        fontSize: 12,
        marginTop: 10,
        color: '#bfbfbf',
    },
})