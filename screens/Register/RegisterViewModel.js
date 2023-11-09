import { useState } from "react";
import * as FirebaseManager from "../../domain/FirebaseRepository/FirebaseManager";
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";
const useRegisterViewModel = (navigation) => {
    const [userName, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerAccount = async () => {
        try {
            const user = await FirebaseManager.signUpWithEmailAndPassword(email, password);

            // Save user data to Firestore
            const userData = {
                userName,
                followers: [],
                following: [],
                reviewIds: [],
            };

            await UserRepository.createUserDocument(user.uid, userData);
            console.log("Registered in with:", user.email);
            alert("Data has been saved");
            navigation.navigate("Login");
        } catch (error) {
            alert(error.message);
        }
    };

    return { userName, email, password, setUser, setEmail, setPassword, registerAccount };
};

export default useRegisterViewModel;