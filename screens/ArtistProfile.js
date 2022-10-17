import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default ArtistProfile = ({ navigation }) => {
    return (
        <View>
            <View style={styles.verticalProfileContainer}>
                <View style={styles.horizontalProfileContainer}>
                    <View style={styles.square} />
                    <Text>Artist Name</Text>
                </View>
            </View>
            <View style={[styles.verticalProfileContainer, { justifyContent: "center" }]}>
                <View>
                    <Text>Upcoming Events</Text>
                    <TouchableOpacity style={{ marginTop: 50, paddingBottom: 50 }}>
                        <Text>Event 1</Text>
                        <Text>Event 2</Text>
                        <Text>Event 3</Text>
                        <Text>Event 4</Text>
                    </TouchableOpacity>
                    <View style={{paddingTop:300}}>
                    <TouchableOpacity style={{ marginRight: 8, padding: 10}} onPress={() => navigation.navigate("Merch Store")}>
                        <Text>To Buy Merch</Text>
                    </TouchableOpacity>
                    </View>
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
        borderRadius: 30
    }
})