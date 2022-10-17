import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from './screens/Discover'
import Homepage from './screens/Homepage';
import ArtistProfile from './screens/ArtistProfile';
import Store from './screens/Store';
import Events from './screens/Events';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="Artist" component={ArtistProfile} />
        <Stack.Screen name="Merch Store" component={Store} />
        <Stack.Screen name="Upcoming Events" component={Events} />
        <Stack.Screen name="Login Screen" component={Login} />
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