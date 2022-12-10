import { StyleSheet, Text, View, FlatList, Image, TextInput } from 'react-native';
import Colors from '../constants/colors';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ButtonComponent from '../components/ButtonComponent';
import EventsRepository from '../domain/EventsAPI/EventsRepositoryImpl';
import { authentication, db } from "../firebase";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { AntDesign } from '@expo/vector-icons';
import { collection, doc, getDoc, getDocs, onSnapshot, QuerySnapshot } from "firebase/firestore";
import useViewModel from './ArtistProfile/ArtistViewModel'
import colors from '../constants/colors';
var data = [
    { id: 'testuser2', text: 'Username: testuser2', image: require("../assets/defaultPic.png"), uid: '4pBUs4l8FvaeziP5bkNNTLL5wnO2' },
    { id: 'testuser3', text: 'Username: testuser3', image: require("../assets/defaultPic.png"), uid: 'Gckdu1VtBtaxk03N1PvltC13tlD2' },
    // ...
];

export default SearchPage = ({ navigation }) => {
    const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [isArtist, setIsArtist] = useState(false);
    const { events, getEventsByArtistName, artistProfile, getArtistProfile } = useViewModel();
    const searchOptions = ['Users', 'Artists']
    useEffect(() => {
        if(!isArtist){
            const userRef = collection(db, "users");
            getDocs(userRef)
                .then((snapshot) => {
                    let users = []
                    snapshot.docs.forEach((doc) => {
                        users.push({ ...doc.data(), id: doc.id })
                    })
                    data = users;
                })
        }

    },[isArtist])
    useEffect(() => {
        if (isArtist) {
            if(events.length>0){
                getArtistProfile();
            }else{
                setResults([]);
            }

        }
    }, [events])
    useEffect(() => {
        if (isArtist && events.length > 0) {
            setResults([{ id: "123", text: artistProfile.artistName, image: artistProfile.profilePic }])
        }

    }, [artistProfile])
    const onChangeSearch = (text) => {

        if (selectedSearchIndex == 0) {
            const newResults = data.filter(item => item.userName.includes(text));
            setIsArtist(false);
            setResults(newResults);
        } else if(selectedSearchIndex == 1) {
            setIsArtist(true);
            getEventsByArtistName(search, "upcoming");

        }
    };

    const onPressItem = (item) => {
        if (!isArtist) {
            navigation.navigate('UserPage', { item });
        } else {
            navigation.navigate("Artist", { artistProfile: artistProfile, events: events })
        }

    };
    const handleSearchIndexSelect = (index) => {
        //handle tab selection for custom Tab Selection SegmentedControlTab
        setSelectedSearchIndex(index);
    };
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <SegmentedControlTab
                    values={searchOptions}
                    selectedIndex={selectedSearchIndex}
                    onTabPress={handleSearchIndexSelect}
                />
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchContainerField}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                            placeholder={searchOptions[selectedSearchIndex]}
                        />
                    </View>
                    <View style={{ padding: 5 }}>
                        <TouchableOpacity onPress={() => onChangeSearch(search)}>
                            <AntDesign name="search1" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
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
                                <Image source={isArtist ? { uri: item.image } : require("../assets/defaultPic.png")} style={styles.itemImage} />
                                { isArtist ? <Text>{artistProfile.artistName}</Text> : <Text style={styles.itemText}>Username: {item.userName}</Text>}
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
    searchContainerField: {
        width: '90%',
        flexDirection: "row"
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
    segmentContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
    }
});