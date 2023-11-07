import { StyleSheet, Text, TextInput, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import Colors from '../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../../components/ButtonComponent';
import EventsRepository from '../../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { updateEmail, signOut } from "firebase/auth";
import useAccountProfileViewModel from "./AccountProfileViewModel";

export default EditAccountPage = ({ navigation, route }) => {

    // new changes - using viewmodel
    const item = route.params.username;
    const { username, userEmail } = useAccountProfileViewModel(navigation);

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const saveChanges = async () => {
        try {
            // Update the username in the database.
            const userDocRef = doc(db, "users", authentication.currentUser.uid);
            await updateDoc(userDocRef, {
                userName: newUsername || username
            });

            // Update the email in the database.
            await updateEmail(authentication.currentUser, newEmail || userEmail);

            // Navigate back or perform any other action.
            // For example, you can navigate to the profile page.
            navigation.replace("Profile");
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    }

    const SignOut = () => {
        signOut(authentication)
            .then((re) => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            })
            .catch((re) => {
                console.log(re);
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={require('../../assets/defaultPic.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{item}</Text>
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
        backgroundColor: '#1f1f2e',
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
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    editForm: {
        padding: 20,
    },
    sectionTitle: {
        color: 'white',
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