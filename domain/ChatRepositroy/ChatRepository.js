import { io } from 'socket.io-client';
import environment from '../../environment'

import { REACT_APP_BACKEND_BASE_URL } from '@env';

const socket = io(environment.backendBaseUrl);

export function joinRoom(roomId, userId) {
  socket.emit('join-room', roomId, userId);
}

export function sendMessage(message) {
  socket.emit('message', message);
}

export function onNewMessage(callback) {
  socket.on('message', callback);
}

export function cleanupListeners() {
  socket.off('message');
}
export async function getPastMessages(roomId) {
  try {
      const response = await fetch(`${environment.backendBaseUrl}/getPastMessages/${roomId}`);
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Error fetching messages for room ' + roomId + '. Server says: ' + errorData.message);
      }

      const messages = await response.json();
      return messages;
  } catch (error) {
      console.error('Error fetching messages:', error.message);
      throw error;
  }
}