import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Button,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { useState, useEffect, memo } from 'react';
const defaultCoverArt = require('../../assets/defaultSongImage.png')
import SongRecommendations from '../Recommendations/RecommendSongView';
// ViewModel Class
class AppViewModel {
  constructor() {
    this.trackModel = new TrackModel();
    this.searchInput = '';
    this.flatlistSwitch = 0;
  }

  async fetchTopTracks() {
    await this.trackModel.fetchTopTracks();
    this.flatlistSwitch = 0;
  }

  async fetchSong() {
    await this.trackModel.fetchSong(this.searchInput);
    this.flatlistSwitch = 1;
  }

  setSearchInput(text) {
    this.searchInput = text;
  }

  setFlatlistSwitch(value) {
    this.flatlistSwitch = value;
  }

  getTracks() {
    return this.trackModel.getTracks();
  }
}

// Create a ViewModel instance
const viewModel = new AppViewModel();

const Cell = memo(({ cellItem }) => {
  const [coverArtUrl, setCoverArtUrl] = useState(null);
  
  const fetchCoverArt = async () => {
    let artistNameImage = cellItem.artist.name;
    if (viewModel.flatlistSwitch === 1) {
      artistNameImage = cellItem.artist;
    }

    setCoverArtUrl(null); // Clear the previous image

    try {
      const imageUrl = await searchAndFetchSongCoverArt(cellItem.name, artistNameImage);
      if (imageUrl !== 3){
        setCoverArtUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching cover art:', error);
    }
  };




  useEffect(() => {
    fetchCoverArt();
    
  }, [cellItem]); // Only re-run the effect if cellItem changes

  let artistName = cellItem.artist.name;
  if (viewModel.flatlistSwitch === 1 && cellItem.artist) {
    artistName = typeof cellItem.artist === 'string' ? cellItem.artist : cellItem.artist.name;
  }

  return (
    <TouchableWithoutFeedback>
      <View style={styles.cell} onStartShouldSetResponder={() => true}>
        <Image
          style={styles.imageView}
          source={coverArtUrl ? { uri: coverArtUrl } : defaultCoverArt}
        />
        <View style={styles.contentView}>
          <Text style={[styles.whiteText, styles.boldText]}>
            {cellItem.name}
          </Text>
          <Text style={styles.whiteText}>{artistName}</Text>
        </View>
        <View style={styles.accessoryView}>
        
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

// Main App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tracks: [],
                   isLoading: true, };

    viewModel.fetchTopTracks().then(() => {
      this.setState({ tracks: viewModel.getTracks() });
    });
  }

  componentWillUnmount() {
    this.setState({
      tracks: viewModel.fetchTopTracks,
      searchInput: "",
    });
  }


  async handleRowPress(item) {
    const artistName =
    viewModel.flatlistSwitch === 1 ? item.artist : item.artist.name.toString();
    const coverArtUrl = await searchAndFetchSongCoverArt(item.name, artistName);


    this.props.navigation.navigate('RatingPage', {
      paramArtistName: item.artist.name,
      paramSongName: item.name,
      paramSearchedArtist: artistName,
      paramSearched: viewModel.flatlistSwitch,
      paramCoverArtUrl: coverArtUrl
    });
  }

  

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        {/* Searchbar */}
        <View style={styles.searchBarContainer}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always"
        onChangeText={(text) => viewModel.setSearchInput(text)}
        placeholder="Search Songs"
        placeholderTextColor="grey"
        style={styles.searchBar}
      />
      <Button
        onPress={() => {
          const input = viewModel.searchInput;
          if (input && input.trim() !== "") {
            viewModel.fetchSong().then(() => {
              this.setState({ tracks: viewModel.getTracks() });
            });
          }
        }}
        title="Search"
      />
    </View>
    {/* Vertical FlatList */}
    <FlatList
      data={this.state.tracks}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => this.handleRowPress(item)}>
          <Cell cellItem={item} />
        </TouchableOpacity>
      )}
      keyExtractor={(_, index) => index.toString()}

      
      // Horizontal list as the header component of the vertical list
      ListHeaderComponent={() => (
        viewModel.flatlistSwitch === 0 && (
          <>
            <SongRecommendations navigation={this.props.navigation} />
      
            <Text style={styles.heading}>Popular Right Now</Text>
          </>
        )
      )}
    />
  </View>
);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "column",
    backgroundColor: '#fff',
  },
  cell: {
    flexDirection: 'row',
    height: 75,
    marginBottom: 5,
  },
  imageView: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 10,
  },
  contentView: {
    flex: 1,
  },
  accessoryView: {
    width: 40,
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  whiteText: {
    color: 'black',
  },
  boldText: {
    fontWeight: 'bold',
  },
  heading: {
    color: "black",
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 10,
    paddingTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Center children vertically
    paddingHorizontal: 10, // Add some horizontal padding
    paddingVertical: 5, // Add some vertical padding
    marginBottom: 5
  },
  searchBar: {
    flex: 1, // Take up as much space as possible
    backgroundColor: "whitesmoke",
    height: 35,
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10, // Add some margin to the right
  },
  image: {
    width: 100, // Adjust the image width as needed
    height: 100, // Adjust the image height as needed
    alignSelf: 'center', // Center the image horizontally
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
  },
  artistName: {
    fontSize: 14,
    textAlign: 'center', // Center the text horizontally
  },
  box: {
    backgroundColor: '#F7F6F6',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    width: 150, 
    height: 170,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.30,
    shadowRadius: 1.22,
    elevation: 3,
  },
});

export default App;