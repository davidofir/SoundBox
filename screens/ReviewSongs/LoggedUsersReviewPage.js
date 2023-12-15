import React, { useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import StarRating from 'react-native-star-rating-widget';
import { Ionicons,} from '@expo/vector-icons';
import { authentication, db, } from "../../firebase";
import { doc, updateDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

const defaultCoverArt = require('../../assets/defaultSongImage.png');

const LoggedUsersReviewPage = ({ navigation, route }) => {
    const { review } = route.params;
    var userId = authentication.currentUser.uid;
    const [liked, setLiked] = useState(false);

    // Use useEffect to set the liked state
    useEffect(() => {
        if(review && review.likes && review.likes.includes(userId)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [review, userId]); // Depend on review and userId
    

    const LikePost = () => {
        if(!review || !review.likes){
            return; // Exit the function if review is null
        } else {
            var tempLikes = review.likes;

            tempLikes.push(userId)
    
            // Update the likes list in Firebase
            const reviewDoc = doc(db, 'reviews', review.id);
            updateDoc(reviewDoc, {
                likes: tempLikes
            })
        }

    }

    const UnlikePost = () => {
        if (!review || !review.likes) {
            return; // Exit the function if review is null or likes is not available
        }
    
        var tempLikes = review.likes;

        tempLikes.splice(tempLikes.indexOf(userId), 1);

        // Update the likes list in Firebase
        const reviewDoc = doc(db, 'reviews', review.id);
        updateDoc(reviewDoc, {
            likes: tempLikes
        })
    }

    const handleLike = () => {
        if (!review) {
            return; // Exit the function if review is null
        }
        if (liked) {
            UnlikePost();
        } else {
            LikePost();
        }
        setLiked(!liked);
    };

    //Set the title of the page
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Your Review:" 
        });
    }, [navigation]);

    if (!review) {
        return (
            <View>
                <Text style={styles.noReviewsText}>You have not reviewed this song yet!</Text>
            </View>
        );
    }

    return (
        <View>
            <ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image 
                    source={review?.albumImgURL ? { uri: review.albumImgURL } : defaultCoverArt} 
                    style={styles.modalAlbumArt} 
                />
                <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                    <Text style={styles.modalStyleSong}>{review.songName}</Text>
                    <Text style={styles.modalStyleArtist}>{review.artistName}</Text>
                    <Text style={styles.StyleDate}>
                        Posted: {new Date(review.creationTime).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}, {new Date(review.creationTime).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                    </Text>
                </View>
            </View>
            <View pointerEvents="none" style={styles.container}>
                <StarRating
                    rating={review.rating}
                    editable={false}
                    starSize={50}
                    onChange={() => {}}
                    enableSwiping={false}
                />
                <Text>{"(" + review.rating + " / 5)"}</Text>
                <Text style={styles.input}>{review.review}</Text>
                </View>
                <View style={styles.likeContainer}>
                <TouchableOpacity onPress={handleLike}>
                            <Ionicons
                                name={liked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={liked ? '#ee6055' : 'black'}
                                style={styles.likeIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.likeText}>{review.likes.length}</Text>
                        
                        <TouchableOpacity onPress={() => navigation.navigate("Comment", {item: review})}>
                            <Ionicons
                                name="chatbox-outline"
                                size={20}
                                color="black"
                                style={styles.commentIcon} />
                                
                        </TouchableOpacity>
                    <Text style={styles.likeText}>{review.commentIds.length}</Text>
                </View>
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
    },
    modalAlbumArt: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginHorizontal: 10,
        marginVertical: 20,
    },
    noReviewsText: {
        fontSize: 30,
        color: '#353a42',
        marginTop: 60,
        textAlign: 'center',
    },
    input: {
        height: 400,
        width: 360,
        marginTop: 22,
        borderWidth: 1,
        padding: 5,
        fontSize: 15,
        textAlignVertical: 'top',
    },
    modalStyleSong: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalStyleArtist: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#4e4c4c",
    },
    StyleDate: {
        fontSize: 16,
        marginTop: 10,
    },
    likeIcon: {
        marginRight: 8,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20
        
    },
    likeText: {
        fontSize: 14,
        color: '#333',
    },
    commentIcon: {
        marginLeft: 12,
        marginRight: 8,
    },
});

export default LoggedUsersReviewPage;
