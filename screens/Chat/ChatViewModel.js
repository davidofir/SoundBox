// ChatViewModel.js
import { useState, useEffect } from 'react';
import * as ChatManager from '../../Business Logic/ChatManager/ChatManager';
import { authentication } from '../../firebase';
import { getUserProfileData } from '../../domain/FirebaseRepository/UserRepository';
import { v4 as uuidv4 } from 'uuid';
export default function useChatViewModel(roomId) {
  const [messages, setMessages] = useState([]);
  const [prevId,setPrevId] = useState();
  const fetchMessages = async () => {
    try {
        const pastMessages = await ChatManager.getPastMessages(roomId);
        const formattedMessages = pastMessages.map((msg) => {
            return {
                _id: msg.id,
                text: msg.message,
                createdAt: new Date(msg.timestamp._seconds * 1000 + msg.timestamp._nanoseconds / 1000000),
                user: {
                    _id: msg.senderID,
                    name: msg.senderName,
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

      ChatManager.joinRoom(roomId, authentication.currentUser.uid);
      ChatManager.onNewMessage(handleNewMessage);

      return () => {
          ChatManager.cleanupListeners();
      };
  }, [roomId]);

  function handleNewMessage(message) {
      console.log("Received:", message);
      setMessages((previousMessages) => [message, ...previousMessages]);
  }

    function onSend(newMessage) {

        let currId = uuidv4();
        if(currId !== prevId){
        const userData = getUserProfileData().then((user)=>{
            console.log(user)
            const messageToSend = {
                ...newMessage,
                id: currId,
                createdAt: new Date().toISOString(),
                user: {
                    _id: authentication.currentUser.uid,
                    name: user.userName,
                },
            };

                setPrevId(currId);
                ChatManager.sendMessage(messageToSend);
                setMessages((previousMessages) => [messageToSend, ...previousMessages]);
            

        })
    }

  }

    return {
        messages,
        onSend
    };
}
