import { StyleSheet, Text, View,FlatList,TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepository';
import MerchRepositoryImpl from '../domain/MerchAPI/MerchRepositoryImpl';

let artistName = "metallica";
let time = "upcoming";

const eventsRepo = new EventsRepository;

export default ArtistProfile = ({ navigation }) => {
    const [data,setData] = useState([]);
    useEffect(()=>{
        var fetchData = async()=>{
            var resp = await eventsRepo.GetEventsByArtistName(artistName,time)
            return resp;
        }
        fetchData().then(
            (result)=>{
                setData(result)
            }
        )
    },[])

    const renderItem = ({ item }) => (
        <Item city={item.venue.city} country={item.venue.country} date={new Date (item.startDateTime).toLocaleDateString()} time={new Date (item.startDateTime).toLocaleTimeString()} />
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
                     <TouchableWithoutFeedback onPress={()=>navigation.navigate("Upcoming Events",{events:data})}>
                        <View style={[styles.verticalProfileContainer,{marginTop:50}]}>
                                 <FlatList
                                    data={data.slice(0,5)}
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