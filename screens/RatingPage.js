import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";



const RatingPage = () => {
    const [defaultRating, setdefaultRating] = useState(2)
    const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5])

    const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

    //Profanity API
    const [text, setText] = useState('')
    const url = `https://www.purgomalum.com/service/json?text=${text}`
    async function getCensoredText() {
        const response = await fetch(url);
        const data = await response.json();
        const message = `${defaultRating} stars \n ${data.result}`;
        alert(message);
    }

    const CustomRatingBar = () => {
        return (
            <View style={styles.customRatingBarStyle}>
                {
                    maxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                                onPress={() => setdefaultRating(item)}
                            >
                                <Image
                                    style={styles.starImgStyle}
                                    source={
                                        item <= defaultRating
                                            ? { uri: starImgFilled }
                                            : { uri: starImgCorner }
                                    }
                                />

                            </TouchableOpacity>
                        )
                    })
                }

            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}> Rate This Song </Text>
            <CustomRatingBar />
            <Text style={styles.textStyle}>
                {defaultRating + ' / ' + maxRating.length}
            </Text>

            <TextInput
                style={styles.input}
                onChangeText={text => setText(text)}
                placeholder="Write a review (optional)"
                keyboardType="alphabetical"
            />
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.buttonStyle}
                onPress={getCensoredText}
            >
                <Text style={{ color: 'white' }}>Save Review</Text>
            </TouchableOpacity>
        </SafeAreaView>

    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 23,
        marginTop: 20,
    },
    customRatingBarStyle: {
        justifyContent: "center",
        flexDirection: 'row',
        marginTop: 30,
    },
    starImgStyle: {
        width: 40,
        height: 40,
        resizeMode: "cover"
    },
    buttonStyle: {
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 30,
        padding: 15,
        backgroundColor: 'black',
        fontSize: 40,
        color: "white"
    },
    input: {
        height: 150,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default RatingPage