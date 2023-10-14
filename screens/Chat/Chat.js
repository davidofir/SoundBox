import React, { useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import useChatViewModel from './ChatViewModel';
import { authentication } from '../../firebase';

const ArtistChat = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({ title: route.params.userName });
  }, [navigation, route.params.userName]);

  const { messages, onSend } = useChatViewModel(route.params.roomId);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: 'lightblue' },  // Incoming messages
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages.slice()}
      onSend={newMessages => onSend(newMessages[0])}
      user={{
        _id: authentication.currentUser.uid,
        name: authentication.currentUser.email,
      }}
      renderBubble={renderBubble}
    />
  );
};

export default ArtistChat;
