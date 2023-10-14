// ArtistChat.js
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import useChatViewModel from './ChatViewModel';
import { authentication } from '../../firebase';

const ArtistChat = ({route}) => {
  const { messages, onSend } = useChatViewModel(route.params.roomId);

  return (
    <GiftedChat
      messages={messages.slice()}
      onSend={newMessages => onSend(newMessages[0])}
      user={{
        _id: authentication.currentUser.uid,
        name: authentication.currentUser.email,
      }}
    />
  );
};

export default ArtistChat;