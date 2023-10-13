import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import useAccountProfileViewModel from "./AccountProfileViewModel";

export default FollowingPage = ({ navigation, route }) => {
    const [followingData, setFollowingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollowingData(route.params.followingArray); // Pass followerArray as an argument.
    }, [route.params.followingArray]);

    // Find user objects from UID
    const fetchFollowingData = async (followingArray) => {
        const followingData = [];

        for (let i = 0; i < followingArray.length; i++) {
            try {
                const userRef = doc(db, "users", followingArray[i]);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    followingData.push(userData);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        setFollowingData(followingData);
        setLoading(false); // Set loading to false once data is available.
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={followingData}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={require("../../assets/defaultPic.png")} style={styles.itemImage} />
                            <Text style={styles.itemText}>Username: {item?.userName || "Loading..."}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemText: {
        fontSize: 16,
    },
});