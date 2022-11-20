// SearchBar.js
// Test
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, SafeAreaView, Text, Alert, KeyboardAvoidingView } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication, db } from "../firebase";

const Separator = () => (
    <View style={styles.separator} />
);


const Register = ({ navigation }) => {
    const [userName, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const RegisterAccount = () => {
        createUserWithEmailAndPassword(authentication, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Registered in with:", user.email);
                return db.collection('users').doc(user.uid).set({
                    username: userName
                });
            })
            .catch(error => alert(error.message));
        navigation.navigate("Login")
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text
                style={styles.header}>
                Register
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.Text}>Username</Text>
                <TextInput
                    placeholder="Username"
                    value={userName}
                    onChangeText={text => setUser(text)}
                    style={styles.input}
                />
                <Text style={styles.Text}>Email</Text>
                <TextInput
                    placeholder="Example@mail.com"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <Text style={styles.Text}>Password</Text>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={RegisterAccount}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <Text
                style={styles.footer}>
                Already have an Account? Sign in
            </Text>

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
        backgroundColor: 'white',
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
        backgroundColor: '#0366fc',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0366fc',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0366fc',
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        color: '#0366fc',
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