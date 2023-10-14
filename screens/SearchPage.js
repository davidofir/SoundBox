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
    const [searchStatus, setSearchStatus] = useState('idle');
  
    const { events, getEventsByArtistName, artistProfile, getArtistProfile } = useViewModel();
    const searchOptions = ['Users', 'Artists'];

    useEffect(() => {
      if (!isArtist) {
        const userRef = collection(db, 'users');
        getDocs(userRef).then((snapshot) => {
          let users = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          data = users;
        });
      }
    }, [isArtist]);

    useEffect(() => {
      if (isArtist) {
        if (events.length > 0 || search.length === 0) {
          getArtistProfile();
        } else {
          setResults([]);
          setSearchStatus('not_found');
        }
      }
    }, [events]);

    useEffect(() => {
      if (isArtist && events.length > 0) {
        const newResults = [{ id: '123', text: artistProfile.artistName, image: artistProfile.profilePic }];
        setResults(newResults);
        setSearchStatus(newResults.length > 0 ? 'found' : 'not_found');
      }
    }, [artistProfile]);

    const handleSearch = () => {
        setSearchStatus('searching');
        if (search.length > 0) {
            if (selectedSearchIndex === 0) {
                const newResults = data.filter((item) => item.userName.includes(search));
                setIsArtist(false);
                setResults(newResults);
                setSearchStatus(newResults.length > 0 ? 'found' : 'not_found');
            } else if (selectedSearchIndex === 1) {
                setIsArtist(true);
                getEventsByArtistName(search, 'upcoming');
            }
        } else {
            setSearchStatus('idle');
            setResults([]);
        }
    };

    const onPressItem = (item) => {
      if (!isArtist) {
        navigation.navigate('UserPage', { item });
      } else {
        navigation.navigate('Artist', { artistProfile: artistProfile, events: events });
      }
    };

    const handleSearchIndexSelect = (index) => {
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
        <View style={styles.searchContainerArea}>
          <View style={styles.searchContainerField}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={text => {
                  setSearch(text);
                  if (text.length === 0) {
                    setSearchStatus('idle');
                  }
                }}
                placeholder={`Search ${searchOptions[selectedSearchIndex].toLocaleLowerCase()}`}
                onSubmitEditing={handleSearch}
              />
            </View>
            <View style={{ padding: 5 }}>
              <TouchableOpacity onPress={handleSearch}>
                <AntDesign name="search1" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.searchResultContainer}>
          {searchStatus === 'not_found' && search.length > 0 && (
            <Text style={styles.searchResultText}>
              {isArtist ? 'Artist not found' : 'User not found'}
            </Text>
          )}
          {searchStatus === 'found' && (
            <Text style={styles.searchResultText}>{`${results.length} results found`}</Text>
          )}
          {searchStatus === 'searching' && <Text style={styles.searchResultText}>Searching...</Text>}
        </View>
        {results.length > 0 && (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onPressItem(item)}>
                <View style={styles.item}>
                  <Image source={isArtist ? { uri: item.image } : require('../assets/defaultPic.png')} style={styles.itemImage} />
                  {isArtist ? <Text>{artistProfile.artistName}</Text> : <Text style={styles.itemText}>Username: {item.userName}</Text>}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightgrey,
    },
    searchContainer: {
        padding: 10,
        marginTop: StatusBar.currentHeight,
    },
    searchContainerArea: {
        padding: 10,
    },
    searchContainerField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: 40,
        padding: 10,
    },
    searchResultContainer: {
        padding: 10,
    },
    searchResultText: {
        fontSize: 14,
        color: Colors.text,
    },
    item: {
        flexDirection: 'row',
        padding: 15,  // Increase padding
        marginVertical: 8,  // Adjust the margin between items
        backgroundColor: '#fff',  // Use a white or light gray background
        borderRadius: 10,  // Rounded edges for a modern look
        alignItems: 'center',
        shadowColor: "#000",
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    itemText: {
        fontSize: 16,
    },
});