<script setup lang="ts">

import { ref, type Ref } from 'vue'
import { getMe } from '@/common/jwt'
import axios from 'axios'
import { socket } from '@/socket';
import { useRoute } from 'vue-router';


const msgInput : Ref<HTMLElement | null> = ref(null)

const route = useRoute()



const sendMessage = (msg) => {
  socket.emit('sendMessage', msg)
  
}

const  handleSendMessage = async ()=> {
  if (!msgInput.value || !(msgInput.value as HTMLInputElement).value.trim() ) return

  const me = await getMe()

  console.log(me)


  sendMessage({
    text: (msgInput.value as HTMLInputElement).value.trim(),
    createdAt: new Date(),
    userId: me.id,
    chatId: route.params.id
  });

  (msgInput.value as HTMLInputElement).value = ''
}
</script>

<template>
    
    <form @submit.prevent>
        <input type="text" placeholder="Message" id="message" ref="msgInput">
        <button type="submit" ref="sendBtn" @click="handleSendMessage"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
    </form>
</template>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: row;
    gap: 10px;
    height: 70px !important;
    bottom: 0;
    right: 0;
    padding: 10px;
    background-color: #2a3038;

    input {
        width: 100%;
        border-radius: 20px;
        border: none;
        padding: 10px;
        background-color: #181818;
        color: white;
    }

    input:focus, input:active, input:focus-visible {
        outline: none;
    }

    button {
        width: 50px;
        height: 50px;
        border-radius: 1000000px;
        border: none;
        background-color: #2e73a3;
        display: flex;
        align-items: center;
        justify-content: center;
    }
  
  }
</style>