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
  ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Recommendations from '../Recommendations/Recommendation';
import { searchAndFetchSongCoverArt } from '../../domain/SpotifyAPI/SpotifyAPI';
import { TrackModel } from '../../domain/LastFM_API/LastFM_API';
import { useState, useEffect, memo } from 'react';
const defaultCoverArt = require('../../assets/defaultSongImage.png')
import { fetchRecommendedSongs } from '../Recommendations/RecommendSongs';

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
          {/* Other components or content */}
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
                   recommendedSongs: null };

    viewModel.fetchTopTracks().then(() => {
      this.setState({ tracks: viewModel.getTracks() });
    });
  }
  async componentDidMount() {
    try {
      const songsData = await fetchRecommendedSongs();
      this.setState({ recommendedSongs: songsData });
    } catch (error) {
      console.error(error);
    }
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
    const { recommendedSongs } = this.state;
    return (
      <View style={styles.container}>
        {/* Searchbar */}
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          onChangeText={(text) => viewModel.setSearchInput(text)}
          placeholder="Search"
          placeholderTextColor="grey"
          style={styles.searchBar}
        />
        {/* Button */}
        <Button
          onPress={() => {
            const input = viewModel.searchInput; // Access the searchInput from the viewModel
            if (input && input.trim() !== "") { // Check if the input is not empty or just whitespace
              viewModel.fetchSong().then(() => {
                this.setState({ tracks: viewModel.getTracks() });
              });
            }
          }}
          title="Search"
        />
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
        <>
        <Text style={styles.heading}>Recommended For You</Text>
          {recommendedSongs ? (
            <FlatList
              horizontal
              data={recommendedSongs.similartracks.track.slice(0, 6)}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.box}>
                  <Image
                    source={defaultCoverArt}
                    style={styles.image}
                  />
                  <Text style={styles.songName}>
                    {item.name.length > 25
                      ? `${item.name.slice(0, 31)}...`
                      : item.name
                    }
                  </Text>
                  <Text style={styles.artistName}>{item.artist.name}</Text>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          ) : (
            <Text>Loading...</Text>
          )}

          {/* Any other content you want at the top of the vertical list */}
          <Text style={styles.heading}>Popular Right Now</Text>
        </>
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
    paddingBottom: 20,
    paddingTop: 20,
  },
  searchBar: {
    backgroundColor: "whitesmoke",
    height: 35,
    borderRadius: 20,
    paddingLeft: 10,
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