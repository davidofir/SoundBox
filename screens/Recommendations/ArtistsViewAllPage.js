import React, { useEffect, useState, memo, useLayoutEffect } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, FlatList,  } from 'react-native';
import { getArtistImage } from '../../domain/SpotifyAPI/SpotifyAPI'; // Adjust the import path

const Cell = memo(({ cellItem }) => {
    const [coverArtUrl, setCoverArtUrl] = useState(cellItem.imageUrl);
    const defaultCoverArt = require('../../assets/defaultPic.png'); // Adjust the path to your default image
  
    useEffect(() => {
      const fetchArtistImage = async () => {
        if (!cellItem.imageUrl) {
          const images = await getArtistImage(cellItem.artistName);
          if (images.length > 0 && images[0].url) {
            setCoverArtUrl({ uri: images[0].url });
          } else {
            setCoverArtUrl(defaultCoverArt);
          }
        }
      };
  
      fetchArtistImage();
    }, [cellItem]);
  
    const handlePress = () => {
      // Handle press action
    };

    const imageSource = coverArtUrl 
        ? (typeof coverArtUrl === 'string' ? { uri: coverArtUrl } : coverArtUrl) 
        : defaultCoverArt;
  
    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.cell}>
          <Image
            style={styles.imageView}
            source={imageSource}
          />
          <View style={styles.contentView}>
            <Text style={[styles.whiteText, styles.boldText]}>
              {cellItem.artistName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
});

const ArtistsViewAllPage = ({ route, navigation }) => {
  const { artists } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Recommended Artists"
    });

  }, [navigation]);

  return (
    <View>
        <FlatList
        data={artists}
        renderItem={({ item, index }) => (<Cell cellItem={item} navigation={navigation} />)}
        keyExtractor={(item, index) => item.name || index.toString()}
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

});

export default ArtistsViewAllPage;