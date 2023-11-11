import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
const defaultCoverArt = require('../../assets/defaultSongImage.png');



const LoggedUsersReviewPage = ({ navigation, route }) => {
    const { review } = route.params;

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
        height: 450,
        width: 360,
        margin: 22,
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
});

export default LoggedUsersReviewPage;
