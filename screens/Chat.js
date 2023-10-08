import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import {REACT_APP_BACKEND_BASE_URL} from '@env'
import { authentication } from '../firebase';
import * as SecureStore from 'expo-secure-store';
const socket = io(REACT_APP_BACKEND_BASE_URL);

const ArtistChat = ({route}) => {
  const [messages, setMessages] = useState([]);
  const [distinctUser, setDistinctUser] = useState('');
  const roomId = 'artist';
  const userId = 'user';
  const [userNum, setUserNum] = useState(0);
  useEffect(() => {
    console.log(route.params.roomId)
    socket.on('connection', () => {
      console.log('Connected to server');
    });

    const newUserNum = userNum + 1;
    setUserNum(newUserNum);
    const newUser = Math.random(30);
    setDistinctUser(newUser);

    socket.on('message', handleNewMessage);
    socket.on('user-connected', handleUserConnected);
    socket.on('user-disconnected', handleUserDisconnected);

    socket.emit('join-room', route.params.roomId,authentication.currentUser.uid);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('user-connected', handleUserConnected);
      socket.off('user-disconnected', handleUserDisconnected);
    };
  }, []);
  function handleNewMessage(message) {
    console.log('Received message:', message);

    const transformedMessage = {
      _id: message._id,
      text: message.text,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.user._id,
        name: message.user.name,
      },
    };

    setMessages((previousMessages) => [transformedMessage, ...previousMessages]);
  }

  function handleUserConnected() {

    const systemMessage = {
      _id: new Date().getTime(),
      text: `user has joined the room`,
      createdAt: new Date(),
      system: true,
    };

    setMessages((previousMessages) => [systemMessage, ...previousMessages]);
  }

  function handleUserDisconnected(userId) {
    console.log(`${userId} has left the room`);

    const systemMessage = {
      _id: new Date().getTime(),
      text: `user has left the room`,
      createdAt: new Date(),
      system: true,
    };

    setMessages((previousMessages) => [systemMessage, ...previousMessages]);
  }

  function onSend(newMessages = []) {
    const { text, user } = newMessages[0];
    console.log(user);
    const message = {
      _id: new Date().getTime(),
      text,
      createdAt: new Date(),
      user: {
        _id: user._id,
        name: user.name,
      },
    };

    socket.emit('message', message);

    setMessages((previousMessages) => [message, ...previousMessages]);
  }

  return (
    <GiftedChat
      messages={messages.slice()} // Reverse the order of messages
      onSend={onSend}
      user={{
        _id: authentication.currentUser.uid,
        name: authentication.currentUser.email,
      }}
    />
  );
};

export default ArtistChat;