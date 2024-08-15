import {io } from 'socket.io-client';
import { reactive } from 'vue';

export const socket = io('http://localhost:3000', { transports: ['websocket'] });

export const state = reactive({
    connected: false,
  });



socket.on("connect", () => {
    state.connected = true;
});
  
socket.on("disconnect", () => {
    state.connected = false;
});