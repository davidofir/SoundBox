import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {REACT_APP_EVENTS_API_SECRET} from '@env'
import EventItem from '../../components/EventItem';
let artistName = "sum41";
let time = "upcoming";
const eventsURL = 'https://rest.bandsintown.com/artists'


export default Events = ({ route,navigation }) => {

    const [events,setEvents] = useState([]);
    useEffect(()=>{
        setEvents(route.params.events)
    },[])


    const renderItem = ({ item }) => (
        <EventItem city={item.venue.city} country={item.venue.country} date={new Date (item.startDateTime).toLocaleDateString()} time={new Date (item.startDateTime).toLocaleTimeString()} />
      );

    return (
        
        <View>

            <View style={[styles.verticalContainer, { marginTop:"5%" }]}>
                <View style={styles.verticalContainer}>
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                        keyExtractor={(item, key) => key}
                        scrollIndicatorInsets={{ right: 1 }} />

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    verticalContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'center',
        margin: 10,
        width: 'auto',
        height: "auto",

    },
    horizontalContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
    item:{
        padding:7,
    }
});