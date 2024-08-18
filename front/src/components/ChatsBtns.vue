<script setup lang="ts">
import { getMe } from '@/common/jwt';
import { onMounted, type Ref } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import NoChatAvailable from './NoChatAvailable.vue';
import { ref } from 'vue';
import { reloadPage } from '@/common/app';
import { useRouter } from 'vue-router';


const me = await getMe();
const router = useRouter();

const chats = await axios.get('/api/my/chats')

const isContextMenuOpen = ref(false)

const contextMenu : Ref<null> | Ref<HTMLElement> = ref(null)

const currentChatID : Ref<null> | Ref<string> = ref(null)


function handleContextMenu(e : MouseEvent) {
    e.preventDefault();
    const x =  e.clientX;
    const y =  e.clientY;

    const currentTarget = e.currentTarget as HTMLElement;
    const chatID = currentTarget.getAttribute('chatId');


    currentChatID.value = chatID

    console.log(chatID)

    console.log(x, y)

    isContextMenuOpen.value = !isContextMenuOpen.value;


    (contextMenu.value as HTMLElement).style.left = `${x}px`;
    (contextMenu.value as HTMLElement).style.top = `${y}px`;

}

function handleDestroyChat(e : MouseEvent) {
    e.preventDefault();

    const chatID = currentChatID.value;
    axios.delete(`/api/chat/${chatID}`)

    isContextMenuOpen.value = false

    reloadPage(router)

    
}

document.getElementsByTagName('main')[0].addEventListener('closeContextsMenu', () => {
    isContextMenuOpen.value = false
})

</script>

<template>
    <RouterLink v-for="chat in chats.data" :key="chat.id" :to="`/chat/${chat.id}`" v-if="chats">
        <div class="chatsBtn" @contextmenu="handleContextMenu" :chatId="chat.id">
            <div class="chatsBtn__avatar">

            </div>
            <p>{{ chat.name }}</p>
        </div>
    </RouterLink>
    <NoChatAvailable v-else/>
    <Teleport to="body">
        <div class="contextMenu" v-show="isContextMenuOpen" ref="contextMenu">
            <div class="contextMenu__delete contextMenu__item" @click="handleDestroyChat">Удалить чат</div>
        </div>
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

</style>