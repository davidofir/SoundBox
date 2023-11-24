import React, { useState, useEffect, useLayoutEffect, memo } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    Keyboard,
    Button,
    FlatList,
    ScrollView, 
    Image, TouchableOpacity,
  } from 'react-native';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI'; // Adjust the import path

const Cell = memo(({ cellItem, navigation }) => {
  const [coverArtUrl, setCoverArtUrl] = useState(null);
  const defaultCoverArt = require('../../assets/defaultSongImage.png'); // Adjust the path to your default image

  useEffect(() => {
    const fetchCoverArt = async () => {
      try {
        const imageUrl = await searchAndFetchSongCoverArt(cellItem.name, cellItem.artist.name);
        setCoverArtUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching cover art:', error);
      }
    };
    
    fetchCoverArt();
  }, [cellItem]);

  const handlePress = () => {
    navigation.navigate('RatingPage', {
      paramArtistName: cellItem.artist.name,
      paramSongName: cellItem.name,
      paramCoverArtUrl: coverArtUrl
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cell}>
        <Image
          style={styles.imageView}
          source={coverArtUrl ? { uri: coverArtUrl } : defaultCoverArt}
        />
        <View style={styles.contentView}>
          <Text style={[styles.whiteText, styles.boldText]}>
            {cellItem.name}
          </Text>
          <Text style={styles.whiteText}>{cellItem.artist.name}</Text>
        </View>
        {/* Additional content if needed */}
      </View>
    </TouchableOpacity>
  );
});



const SongsViewAllPage = ({ route, navigation }) => {
  const { songs } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Recommended Songs"
    });
  }, [navigation]);

  return (
    <View>
      <FlatList
        data={songs}
        renderItem={({ item }) => (<Cell cellItem={item} navigation={navigation} />)}
        keyExtractor={item => item.name}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  imageView: {
    width: 80,
    height: 80,

    marginRight: 15,
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
  },
  whiteText: {
    color: '#000', 
    fontSize: 17
  },
  boldText: {
    fontWeight: 'bold',
  },
  // Add more styles as needed for other components
});

export default SongsViewAllPage;