import { StyleSheet, Text, View,FlatList,TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsRepository';

let artistName = "sum41";
let time = "upcoming";

const eventsRepo = new EventsRepository;
export default ArtistProfile = ({ navigation }) => {
    const [events,setEvents] = useState([]);
    useEffect(()=>{
        eventsRepo.GetEventsByArtistName(artistName,time)
        .then((res)=>{
                res.map((e)=>{
                    setEvents(prevEvents=>[
                        ...prevEvents,{
                            location:`${e.venue.city},${e.venue.country}`,
                            date:`${new Date(e["starts_at"]).toLocaleDateString()}`,
                            time:`${new Date(e["starts_at"]).toLocaleTimeString()}`
                        }
                    ])
                })
            }
        )


    },[])

    const renderItem = ({ item }) => (
        <Item location={item.location} date={item.date} time={item.time} />
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
                        <ButtonComponent textColor={Colors.secondary} background={Colors.primary} borderColorStyle={Colors.secondary} buttonTitle="To Buy Merch" clickEvent={() => navigation.navigate("Merch Store")
                        } />
                    </View>
                </View>
            </View>

        </View>
    )
}
const Item = ({ location,date,time }) => (
    <View style={styles.item}>
            <Text>{location}</Text>
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