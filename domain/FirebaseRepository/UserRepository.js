import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db, authentication } from "../../firebase";
import { signOut } from "firebase/auth";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
const updateUserToken = async(userId,token) => {
    try{
        const userRef = doc(db,"users",userId);
        await updateDoc(userRef,{
            token: token
        })
    } catch(error){
        console.error('Error updating user token:',error)
    }
}
const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.error('Failed to get push token for push notification!');
        return;
    }

    // Access the projectId using expoConfig instead of manifest
    const projectId = Constants.expoConfig.extra.eas.projectId;

    let token;
    if (projectId) {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
        console.error('Project ID is undefined!');
        return;
    }

    console.log('Push token:', token);
    return token;
};
export { createUserDocument, getUserProfileData, getUserReviewData, updateUserFollowers, updateUserFollowing,updateUserToken,registerForPushNotificationsAsync };