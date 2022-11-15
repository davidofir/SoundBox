import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepository';
import { authentication } from '../firebase';

let artistName = "sum41";
let time = "upcoming";

const eventsRepo = new EventsRepository;
export default ProfilePage = ({ navigation }) => {
    const [events, setEvents] = useState([]);

    return (
        <View>
            <View style={styles.verticalProfileContainer}>
                <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                    <View style={styles.square} />
                    <Text>Email: {authentication.currentUser?.email}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    verticalProfileContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'flex-start',
        margin: 10,
        width: 'auto',
        height: "auto"

    },
    horizontalProfileContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
    square: {
        width: 100,
        height: 100,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 30,
    },
})