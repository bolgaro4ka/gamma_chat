<script setup lang="ts">
import { socket } from "@/socket";
import { getMe, logout } from "@/common/jwt";
import { computed, onMounted, reactive, ref, type Reactive } from "vue";
import { reloadPage } from "@/common/app";
import { useRouter } from "vue-router";
import { state } from "@/socket";
import ChatsBtns from "./ChatsBtns.vue";
import UserEdit from "./UserEdit.vue";
import axios from "axios";

import CreateChat from "./CreateChat.vue";
import NoChatAvailable from "./NoChatAvailable.vue";
import Loader from "./Loader.vue";
import Modal from "./Modal.vue";

const isPopupOpen = ref(false);
const isUserEditOpen = ref(false);


const ame = await getMe();

const me = ref(ame);
const host = ref(axios.defaults.baseURL)
const isMobilePanelOpen = ref(true);

const user : Reactive<{ "id": number, "email": string, "username": string }> = reactive({"id": 0, "email": '', "username": ''});


const router = useRouter();


    async function getUser() : Promise<void> {

        const res = await getMe();

        user.email = res.email;
        user.username = res.username;
        user.id = res.id;

        console.log(user);
    }

const emits = defineEmits(['login']);

    

onMounted(
    async () => {await getUser();}
);

const connected = computed( 
    () => {
      return state.connected;
    }
);


function connect() {
    socket.connect();
}

function disconnect() {
    socket.disconnect();
}

if (localStorage.getItem('needReload') === 'true') {
    localStorage.removeItem('needReload');
    reloadPage(router);
}

</script>

<template>
    <div class="chatsPanel__open" @click="isMobilePanelOpen = !isMobilePanelOpen">
        <svg xmlns="http://www.w3.org/2000/svg" v-if="isMobilePanelOpen" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px"  v-else viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
    </div>
    <div class="chatsPanel" v-if="isMobilePanelOpen">
        <div class="chatsPanel__wrapper">
            <div class="chatsPanel__content">
                <div class="chatsPanel__userContent">
                    <div class="chatsPanel__avatar"><img :src="me?.avatar ? host+me?.avatar?.replace('.', '') : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"/></div>
                    <div class="chatsPanel__userInfo">
                        <div class="chatsPanel__user"><p>{{ user.username ? user.username : 'Не авторизирован' }}</p></div>
                        <div class="chatsPanel__email"><p>{{ user.email ? user.email : '' }}</p></div>
                        <div class="chatsPanel__id"><p>{{ user.id ? user.id : '' }}</p></div>
                    </div>
                    <div class="chatsPanel__btns">
                        <button class="chatsPanel__edit" @click="isUserEditOpen = true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                        <button @click="() => {logout(); reloadPage($router);}" class="chatsPanel__logout"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></button>
                    </div>
                </div>
                <div class="chatsPanel__indicatorContent">
                    <div class="chatsPanel__status">
                        <div :class="connected ? `chatsPanel__indicator indicator__green` : `chatsPanel__indicator indicator__red `"></div>
                        <div>
                            <button @click="connect" class="chatsPanel__connect"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg></button>
                            <button @click="disconnect" class="chatsPanel__disconnect"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg></button>
                        </div>
                    </div>
                </div>
                
                <h3>Список чатов</h3>
                <div class="chatsPanel__chats" v-if="user.id">
                    <Suspense>
                        <ChatsBtns @closeMobilePanel="isMobilePanelOpen = false"></ChatsBtns>

                        <template #fallback>
                            <Loader/>
                        </template>
                    </Suspense>
                </div>
                <div class="chatsPanel__chats" v-else>
                    <NoChatAvailable reason="Вы не авторизированы"></NoChatAvailable>
                </div>
                <div class="chatsPanel__createChat" @click="isPopupOpen = true" v-if="user.id">
                    Создать чат
                </div>
                <Teleport to="body">
                    <Modal v-if="isPopupOpen" @close="isPopupOpen = false" title="Создание чата">
                        <Suspense>
                            <CreateChat @close="isPopupOpen = false"/>
                            <template #fallback>
                                <Loader/>
                            </template>
                        </Suspense>
                    </Modal>
                </Teleport>
                <Teleport to="body">
                    <Modal v-if="isUserEditOpen" @close="isUserEditOpen = false" title="Редактирования пользователя">
                        <Suspense>
                            <UserEdit @close="isUserEditOpen = false"/>
                            <template #fallback>
                                <Loader/>
                            </template>
                        </Suspense>
                    </Modal>
                </Teleport>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

@media screen and (max-width: 800px) {

    .chatsPanel {
        width: 100vw !important;
        position: fixed;
        display: block;
        height: 100vh;
    }

    .chatsPanel__open {
        display: block !important;
        position: fixed;
        top: 20px;
        right: calc(50vw - 15px);
        width: 44px;
        height: 44px;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 2000px;
    }
    
}

.chatsPanel__open {
    display: none;
}

.chatsPanel {
    height: 100dvh;
    overflow-y: visible;
    overflow-x: hidden;
    background-color: #2a3038;
    padding: 20px;
    width: 330px;
    &__status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__userContent {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    p {
        color: var(--vt-c-white);
    }
}

.chatsPanel__wrapper,
.chatsPanel__content {
    height: 100%;
}

.chatsPanel__indicator {
    width: 10px;
    height: 10px;
    border-radius: 2000px;
}

.indicator__red {
    background-color: red;
}

.indicator__green {
    background-color: green;
}

.chatsPanel__logout, .chatsPanel__connect, .chatsPanel__disconnect, .chatsPanel__edit {
    background-color: transparent;
    border: none;
    color: var(--vt-c-white);
    cursor: pointer;
}

h3 {
    align-items: center;
    text-align: center;
    font-size: 20px;
}

.chatsPanel__chats {
    height: calc(100% - 200px);
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
}

.chatsPanel__createChat {
    width: 100%;
    height: 40px;
    background-color: #287a9b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    bottom: 0;
    left: 0;
}

.chatsPanel__btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.chatsPanel__avatar img {
    width: 50px;
    height: 50px;
    border-radius: 2000px;
    margin-right: 10px;

    object-fit: cover;
}

.chatsPanel__avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 50px;
    height: 50px;
}



</style>