import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepository';
import { authentication } from '../firebase';

const eventsRepo = new EventsRepository;
export default ProfilePage = ({ navigation }) => {
    const [events, setEvents] = useState([]);

    return (
        <View>
            <View style={styles.backgroundContainer}>
                <View style={styles.verticalProfileContainer}>
                    <View style={[styles.horizontalProfileContainer, { padding: 6 }]}>
                        <View style={styles.circle} />
                        <Text>Email: {authentication.currentUser?.email}</Text>
                    </View>
                </View>
                <View style={styles.followContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Posts</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>14</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text, styles.subText]}>Followers</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>124</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, styles.subText]}>Following</Text>
                        <Text style={[styles.text, { fontSize: 24 }]}>119</Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={[styles.text, { fontSize: 18, padding: 10 }]}>POSTS</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    verticalProfileContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        margin: 10,
        width: 'auto',
        height: "auto"

    },
    backgroundContainer: {
        backgroundColor: "white"
    },
    horizontalProfileContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: "flex-start",
        marginLeft: 15,
        flexDirection: "row"
    },
    circle: {
        width: 100,
        height: 100,
        backgroundColor: "black",
        marginRight: 10,
        borderRadius: 100,
    },
    followContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 15
    },
    statsBox: {
        alignItems: "center",
        flex: 1,
        paddingBottom: 15
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    }
})