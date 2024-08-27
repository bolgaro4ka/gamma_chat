import {io } from 'socket.io-client';
import { reactive } from 'vue';
import { BASE_URL, BASE_URL_API } from './common/config'

export const socket = io(BASE_URL_API, { transports: ['websocket'] });

export const state = reactive({
    connected: false,
  });



socket.on("connect", () => {
    state.connected = true;
});
  
socket.on("disconnect", () => {
    state.connected = false;
});