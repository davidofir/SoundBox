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
                navigation.replace("Login");
            })
            .catch((re) => {
                console.log(re);
            });
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Discover")}>
                <Text>Discover and Rate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Profile")}>
                <Text>Profile Page</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Home")}>
                <Text>Social Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Search")}>
                <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 8, padding: 10 }} onPress={() => navigation.navigate("Recommendations")}>
                <Text>Recommendation test</Text>
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