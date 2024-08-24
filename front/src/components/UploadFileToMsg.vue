<script setup lang="ts">

import { reloadPage } from '@/common/app';
import { getMe } from '@/common/jwt';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '@/socket';
import { text } from 'stream/consumers';

const me = await getMe();
const imgFile = ref<File | null>(null);

const props = defineProps(['chatID', 'text'])

const emits = defineEmits(['close']);

const CHUNK_SIZE = 64 * 1024; // 64KB

async function handleCreate(e: Event) {
  e.preventDefault();
  if (imgFile.value) {
    await sendFileInChunks(imgFile.value);
  }
  emits('close');
}

function handleLoadFile(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    imgFile.value = input.files[0];
  }
}

async function sendFileInChunks(file: File) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);
    const chunkBase64 = await fileToBase64(chunk);

    socket.emit('sendMesssageWithFile', {
      name: me.id,
      userId: me.id,
      text: props.text,
      chatId: props.chatID,
      image: chunkBase64,
      chunkIndex: i,
      totalChunks: totalChunks,
    });
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
</script>

<template>
    <div class="createChat" >
        <form>
            <input type="file" @change="handleLoadFile" accept="image/*"/>
            <button type="submit" value="Create" @click="handleCreate">Создать</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
.createChat {
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        margin-top: 10px;
        padding: 10px;
        background-color: #2a3038;


        .peoples {
            display: flex;
            width: 800px;
            align-items: center;

            svg {
                transform: scale(3);
                margin-right: 15px;
                margin-left: 10px;
                fill: #2e73a3;

            }
        }
    }

    input {
        width: 100%;
        border-radius: 20px;
        border: none;
        padding: 10px;
        background-color: #181818;
        color: white;
    }

    select {
        width: 100%;
        border-radius: 20px 0px 0px 20px;
        border: none;
        padding: 10px;
        height: 300px;
        background-color: #181818;
        color: white;
    }

    select:active, select:focus, select:focus-within, select:hover, input, input:active, input:focus, input:focus-within, input:hover {
        outline: none;
    }

    button {
        width: 100%;
        height: 30px;
        border: none;
        color: white;
        background-color: #2e73a3;
        display: flex;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
    }
}
</style>