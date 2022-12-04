import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication } from '../firebase';

const eventsRepo = new EventsRepository;
export default FollowersPage = ({ navigation }) => {
    const [events, setEvents] = useState([]);

    return (
        <View style={styles.container}>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                placeholder="Search"
                style={styles.searchBar}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: "column",
        backgroundColor: '#000'
    },
    searchBar: {
        backgroundColor: "white",
        height: 35,
        borderRadius: 20,
        paddingLeft: 10,
    }
})