<script setup lang="ts">
import { getMe } from '@/common/jwt';
import { onMounted, type Ref } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import NoChatAvailable from './NoChatAvailable.vue';
import { ref } from 'vue';
import { reloadPage } from '@/common/app';
import { useRouter } from 'vue-router';
import { socket } from '@/socket';
import Loader from './Loader.vue';
import UpdateChat from './UpdateChat.vue';
import Modal from './Modal.vue';
import { useRoute } from 'vue-router';
import UpdateImgChat from './UpdateImgChat.vue';


const me = await getMe();
const host = ref(axios.defaults.baseURL)

const chats_axios = await axios.get('/api/my/chats')
const emits = defineEmits(['closeMobilePanel'])
const chats : any = ref(chats_axios.data)

const isContextMenuOpen = ref(false)
const isUpdateModalOpen = ref(false)
const isImageModalOpen = ref(false)

const contextMenu : Ref<null> | Ref<HTMLElement> = ref(null)
const currentChatID : Ref<null> | Ref<string> = ref(null)

const route = useRoute()
const router = useRouter()


function handleContextMenu(e : MouseEvent) {
    e.preventDefault();
    const x =  e.clientX;
    const y =  e.clientY;

    const currentTarget = e.currentTarget as HTMLElement;
    const chatID = currentTarget.getAttribute('chatId');

    currentChatID.value = chatID

    isContextMenuOpen.value = !isContextMenuOpen.value;

    (contextMenu.value as HTMLElement).style.left = `${x}px`;
    (contextMenu.value as HTMLElement).style.top = `${y}px`;

}

function handleDestroyChat(e : MouseEvent) {
    e.preventDefault();
    const chatID = currentChatID.value;
    isContextMenuOpen.value = false
    socket.emit('deleteChat', Number(chatID))
}

function handleUpdateBg(e : MouseEvent) {
    e.preventDefault();
    const chatID = currentChatID.value;
    isContextMenuOpen.value = false
    isImageModalOpen.value = !isImageModalOpen.value

}

document.getElementsByTagName('main')[0].addEventListener('closeContextsMenu', () => {
    isContextMenuOpen.value = false
})

socket.on('recChat', (data) => {
    if (data.userIds.includes(me.id))
    console.log(data)
    chats.value.push(data)
})

socket.on('delChat', (data) => {
    chats.value = chats.value.filter((chat : any) => chat.id != data.id)
})

socket.on('updChat', async (data) => {
  const response = await axios.get('/api/my/chats')
  const myChats = response.data
  const index = chats.value.findIndex((chat: any) => chat.id === data.id)

  if (index !== -1) {
    const updatedChat = myChats.find((chat: any) => chat.id === data.id)
    if (!updatedChat) {
      // Если чата нет в списке, значит он был удален
      chats.value.splice(index, 1)
      console.log(route.params.id, data.id)
      if (route.params.id == data.id) {
        reloadPage(router);
      }
    } else {
      chats.value[index] = updatedChat
    }
  } else {
    // Если чата нет в списке, значит он был добавлен
    const newChat = myChats.find((chat: any) => chat.id === data.id)
    if (newChat) {
      chats.value.push(newChat)
    }
  }
})

function handleUpdateChat(e : MouseEvent) {
    e.preventDefault();
    isContextMenuOpen.value = false
    isUpdateModalOpen.value = !isUpdateModalOpen.value

}


</script>

<template>
    <div v-if="chats">
        <RouterLink v-for="chat in chats" :key="chat.id" :to="`/chat/${chat.id}`" @click="emits('closeMobilePanel')">
            <div class="chatsBtn" @contextmenu="handleContextMenu" :chatId="chat.id" :class="chat.id == route.params.id ? 'chatsBtn__active' : ''">
                <template v-if="chat.avatar">
                    <img :src="host+chat.avatar?.replace('.', '')" alt="avatar">
                </template>
                <template v-else>
                    <div class="chatsBtn__avatar"></div>
                </template> 
                <p>{{ chat.name }}</p>
            </div>
        
        </RouterLink>
    </div>
    <NoChatAvailable v-else/>
    <Teleport to="body">
        <div class="contextMenu" v-show="isContextMenuOpen" ref="contextMenu">
            <div class="contextMenu__delete contextMenu__item" @click="handleDestroyChat">Удалить чат</div>
            <div class="contextMenu__update contextMenu__item" @click="handleUpdateChat">Изменить чат</div>
            <div class="contextMenu__updateBg contextMenu__item" @click="handleUpdateBg">Изменить задний фон</div>
        </div>
    </Teleport>
    <Teleport to="body">
        <Modal v-if="isUpdateModalOpen" @close="isUpdateModalOpen = false" title="Обновление чата">
            <Suspense>
                <UpdateChat @close="isUpdateModalOpen = false" :chatID="currentChatID"/>
                <template #fallback>
                    <Loader/>
                </template>
            </Suspense>
        </Modal>
    </Teleport>
    <Teleport to="body">
        <Modal v-if="isImageModalOpen" @close="isImageModalOpen = false" title="Обновление изображения">
            <Suspense>
                <UpdateImgChat @close="isImageModalOpen = false" :chatID="currentChatID"/>
                <template #fallback>
                    <Loader/>
                </template>
            </Suspense>
        </Modal>
    </Teleport>


</template>

<style scoped lang="scss">

    

    a {
        text-decoration: none;
    }
    .chatsBtn {
        display: flex;
        color: white;
        height: 60px;
        background-color: #181818;
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 10px;
        transition: all 0.3s ease;
        cursor: pointer;

        &__avatar {
            width: 40px;
            height: 40px;
            background-color: #e8eaed;
            border-radius: 50%;
            margin-right: 10px;
        }
        p  {
            font-weight: bolder;
            text-decoration: none;
        }
    }

    .chatsBtn:hover {
        background-color: #2e73a3;
    }

    .chatsBtn__active {
        background-color: #2e73a3;
    }

    .contextMenu {
        position: absolute;
        width: 200px;
        height: 200px;
        background-color: transparent;
        backdrop-filter: blur(10px);
        display: flex;
        z-index: 1000;
        flex-direction: column;

        &__item {
            padding: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: var(--color-text) 1px solid;
        }

        &__item:hover {
            background-color: #2e73a3;
        }
    }

    .chatsBtn img {
        width: 40px;
        height: 40px;
        background-color: #e8eaed;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
    }

</style>