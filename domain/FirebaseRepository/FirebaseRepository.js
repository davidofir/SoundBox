
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase";

const signInWithCredentials = (email, password) => {
    return signInWithEmailAndPassword(authentication, email, password);
};

const signUpWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export { signInWithCredentials, signUpWithEmailAndPassword };