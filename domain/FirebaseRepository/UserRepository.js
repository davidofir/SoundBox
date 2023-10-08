import { getDoc, setDoc, doc } from "firebase/firestore";
import { db, authentication } from "../../firebase";
import { signOut } from "firebase/auth";

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

export { createUserDocument, getUserProfileData };