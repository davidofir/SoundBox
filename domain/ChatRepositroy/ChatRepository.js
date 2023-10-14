import { io } from 'socket.io-client';
import {REACT_APP_BACKEND_BASE_URL} from '@env';

const socket = io(REACT_APP_BACKEND_BASE_URL);


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
