import React from 'react';
import { ScrollView, View } from 'react-native';
import ArtistRecommendations from './RecommendArtistView';
import SongRecommendations from './RecommendSongView';

const Recommendations = ({ navigation }) => {
 
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 5}}>
  
      <ArtistRecommendations navigation={navigation} />
  

      <View style={{marginVertical: 40}}></View>
  
      <SongRecommendations navigation={navigation} />
  
    </ScrollView>
  );
}

export default Recommendations;