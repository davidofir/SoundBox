// SearchBar.js
// Test
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, SafeAreaView, Text, Alert, KeyboardAvoidingView, ImageBackground } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase";
import colors from "../../constants/colors";

const Separator = () => (
    <View style={styles.separator} />
);

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })

        return unsubscribe
    }, [])

    const SignIn = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Logged in with:", user.email);
            })
            .catch(error => alert(error.message))
    }


    return (
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={-500} behavior="padding">
            <ImageBackground source={require("../../assets/bkg.png")} resizeMode="cover" style={styles.image}>
                <Text style={styles.title}>SoundBox</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={"grey"}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        autoCapitalize={false}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={"grey"}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize={false}
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
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

// styles
const styles = StyleSheet.create({
    title: {
        color: "white",
        fontWeight: '700',
        fontSize: 50,
        marginBottom: 20
    },
    image: {
        justifyContent: "center",
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15264d'
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: colors.secondary,
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
    }
});

export default Login;