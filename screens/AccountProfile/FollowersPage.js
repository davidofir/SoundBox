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

export default FollowersPage = ({ navigation, route }) => {
    const [followerData, setFollowerData] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state.

    useEffect(() => {
        fetchFollowerData(route.params.followerArray); // Pass followerArray as an argument.
    }, [route.params.followerArray]);

    // Find user objects from UID
    const fetchFollowerData = async (followerArray) => {
        const followerData = [];

        for (let i = 0; i < followerArray.length; i++) {
            try {
                const userRef = doc(db, "users", followerArray[i]);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    followerData.push({ ...userData, id: followerArray[i] });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        setFollowerData(followerData);
        setLoading(false); // Set loading to false once data is available.
    };

    const onPressItem = (item) => {
        navigation.navigate('UserPage', { item });
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={followerData}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onPressItem(item)}>
                            <View style={styles.item}>
                                <Image source={require("../../assets/defaultPic.png")} style={styles.itemImage} />
                                <Text style={styles.itemText}>Username: {item?.userName || "Loading..."}</Text>
                            </View>
                        </TouchableOpacity>
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