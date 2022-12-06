import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from './screens/Discover'
import Homepage from './screens/Homepage';
import ArtistProfile from './screens/ArtistProfile/ArtistProfile';
import Store from './screens/ArtistProfile/Store';
import Events from './screens/ArtistProfile/Events';
import Login from './screens/Login';
import Register from './screens/Register';
import ProfilePage from './screens/ProfilePage';
import RatingPage from './screens/RatingPage'
import SocialFeed from './screens/SocialFeed';
import FollowersPage from './screens/FollowersPage';
import FollowingPage from './screens/FollowingPage';
import SearchPage from './screens/SearchPage';
import UserPage from './screens/UserPage';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="Artist" component={ArtistProfile} />
        <Stack.Screen name="Merch Store" component={Store} />
        <Stack.Screen name="Upcoming Events" component={Events} />
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Social Feed" component={SocialFeed} />
        <Stack.Screen name="Followers" component={FollowersPage} />
        <Stack.Screen name="Following" component={FollowingPage} />
        <Stack.Screen name="RatingPage" component={RatingPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="UserPage" component={UserPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});