import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authentication } from '../firebase';
export default Homepage = ({ navigation }) => {

    const SignOut = () => {
        signOut(authentication)
            .then((re) => {
                console.log(re);
            })
            .catch((re) => {
                console.log(re);
            })
        navigation.replace("Login")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Discover")}>
                <Text>Discover Artists</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Artist")}>
                <Text>Artist Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Merch Store")}>
                <Text>Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={SignOut}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "center",
    },
})