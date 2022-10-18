import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, View,FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import Colors from '../constants/colors';
const data = []
for(var i = 0; i < 5; i++){
    data.push(
        {title:`Event${i+1}`}
    )
}
export default ArtistProfile = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <Item title={item.title} />
      );

    return (
        <View>
            <View style={styles.verticalProfileContainer}>
                <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                    <View style={styles.square} />
                    <Text>Artist Name</Text>
                </View>
            </View>
            <View style={[styles.verticalProfileContainer, { justifyContent: "center",height:'75%' }]}>
                <View>
                    <Text style={{textAlign:"center",marginTop:"5%"}}>Upcoming Events</Text>
                    <View>
                        <View style={[styles.verticalProfileContainer,{marginTop:50}]}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, key) => key} />
                        </View>
                    </View>
                    <View style={{marginBottom: 20,marginTop:"95%" }}>
                        <ButtonComponent textColor={Colors.secondary} background={Colors.primary} borderColorStyle={Colors.secondary} buttonTitle="To Buy Merch" clickEvent={() => navigation.navigate("Merch Store")} />
                    </View>
                </View>
            </View>

        </View>
    )
}
const Item = ({ title }) => (
    <View style={styles.item}>
            <Text style={{textAlign:"center"}}>{title}</Text>
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