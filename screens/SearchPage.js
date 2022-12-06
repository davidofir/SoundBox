import { StyleSheet, Text, View, FlatList, Image, TextInput } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const data = [
    { id: 'testuser2', text: 'Username: testuser2', image: require("../assets/defaultPic.png"), uid: '4pBUs4l8FvaeziP5bkNNTLL5wnO2' },
    { id: 'testuser3', text: 'Username: testuser3', image: require("../assets/defaultPic.png"), uid: 'Gckdu1VtBtaxk03N1PvltC13tlD2' },
    // ...
];

export default SearchPage = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const onChangeSearch = (text) => {
        setSearch(text);
        const newResults = data.filter(item => item.text.includes(text));
        setResults(newResults);
    };

    const onPressItem = (item) => {
        navigation.navigate('UserPage', { item });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={onChangeSearch}
                    placeholder="Search"
                />
            </View>
            {results.length > 0 && (
                <View style={styles.searchResultContainer}>
                    <Text style={styles.searchResultText}>
                        {`${results.length} results found`}
                    </Text>
                </View>
            )}
            {results.length > 0 && (
                <FlatList
                    data={results}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onPressItem(item)}>
                            <View style={styles.item}>
                                <Image source={item.image} style={styles.itemImage} />
                                <Text style={styles.itemText}>{item.text}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    searchContainer: {
        width: '90%',
        marginTop: 20,
    },
    searchInput: {
        height: 40,
        backgroundColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
    },
    searchResultContainer: {
        marginTop: 20,
        width: '90%',
    },
    searchResultText: {
        fontSize: 18,
    },
    item: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        width: '100%',
        backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemText: {
        fontSize: 18,
    },
});