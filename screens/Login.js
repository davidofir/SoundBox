// SearchBar.js
// Test
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, SafeAreaView, Text, Alert, KeyboardAvoidingView } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../firebase";

const Separator = () => (
    <View style={styles.separator} />
);

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(user => {
            if (user) {
                navigation.navigate("Home")
            }
        })

        return unsubscribe
    }, [])

    const SignIn = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then((re) => {
                console.log(re);
            })
            .catch((re) => {
                console.log(re);
            })
    }


    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={SignIn}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Create Account</Text>
                </TouchableOpacity>
            </View>

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
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
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
    }
});

export default Login;