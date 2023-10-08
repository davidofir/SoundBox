import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication } from '../../firebase';

export default FollowingPage = ({ navigation, route }) => {
    const [events, setEvents] = useState([]);
    const [followings, setFollowings] = useState([]);

    useEffect(() => {
        setFollowings(route.params.followingArray);
    }, [])

    console.log(followings);

    // Find username from UID
    const FindUser = () => {

    }

    return (
        <View style={styles.container}>
            <FlatList
                data={followings}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={require("../../assets/defaultPic.png")} style={styles.itemImage} />
                        <Text style={styles.itemText}>User ID: {item}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 14
    },
});