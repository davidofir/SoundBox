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
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { searchAndFetchSongCoverArt } from '../domain/SpotifyAPI/SpotifyAPI';

// Model Class
class TrackModel {
  constructor() {
    this.tracks = [];
  }

  

  async fetchTopTracks() {
    const apiKey = "a7e2af1bb0cdcdf46e9208c765a2f2ca";
    const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`;

    const response = await fetch(url);
    const json = await response.json();
    this.tracks = json.tracks.track;
  }

  async fetchSong(searchInput) {
    const apiKey = "a7e2af1bb0cdcdf46e9208c765a2f2ca";
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchInput}&api_key=${apiKey}&format=json`;

    const response = await fetch(url);
    const json = await response.json();
    this.tracks = json.results.trackmatches.track;

  }



  getTracks() {
    return this.tracks;
  }
}

// ViewModel Class
class AppViewModel {
  constructor() {
    this.trackModel = new TrackModel();
    this.searchInput = '';
    this.flatlistSwitch = 0;
  }

  async fetchTopTracks() {
    await this.trackModel.fetchTopTracks();
    this.flatlistSwitch = 0
  }

  async fetchSong() {
    await this.trackModel.fetchSong(this.searchInput);
    this.flatlistSwitch = 1

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

// Cell Component
class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverArtUrl: null,
    };
  }

  componentDidMount() {
    // Fetch and set the cover art URL when the component mounts.
    this.fetchCoverArt();
  }

  async componentDidUpdate(prevProps) {
    // Check if the cellItem has changed (e.g., when searching for a new song)
    if (prevProps.cellItem !== this.props.cellItem) {
      this.fetchCoverArt(); // Fetch cover art for the new cellItem
    }
  }


  async fetchCoverArt() {
    const { cellItem } = this.props;
    const { name, artist } = cellItem;
    var artistNameImage = cellItem.artist.name
    if(viewModel.flatlistSwitch == 1){
      artistNameImage = cellItem.artist
    }

    try {
      const imageUrl = await searchAndFetchSongCoverArt(name, artistNameImage);
      this.setState({ coverArtUrl: imageUrl });
    } catch (error) {
      console.error('Error fetching cover art:', error);
    }
  }

   render() {
    const { cellItem } = this.props;
    let artistName = cellItem.artist.name;

    if (viewModel.flatlistSwitch === 1) {
      if (cellItem.artist) {
        if (typeof cellItem.artist === 'string') {
          artistName = cellItem.artist;
        } else if (cellItem.artist.name) {
          artistName = cellItem.artist.name;
        }
      }
    }

    const { coverArtUrl } = this.state; // Get coverArtUrl from component state

    return (
      <TouchableWithoutFeedback>
        <View style={styles.cell} onStartShouldSetResponder={() => true}>
          {coverArtUrl && ( // Use coverArtUrl from state to display the image
            <Image
              style={styles.imageView}
              source={{ uri: coverArtUrl }}
            />
          )}
          <View style={styles.contentView}>
            <Text style={[styles.whiteText, styles.boldText]}>
              {cellItem.name}
            </Text>
            <Text style={styles.whiteText}>{artistName}</Text>
          </View>
          <View style={styles.accessoryView}>
            <Text style={[styles.textCenter, styles.whiteText]}></Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// Main App Component
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tracks: [] };

    // Fetch API data using the ViewModel
    viewModel.fetchTopTracks().then(() => {
      this.setState({ tracks: viewModel.getTracks() });
    });
  }

  componentWillUnmount() {
    // Clear the state in componentWillUnmount
    this.setState({ 
      tracks: viewModel.fetchTopTracks,
      searchInput: "",
      });
  }

  renderElement() {
    if (viewModel.flatlistSwitch == 0) {
      return <Text style={styles.heading}>{"Popular Right Now"}</Text>;
    }
  }

  async handleSearchButtonPress() {
    this.setState({ isSearching: true }); // Set searching state to true
    await viewModel.fetchSong().then(() => {
      this.setState({ tracks: viewModel.getTracks(), isSearching: false}); // Update tracks and set searching state to false
    });
  }
  
  render() {
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
            viewModel.fetchSong().then(() => {
              this.setState({ tracks: viewModel.getTracks() });
              
            });

          }}
          title="Search"
        />
  
        {/* Heading */}
        {viewModel.flatlistSwitch === 0 && (
          <Text style={styles.heading}>Popular Right Now</Text>
        )}
  
        {/* Songs */}
        <FlatList
          data={this.state.tracks}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const artistName =
                  viewModel.flatlistSwitch == 1 ? item.artist : item.artist.toString();
                this.props.navigation.navigate('RatingPage', {
                  paramArtistName: item.artist.name,
                  paramSongName: item.name,
                  paramSearchedArtist: artistName,
                  paramSearched: viewModel.flatlistSwitch,
                });
              }}
            >
              <Cell cellItem={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
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
});
