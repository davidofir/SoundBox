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
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

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
  }

  async fetchSong() {
    await this.trackModel.fetchSong(this.searchInput);
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
  render() {
    const cellItem = this.props.cellItem;
    const artistName = viewModel.flatlistSwitch === 1 ? cellItem.artist : cellItem.artist.name;

    return (
      <TouchableWithoutFeedback>
        <View style={styles.cell} onStartShouldSetResponder={() => true}>
          <Image
            style={styles.imageView}
            source={{ uri: cellItem.image[3]['#text'] }}
          />
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
    this.setState({ tracks: [] });
  }

  renderElement() {
    if (viewModel.flatlistSwitch === 0) {
      return <Text style={styles.heading}>{"Popular Right Now"}</Text>;
    }
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
        <Button
          onPress={() => {
            viewModel.fetchSong().then(() => {
              this.setState({ tracks: viewModel.getTracks() });
            });
            viewModel.setFlatlistSwitch(1);
          }}
          title="Search"
        />

        {/* Heading */}
        {this.renderElement()}

        {/* Songs */}
        <FlatList
          data={this.state.tracks}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                let artistName =
                  viewModel.flatlistSwitch === 1 ? item.artist.toString() : 0;
                this.props.navigation.navigate('RatingPage', {
                  paramArtistName: item.artist.name,
                  paramSongName: item.name,
                  paramSearchedArtist: artistName.toString(),
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
