import { StyleSheet, Text, View,FlatList,TouchableWithoutFeedback } from 'react-native';
import Colors from '../../constants/colors';
import React, { useEffect,useState } from 'react';

import useViewModel from './ArtistViewModel'
import EventItem from '../../components/EventItem';
import ButtonComponent from '../../components/ButtonComponent';
let artistName = "a day to remember";
let time = "upcoming";


export default ArtistProfile = ({ navigation }) => {
    
    const {events,getEventsByArtistName} = useViewModel();

    useEffect(()=>{
        getEventsByArtistName(artistName,time);
    },[])

    const renderItem = ({ item }) => (
        <EventItem city={item.venue.city} country={item.venue.country} date={new Date (item.startDateTime).toLocaleDateString()} time={new Date (item.startDateTime).toLocaleTimeString()} />
      );

    return (
        <View>
            <View style={styles.verticalProfileContainer}>
                <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                    <View style={styles.square} />
                    <Text>Artist Name</Text>
                </View>
            </View>
            <View style={[styles.verticalProfileContainer, { justifyContent: "center",height:'78%' }]}>
                <View>
                    <Text style={{textAlign:"center",marginTop:"5%"}}>Upcoming Events</Text>
                    <View>
                     <TouchableWithoutFeedback onPress={()=>navigation.navigate("Upcoming Events",{events:events})}>
                        <View style={[styles.verticalProfileContainer,{marginTop:50}]}>
                                 <FlatList
                                    data={events.slice(0,5)}
                                    renderItem={renderItem}
                                    keyExtractor={(item, key) => key}
                                    initialNumToRender={5} />

                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginBottom: 20,justifyContent:"flex-end",flex:1 }}>
                        <ButtonComponent textColor={Colors.secondary} background={Colors.primary} borderColorStyle={Colors.secondary} buttonTitle="To Buy Merch" clickEvent={() => navigation.navigate("Merch Store",{artistName: artistName})
                        } />
                    </View>
                </View>
            </View>

        </View>
    )
}
const Item = ({ city,country,date,time }) => (
    <View style={styles.item}>
            <Text>{city},{country}</Text>
            <View style={{flexDirection:"row"}}>
                <Text>Date:{date}</Text><Text> at {time}</Text>
            </View>
    </View>
  ); 
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