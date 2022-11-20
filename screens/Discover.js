import React, { Component } from 'react';
import { Feather, Entypo } from "@expo/vector-icons";
//import { SearchBar } from "react-native-elements";
import RatingPage from './RatingPage';
//import { withNavigation } from 'react-navigation';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  Button,
  FlatList,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationHelpersContext } from '@react-navigation/native';

class Cell extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      error: null,
      searchValue: "",
    };
  }



  
  render(){
    
    return(
      //onPress={() => {Alert.alert("View Clicked " + this.props.cellItem.name)}}
      
      <TouchableWithoutFeedback >
        <View style={styles.cell} onStartShouldSetResponder={() => true} >
          
          

          <Image 
          
            style={styles.imageView} 
            source={{uri: this.props.cellItem.image[3]['#text']}}/>
          <View style={styles.contentView} >
            
            <Text style={[styles.whiteText, styles.boldText]}>{this.props.cellItem.name}</Text>
            <Text style={styles.whiteText}>{this.props.cellItem.artist.name}</Text>
          </View>
          <View style={styles.accessoryView}>
          <Text style={[styles.textCenter, styles.whiteText]}></Text>
          </View>
        </View>
        </TouchableWithoutFeedback>
    )
  }
}

class App extends React.Component  {


  fetchTopTracks(){
    const apiKey = "a7e2af1bb0cdcdf46e9208c765a2f2ca"
    const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`

    
    return fetch(url)
    .then(response => response.json())
  }

  

  constructor(props){
    super(props)

    this.state = { tracks:[] }

    //fetch api data
    this.fetchTopTracks()
    .then(json => { this.setState({tracks: json.tracks.track}) 
    })
  }



  render() {

    const tableData = Array(50).fill('Hello, World!')

      return ( 
    
    
        <View style = {styles.container} >
          {/* Searchbar */}
    
          {/* Heading */}
          <Text style={styles.heading  }>Popular Right Now</Text>
    
          {/* Songs*/}
          <FlatList 
          
            data={this.state.tracks}
           
            renderItem={({item}) => (
              <TouchableHighlight
              onPress={() => this.props.navigation.navigate('RatingPage')}>
              <Cell cellItem={item}/>
              
              </TouchableHighlight>
              
            )}
            
            keyExtractor={(_, index) => index}
            
            
            
          />
         
          </View>
        );
  }

}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "column",
    backgroundColor: '#000'
  },
  cell: {
    flexDirection: 'row',
    height: 75,
    marginBottom: 5,
  },
  imageView:{
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 10,
  },
  contentView:{
    flex: 1,
  },
  accessoryView:{
    width: 40,
    justifyContent: 'center'
  },  
  textCenter: {
    textAlign: 'center'
  },
  whiteText:{
    color: 'white',
  },
  boldText:{
    fontWeight: 'bold'
  },
  heading: {
    color: "white",
    fontWeight: 'bold',
    fontSize: "30",
    paddingBottom: 20
  }
});