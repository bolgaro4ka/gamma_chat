<script setup lang="ts">

import { ref, type Ref } from 'vue'
import { getMe } from '@/common/jwt'
import axios from 'axios'
import { socket } from '@/socket';
import { useRoute } from 'vue-router';

const route = useRoute()
const file : Ref<File | null> = ref(null)
const msgInput : Ref<string> = ref('')
const isImageModalOpen = ref(false)
const me = await getMe()
const emits = defineEmits(['close'])

const fileName = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)

const CHUNK_SIZE = 64 * 1024; // 64KB

async function handleCreate(e: Event) {
  if (msgInput.value.length > 1000) {
    alert('Куда столько символов')
     return
  }
  e.preventDefault();
  if (file.value) {
    isUploading.value = true;
    await sendFileInChunks(file.value);
    isUploading.value = false;
    uploadProgress.value = 0;
    fileName.value = '';
  }
}

function handleLoadFile(e: Event) {
  if (msgInput.value.length > 1000) {
    alert('Куда столько символов')
     return
  }
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    file.value = input.files[0];
    fileName.value = input.files[0].name;
  }
}

async function sendFileInChunks(fileParam: File) {
  const totalChunks = Math.ceil(fileParam.size / CHUNK_SIZE);
  uploadProgress.value = 0;
  let sentChunks = 0;

  // Флаг для отслеживания успешной отправки всех чанков
  let allChunksSent = false;

  // Слушаем подтверждение с сервера о получении последнего чанка
  function onFileUploadAck(data: any) {
    if (data && data.chunkIndex === totalChunks - 1 && data.status === 'ok') {
      allChunksSent = true;
      isUploading.value = false;
      uploadProgress.value = 100;
      fileName.value = '';
      file.value = null;
      socket.off('fileUploadAck', onFileUploadAck);
    }
  }
  socket.on('fileUploadAck', onFileUploadAck);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(fileParam.size, start + CHUNK_SIZE);
    const chunk = fileParam.slice(start, end);
    const chunkBase64 = await fileToBase64(chunk);

    socket.emit('sendMesssageWithFile', {
      name: me.id,
      userId: me.id,
      text: msgInput.value,
      chatId: route.params.id,
      file: chunkBase64,
      extension: file.value?.name.split('.').pop(),
      chunkIndex: i,
      totalChunks: totalChunks,
      createdAt: new Date(),
    });
    sentChunks++;
    uploadProgress.value = Math.round((sentChunks / totalChunks) * 95); // максимум 95%, остальное после подтверждения
  }

  // Если сервер не прислал подтверждение, сбрасываем прогресс через таймаут
  setTimeout(() => {
    if (!allChunksSent) {
      isUploading.value = false;
      uploadProgress.value = 100;
      fileName.value = '';
      file.value = null;
      socket.off('fileUploadAck', onFileUploadAck);
    }
  }, 10000); // 10 секунд ожидания

  msgInput.value = '';
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
  if (msgInput.value.length > 1000) {
    alert('Куда столько символов')
     return
  }
  if (!msgInput.value || !msgInput.value.trim() ) return
  const me = await getMe()

  sendMessage({
    text: msgInput.value.trim(),
    createdAt: new Date(),
    userId: me.id,
    chatId: route.params.id
  });

  msgInput.value = ''
}
</script>

<template>
    <form @submit.prevent>
        <div v-if="fileName" class="file-info">
            <span>{{ fileName }}</span>
            <button type="button" class="remove-file" @click="file = null; fileName = ''">✕</button>
        </div>
        <input type="text" placeholder="Message" id="message" v-model="msgInput" max="500" :disabled="isUploading">
        <input id="file" type="file"  @change="handleLoadFile" :disabled="isUploading" />
        <label for="file" id="fileLabel" :class="{ uploading: isUploading }">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
        </label>
        <button type="submit" ref="sendBtn" @click="file ? handleCreate($event) : handleSendMessage()" :disabled="isUploading">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
        </button>
    </form>
    <transition name="fade">
        <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
                <div class="progress" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span>Загрузка файла... {{ uploadProgress }}%</span>
        </div>
    </transition>
</template>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 14px;
    height: 70px !important;
    bottom: 0;
    right: 0;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(34, 40, 49, 0.65);;
    position: relative;

    input {
        width: 100%;
        border-radius: 16px;
        border: none;
        padding: 12px 18px;
        height: 48px;
        background: #181818;
        color: #fff;
        font-size: 1.1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: box-shadow 0.2s;
    }

    input:focus, input:active, input:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px #6a82fb;
    }

    button {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(106,130,251,0.10);
        transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        cursor: pointer;
    }
    button:hover {
        background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
        box-shadow: 0 4px 16px rgba(252,92,125,0.18);
        transform: scale(1.08);
    }

    input[type="file"] {
        display: none;
    }

    #fileLabel {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        box-shadow: 0 2px 8px rgba(31,38,135,0.08);
        margin-right: 2px;
    }
    #fileLabel:hover {
        background: #6a82fb;
        box-shadow: 0 4px 16px rgba(106,130,251,0.18);
        transform: scale(1.08);
    }

    #fileLabel.uploading {
        opacity: 0.6;
        pointer-events: none;
    }
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: center;
    
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 6px 14px;
    margin-bottom: 8px;
    height: 60px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 1.05rem;
    color: #fff;
    gap: 10px;
    box-shadow: 0 2px 8px rgba(106,130,251,0.08);
    span {
        flex: 1;
        font-size: 16px;
        word-break: break-all;
    }
    .remove-file {
        background: none;
        border: none;
        color: #fc5c7d;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 6px;
        border-radius: 50%;
        transition: background 0.2s;
    }
    .remove-file:hover {
        background: rgba(252,92,125,0.12);
    }
}
.upload-progress {
    position: absolute;
    left: 50%;
    bottom: 80px;
    transform: translateX(-50%);
    background: rgba(34, 40, 49, 0.92);
    border-radius: 14px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
    border: 1.5px solid rgba(255,255,255,0.08);
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 100;
    min-width: 220px;
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #181818;
        border-radius: 8px;
        margin-bottom: 10px;
        overflow: hidden;
    }
    .progress {
        height: 100%;
        background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
        border-radius: 8px;
        transition: width 0.2s;
    }
    span {
        color: #fff;
        font-size: 1rem;
        font-weight: 500;
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>