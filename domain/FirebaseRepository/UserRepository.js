import { getDoc, setDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, authentication, storage } from "../../firebase";
import { signOut } from "firebase/auth";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const createUserDocument = async (userId, userData) => {
    try {
        await setDoc(doc(db, "users", userId), userData);
        // Sign out the user
        await signOut(authentication);
    } catch (error) {
        throw error;
    }
};

const getUserProfileData = async () => {
    const userId = authentication.currentUser.uid;
    const userRef = doc(db, "users", userId);

    try {
        const docSnapshot = await getDoc(userRef);
        const userData = docSnapshot.data();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
const getUserReviewData = async (userId) => {
    const userRef = doc(db, "users", userId);
    var userData;

    try {
        const docSnapshot = await getDoc(userRef);
        userData = docSnapshot.data();
    } catch (error) {
        console.error("Error fetching user data:", error);

        return null;
    }

    // Check if userData is defined and has reviewIds
    if (!userData || !userData.reviewIds) {
        console.log("No reviews or user data found.");
        return []; // Return an empty array to indicate no reviews
    }

    const reviews = userData.reviewIds;
    var tempReviews = [];

    for (let i = 0; i < reviews.length; i++) {
        const reviewRef = doc(db, "reviews", reviews[i]);
        try {
            const docSnapshot = await getDoc(reviewRef);
            const reviewData = docSnapshot.data();
            if (reviewData) {
                tempReviews.push(reviewData);
            }
        } catch (error) {
            console.error("Error fetching review data:", error);

        }
    }

    return tempReviews;
}

const updateUserFollowers = async (userId, updatedFollowers) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            followers: updatedFollowers,
        });
    } catch (error) {
        console.error("Error updating user followers:", error);
    }
}

const updateUserFollowing = async (userId, updatedFollowing) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            following: updatedFollowing,
        });
    } catch (error) {
        console.error("Error updating user following:", error);
    }
}

const uploadProfilePicture = async (userId, selectedImage) => {
    const response = await fetch(selectedImage.assets[0].uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
};

const getFollowingUsers = async (userId) => {
    const userRef = doc(db, "users", userId);

    try {
        const docSnapshot = await getDoc(userRef);
        const userData = docSnapshot.data();

        if (!userData || !userData.followers) {
            console.log("No followers data found for user:", userId);
            return []; // Return an empty array if there are no followers
        }

        return userData.following; // Returns an array of following user IDs
    } catch (error) {
        console.error("Error fetching followers data:", error);
        throw error;
    }
};


export { createUserDocument, getUserProfileData, getUserReviewData, updateUserFollowers, updateUserFollowing, uploadProfilePicture, getFollowingUsers };