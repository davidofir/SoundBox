import React, { useEffect, useState, useLayoutEffect, } from 'react';
import { Linking } from 'react-native';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getSongReviews } from './ReviewStorage';
import { FontAwesome, Ionicons, Entypo, Fontisto } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { authentication, db, } from "../../firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getTrackID } from "../../domain/SpotifyAPI/SpotifyAPI";
const SongReviewsPage = ({ route, navigation }) => {
    const { songName, artistName } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    var userId = authentication.currentUser.uid;
    const [liked, setLiked] = useState(0);

    //Set the title of the page
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Reviews of " + songName 
        });
    }, [navigation]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getSongReviews(songName, artistName);
    
                // Sorting reviews based on the number of likes (descending order)
                const sortedReviews = fetchedReviews.sort((a, b) => {
                    return b.likes.length - a.likes.length;
                });
    
                setReviews(sortedReviews);
                
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false); // Set loading to false when the fetch is complete
            }
        };
    
        fetchReviews();
    }, []);

    const navigateProfile = async (review) => {
        try {
            const userRef = doc(db, "users", review.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const tempUserData = userSnapshot.data();
                const userData = { ...tempUserData, id: review.userId };

                onNavigate(userData);
            } else {
                console.error("User data not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    const onNavigate = (item) => {
        navigation.navigate('UserPage', { item });
    }

    const openSpotify = async (song, artist) => {
        trackId = null;
        var spotifyUri = `spotify:track:${trackId}`;

        try {
            trackId = await getTrackID(song, artist)
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

    const openAppleMusic = async (song, artist) => {
        try {
            // Construct the Apple Music URL for the app
            const appleMusicAppUrl = `apple-music://music.apple.com/search?term=${song}+${artist}`;

            // Check if the Apple Music app is installed
            const supported = await Linking.canOpenURL(appleMusicAppUrl);

            if (supported) {
                await Linking.openURL(appleMusicAppUrl); // Open in the Apple Music app
                console.log("Opened in Apple Music app");
            } else {
                // Construct the Apple Music URL for the web
                const appleMusicWebUrl = `https://music.apple.com/search?term=${song}+${artist}`;
                await Linking.openURL(appleMusicWebUrl); // Open in the web browser
                console.log("Opened in web browser");
            }
        } catch (error) {
        }
    };

    const LikePost = (review) => {
        var tempLikes = review.likes;

        tempLikes.push(userId)

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'reviews', review.id);
        updateDoc(reviewDoc, {
            likes: tempLikes
        })
    }

    const UnlikePost = (review) => {
        var tempLikes = review.likes;

        tempLikes.splice(tempLikes.indexOf(userId), 1);

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'reviews', review.id);
        updateDoc(reviewDoc, {
            likes: tempLikes
        })
    }

    const handleLike = (review) => {
        if (liked) {
            UnlikePost(review);
        } else {
            LikePost(review);
        }
        setLiked(!liked);
    };



    const renderReview = (item) => {


        return (
        <View style={styles.postContainer} key={item.id}>
                <TouchableOpacity onPress={() => navigateProfile(item)}>
                    <View style={styles.postHeader}>
                        <Image source={require("../../assets/defaultPic.png")} style={styles.profileImage} />
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
                            <TouchableOpacity onPress={() => openSpotify(item.songName, item.artistName)} style={{ marginRight: 10, marginTop: 10 }}>
                                <Entypo name="spotify" size={25} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openAppleMusic(item.songName, item.artistName)} style={{ marginTop: 10 }}>
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
                        <TouchableOpacity onPress={() => handleLike(item)}>
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
        <View style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={styles.container}>
                
                {loading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : reviews.length > 0 ? (
                    reviews.map(renderReview)
                ) : (
                    <Text style={styles.noReviewsText}>There aren't any reviews for this song yet!
                    </Text>
                    
                )}
            </ScrollView>
        </View>
       
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        textAlign: 'center'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    headerArtist: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    reviewContainer: {
        backgroundColor: 'lightgray',
        padding: 15,
        borderRadius: 5,
        marginVertical: 8,
        width: '100%',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 3,
    },
    reviewText: {
        fontSize: 16,
        marginBottom: 5,
    },
    noReviewsText: {
        fontSize: 25,
        color: '#353a42',
        marginTop: 40,
        textAlign: 'center'
    },
    artistContainer: {
        paddingLeft: 10,
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
});

export default SongReviewsPage;