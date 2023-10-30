import { StyleSheet, Text, TextInput, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import useAccountProfileViewModel from "./AccountProfileViewModel";

export default EditAccountPage = ({ navigation }) => {

    // new changes - using viewmodel
    const { username, followers, following, reviews, navigateToFollowers, navigateToFollowing } = useAccountProfileViewModel(navigation);

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={require('../../assets/defaultPic.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{username}</Text>
            </View>
            <View style={styles.editForm}>
                <Text style={styles.sectionTitle}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder={username}
                    placeholderTextColor="black"
                />
                <Text style={styles.sectionTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="black"
                />
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    editForm: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        paddingLeft: 10,
    },
    saveButton: {
        backgroundColor: '#007AFF', // Replace with your desired color
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})