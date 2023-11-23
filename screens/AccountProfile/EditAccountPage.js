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

export default EditAccountPage = ({ navigation, route }) => {

    // new changes - using viewmodel
    const item = route.params.username;
    const { username, userEmail, image } = useAccountProfileViewModel(navigation);

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const uploadImage = async () => {
        const response = await fetch(selectedImage.assets[0].uri);
        const blob = await response.blob();

        // Create a reference to the storage location
        const imageRef = ref(storage, `profilePictures/${authentication.currentUser.uid}`);

        // Upload the image
        await uploadBytes(imageRef, blob);;

        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);

        // Return the download URL
        return downloadURL;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result);
        }
    };

    const saveChanges = async () => {
        try {
            // Update the username in the database.
            const userDocRef = doc(db, "users", authentication.currentUser.uid);

            // Upload the image and get the download URL
            const imageUrl = selectedImage ? await uploadImage() : null;

            await updateDoc(userDocRef, {
                userName: newUsername || username,
                profilePicture: imageUrl,
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
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={image ? { uri: image } : require('../../assets/defaultPic.png')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
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