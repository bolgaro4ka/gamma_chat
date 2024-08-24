<script setup lang="ts">

import { ref, type Ref } from 'vue'
import { getMe } from '@/common/jwt'
import axios from 'axios'
import { socket } from '@/socket';
import { useRoute } from 'vue-router';

const route = useRoute()
const file : Ref<File | null> = ref(null)
const msgInput : Ref<HTMLElement | null> = ref(null)
const isImageModalOpen = ref(false)
const me = await getMe()
const emits = defineEmits(['close'])


const CHUNK_SIZE = 64 * 1024; // 64KB

async function handleCreate(e: Event) {
  e.preventDefault();
  if (file.value) {
    await sendFileInChunks(file.value);
  }
}

function handleLoadFile(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    file.value = input.files[0];
  }
}

async function sendFileInChunks(fileParam: File) {
  const totalChunks = Math.ceil(fileParam.size / CHUNK_SIZE);
  console.log(totalChunks, 'sendFileInChunks');
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(fileParam.size, start + CHUNK_SIZE);
    const chunk = fileParam.slice(start, end);
    const chunkBase64 = await fileToBase64(chunk);

    console.log(file.value?.name.split('.').pop(),)

    socket.emit('sendMesssageWithFile', {
      name: me.id,
      userId: me.id,
      text: (msgInput.value as HTMLInputElement).value.trim(),
      chatId: route.params.id,
      file: chunkBase64,
      extension: file.value?.name.split('.').pop(),
      chunkIndex: i,
      totalChunks: totalChunks,
      createdAt: new Date(),
    });

    (msgInput.value as HTMLInputElement).value = '';
    file.value = null;
  }
}

async function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}



const sendMessage = (msg : any) => {
  socket.emit('sendMessage', msg)
}

const  handleSendMessage = async ()=> {
  if (!msgInput.value || !(msgInput.value as HTMLInputElement).value.trim() ) return
  const me = await getMe()

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
        <input id="file" type="file"  @change="handleLoadFile"/>
        <label for="file" id="fileLabel"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg></label>
        <button type="submit" ref="sendBtn" @click="file ? handleCreate($event) : handleSendMessage()"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
    </form>

</template>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: row;
    align-items: center;
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
        height: 100%;
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

    input[type="file"] {
        display: none;
    }
  
  }
</style>