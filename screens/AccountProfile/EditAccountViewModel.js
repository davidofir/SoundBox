import { useState } from 'react';
import { authentication, storage, db } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from "firebase/firestore";
import useAccountProfileViewModel from "./AccountProfileViewModel";
import { updateEmail, signOut } from "firebase/auth";
import {removeUserToken} from '../../Business Logic/NotificationManager/NotificationManager'
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";

const useEditAccountViewModel = (navigation) => {
    const { username, userEmail, image } = useAccountProfileViewModel(navigation);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

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

    const uploadImage = async () => {
        // Get the download URL
        const downloadURL = await UserRepository.uploadProfilePicture(authentication.currentUser.uid, selectedImage);

        // Return the download URL
        return downloadURL;
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
            navigation.replace("Profile");
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const SignOut = async () => {
        try {
            const token = await AsyncStorage.getItem('pushToken');
            if (token) {
                await removeUserToken(authentication.currentUser.uid, token); // Assuming removeUserToken is defined as shown earlier
                await AsyncStorage.removeItem('pushToken');
            }

            // Perform sign out from Firebase
            await signOut(authentication);

            // Reset navigation to show the login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        } catch (error) {
            console.log('Error during sign out:', error);
        }
    };

    return {
        username,
        userEmail,
        image,
        newUsername,
        setNewUsername,
        newEmail,
        setNewEmail,
        selectedImage,
        pickImage,
        saveChanges,
        SignOut,
    };
};

export default useEditAccountViewModel;