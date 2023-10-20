import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View,FlatList,Image,ActivityIndicator } from 'react-native';
import MerchItem from '../../components/MerchItem';
import GetMerchByArtistName from '../../domain/ArtistRepository/ArtistRepository';
import MerchRepositoryImpl from '../../domain/MerchAPI/MerchRepositoryImpl';
import useViewModel from './MerchViewModel';



//const merchRepo = new MerchRepositoryImpl;


    
export default Store = ({ route, navigation }) => {
    const { merch, getMerchByArtistName } = useViewModel();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            await getMerchByArtistName(route.params.artistName);
            setLoading(false);
        }
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <MerchItem name={item.name} price={item.price} image={item.image} url={item.url} />
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    if (Array.isArray(merch) && merch.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No merch found</Text>
            </View>
        );
    }
    if (merch.error) {
        return (
            <View style={styles.centered}>
                <Text>{merch.userMessage}</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={merch}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',  // A soft background color
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
    },
    item: {
        flexDirection: "row",
        padding: 15,  // Increase padding for better spacing
        borderRadius: 10,  // Smooth the edges
        backgroundColor: 'white',  // Use a white background for items
        marginBottom: 10,  // Spacing between items
        shadowColor: '#aaa',  // Soft shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,  // Elevation for Android
    },
    square: {
        width: 100,
        height: 100,
        borderRadius: 10,  // Consistent rounded edge
        marginRight: 15,  // Space between image and text
    },
});
