import { StyleSheet, Text, TextInput, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db, storage } from "../../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { updateEmail, signOut } from "firebase/auth";
import useAccountProfileViewModel from "./AccountProfileViewModel";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeUserToken } from '../../domain/FirebaseRepository/UserRepository';
import useEditAccountViewModel from './EditAccountViewModel';

export default EditAccountPage = ({ navigation }) => {

    // new changes - using viewmodel
    const { username, userEmail, image, setNewUsername, setNewEmail, pickImage, saveChanges, SignOut } = useEditAccountViewModel(navigation);

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={image ? { uri: image } : require('../../assets/defaultPic.png')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.username}>{username}</Text>
            </View>
            <View style={styles.editForm}>
                <Text style={styles.sectionTitle}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder={username}
                    placeholderTextColor="#8c8c9c"
                    onChangeText={(text) => setNewUsername(text)}
                />
                <Text style={styles.sectionTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder={userEmail}
                    placeholderTextColor="#8c8c9c"
                    onChangeText={(text) => setNewEmail(text)}
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={SignOut}>
                    <Text style={styles.saveButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    editForm: {
        padding: 20,
    },
    sectionTitle: {
        color: 'black',
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
        backgroundColor: '#4f4f4f',
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