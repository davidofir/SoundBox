// ChatViewModel.js
import { useState, useEffect } from 'react';
import * as ChatRepository from '../../domain/ChatRepositroy/ChatRepository';
import { authentication } from '../../firebase';
import { getUserProfileData } from '../../domain/FirebaseRepository/UserRepository';

export default function useChatViewModel(roomId) {
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
        const pastMessages = await ChatRepository.getPastMessages(roomId);
        const formattedMessages = pastMessages.map((msg) => {
            return {
                _id: msg.id,
                text: msg.message,
                createdAt: new Date(msg.timestamp._seconds * 1000 + msg.timestamp._nanoseconds / 1000000),
                user: {
                    _id: msg.senderID,
                    name: msg.senderName,
                    // avatar: msg.senderAvatar,
                },
            };
        });
        setMessages(formattedMessages);
    } catch (error) {
        console.error('Failed to fetch past messages:', error.message);
    }
};
  useEffect(() => {

      fetchMessages();

      ChatRepository.joinRoom(roomId, authentication.currentUser.uid);
      ChatRepository.onNewMessage(handleNewMessage);

      return () => {
          ChatRepository.cleanupListeners();
      };
  }, [roomId]);

  function handleNewMessage(message) {
      console.log("Received:", message);
      setMessages((previousMessages) => [message, ...previousMessages]);
  }

    function onSend(newMessage) {
        const userData = getUserProfileData().then((user)=>{
            console.log(user)
            const messageToSend = {
                ...newMessage,
                createdAt: new Date().toISOString(),
                user: {
                    _id: authentication.currentUser.uid,
                    name: user.userName,
                },
            };
      
            ChatRepository.sendMessage(messageToSend);
            setMessages((previousMessages) => [messageToSend, ...previousMessages]);
        })
        console.log(userData);

  }

    return {
        messages,
        onSend
    };
}
