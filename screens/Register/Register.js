// SearchBar.js
// Test
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, SafeAreaView, Text, Alert, KeyboardAvoidingView } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication, db } from "../../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import colors from "../../constants/colors";
import useRegisterViewModel from "./RegisterViewModel";

const Separator = () => (
    <View style={styles.separator} />
);



const Register = ({ navigation }) => {

    /* old changes
    const [userName, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [reviews, setReviews] = useState([]);
    */

    // new changes - use ViewModel
    const { userName, email, password, setUser, setEmail, setPassword, registerAccount } = useRegisterViewModel(navigation);

    /* old changes
    const RegisterAccount = () => {
        createUserWithEmailAndPassword(authentication, email, password)
            .then(async (userCredentials) => {
                const user = userCredentials.user;
                console.log("Registered in with:", user.email);
                await setDoc(doc(db, "users", userCredentials.user.uid), { userName, followers, following, reviews })
                    .then((re) => {
                        alert("Data has been saved");
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            })
            .catch(error => alert(error.message));
        navigation.navigate("Login")
    }
    */

    return (
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={-500} behavior="padding">
            <Text
                style={styles.header}>
                Register
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.Text}>Username</Text>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor={"grey"}
                    value={userName}
                    onChangeText={text => setUser(text)}
                    style={styles.input}
                />
                <Text style={styles.Text}>Email</Text>
                <TextInput
                    placeholder="Example@mail.com"
                    placeholderTextColor={"grey"}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <Text style={styles.Text}>Password</Text>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={"grey"}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={registerAccount}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footer}>Already have an Account? Sign in</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '90%',
    },
    input: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: colors.secondary,
        marginTop: 5,
        borderColor: colors.primary,
        borderWidth: 2,
    },
    buttonText: {
        color: colors.secondary,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        color: colors.primary,
        fontWeight: '700',
        paddingBottom: 30,
        fontSize: 25,
    },
    footer: {
        paddingTop: 70,
    },
    Text: {
        paddingTop: 20,
    }
});

export default Register;