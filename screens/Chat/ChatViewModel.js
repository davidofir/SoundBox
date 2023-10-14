// ChatViewModel.js
import { useState, useEffect } from 'react';
import * as ChatRepository from '../../domain/ChatRepositroy/ChatRepository'
import { authentication } from '../../firebase';

export default function useChatViewModel(roomId) {
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      ChatRepository.joinRoom(roomId, authentication.currentUser.uid);
      ChatRepository.onNewMessage(handleNewMessage);
  
      return () => {
        // Clean up listeners when the component unmounts.
        ChatRepository.cleanupListeners();
      };
    }, [roomId]);
  
    function handleNewMessage(message) {
      // Debugging: Log the received message
      console.log("Received:", message);
  
      setMessages((previousMessages) => [message, ...previousMessages]);
    }
  
    function onSend(newMessage) {
      const messageToSend = {
        ...newMessage,
        createdAt: new Date(),
        user: {
          _id: authentication.currentUser.uid,
          name: authentication.currentUser.email,
        },
      };
  
      ChatRepository.sendMessage(messageToSend);
      setMessages((previousMessages) => [messageToSend, ...previousMessages]);
    }
  
    return {
      messages,
      onSend
    };
  }