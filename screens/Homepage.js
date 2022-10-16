import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Homepage = ({navigation}) =>{
    return (
    <View style={styles.container}>
        <TouchableOpacity style={{marginRight:8,padding:10}} onPress={()=>navigation.navigate("Discover")}>
            <Text>Discover Artists</Text>
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
export default Homepage