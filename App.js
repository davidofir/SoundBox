import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from './screens//Discover/Discover'
import Homepage from './screens/Homepage';
import ArtistProfile from './screens/ArtistProfile/ArtistProfile';
import Store from './screens/ArtistProfile/Store';
import Events from './screens/ArtistProfile/Events';
import Login from './screens/Login/Login';
import Register from './screens/Register/Register';
import ProfilePage from './screens/AccountProfile/ProfilePage';
import RatingPage from './screens/ReviewSongs/RatingPage'
import SocialFeed from './screens/SocialFeed';
import FollowersPage from './screens/AccountProfile/FollowersPage';
import FollowingPage from './screens/AccountProfile/FollowingPage';
import SearchPage from './screens/SearchPage';
import UserPage from './screens/UserPage';
import Recommendations from './screens/Recommendations/Recommendation';
import Chat from './screens/Chat/Chat';
import EditAccountPage from './screens/AccountProfile/EditAccountPage';
import SongReviewsPage from './screens/ReviewSongs/SongReviewsPage';
import LoggedUsersReviewPage from './screens/ReviewSongs/LoggedUsersReviewPage'
import CommentPage from './screens/Feed/CommentPage';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});
const Stack = createStackNavigator();
const getNotificationsPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.error('Failed to get push token for push notification!');
    return;
  }
}
export default function App() {
  useEffect(() => {
    getNotificationsPermission().then(() => {
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification Received:', notification);
        // Handle the received notification
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification Response:', response);
        // Handle the notification response
      });

      // Cleanup function
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }).catch((error) => console.log('Permission Rejected', error));

  }, []);
  return (
    <NavigationContainer>
      <StatusBar
        style="dark"
      />
      <Stack.Navigator initialRouteName='Login'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white',
            shadowOffset: {
              width: 0,
              height: 1.5,
            },
            shadowOpacity: 0.3,
          },
          headerTintColor: '#4f4f4f',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: true,
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="Artist" component={ArtistProfile} />
        <Stack.Screen name="Merch Store" component={Store} />
        <Stack.Screen name="Upcoming Events" component={Events} />
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Home" component={SocialFeed} />
        <Stack.Screen name="Followers" component={FollowersPage} />
        <Stack.Screen name="Following" component={FollowingPage} />
        <Stack.Screen name="RatingPage" component={RatingPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="UserPage" component={UserPage} />
        <Stack.Screen name="Recommendations" component={Recommendations} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="EditAccount" component={EditAccountPage} />
        <Stack.Screen name="SongReviewsPage" component={SongReviewsPage} />
        <Stack.Screen name="LoggedUsersReviewPage" component={LoggedUsersReviewPage} />
        <Stack.Screen name="Comment" component={CommentPage} />
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