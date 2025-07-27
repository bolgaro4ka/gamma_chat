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
const isMobileView = ref(window.innerWidth < 768);

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
    <div class="chatsPanel-glass-bg" />
    <div class="chatsPanel" v-if="isMobilePanelOpen">
        <div class="chatsPanel__wrapper">
            <div class="chatsPanel__content">
                <div class="chatsPanel__userContent">
                    <div class="chatsPanel__avatar"><img :src="me?.avatar ? host+me?.avatar?.replace('.', '') : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"/></div>
                    <div class="chatsPanel__userInfo">
                        <div class="chatsPanel__user"><p>{{ user.username ? user.username : 'Не авторизирован' }}</p></div>
                        
                        <div class="chatsPanel__id"><p>{{ user.id ? user.id : '' }}</p></div>
                    </div>
                </div>
                <div class="chatsPanel__btns">
                    <button class="chatsPanel__edit" @click="isUserEditOpen = true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                    <button @click="() => {logout(); reloadPage($router);}" class="chatsPanel__logout"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></button>
                </div>
                <div class="chatsPanel__indicatorContent">
                    <div class="chatsPanel__status">
                        <div :class="connected ? `chatsPanel__indicator indicator__green` : `chatsPanel__indicator indicator__red `"></div>
                        <p>{{ connected ? 'В сети' : 'Не в сети' }}</p>
                        <div class="chatsPanel__indicators">
                            <button @click="connect" class="chatsPanel__connect"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg></button>
                            <button @click="disconnect" class="chatsPanel__disconnect"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg></button>
                        </div>
                    </div>
                </div>
                
                <h3>Список чатов</h3>
                <div class="chatsPanel__chats" v-if="user.id">
                    <Suspense>
                        <ChatsBtns @closeMobilePanel="isMobileView ?   isMobilePanelOpen = false : isMobilePanelOpen = true"></ChatsBtns>

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



.chatsPanel-glass-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: none;
  overflow: hidden;
  border-radius: 32px 0 0 32px;
}

.chatsPanel-glass-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #6a82fb 0%, #fc5c7d 100%);
  filter: blur(32px) brightness(1.2);
  opacity: 0.7;
  z-index: 1;
  animation: glassGradientMove 8s infinite alternate ease-in-out;
  mask-image: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.7) 60px, transparent 400px),
    radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 80px, transparent 400px);
  border-radius: 32px 0 0 32px;
}

@keyframes glassGradientMove {
  0% {
    background-position: 0% 50%;
    mask-position: 30% 40%, 70% 60%;
  }
  50% {
    background-position: 100% 50%;
    mask-position: 50% 60%, 60% 40%;
  }
  100% {
    background-position: 0% 50%;
    mask-position: 30% 40%, 70% 60%;
  }
}

@media screen and (max-width: 800px) {

    .chatsPanel {
        width: 100vw !important;
        position: fixed;
        display: block;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: hidden;
        z-index: 2;
        backdrop-filter: blur(18px) saturate(1.2);
        background: rgba(34, 40, 49, 0.65);
    }

    .chatsPanel__open {
        display: block !important;
        position: fixed;
        top: 20px;
        right: calc(50vw - 15px);
        width: 44px;
        height: 44px;
        z-index: 3;
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
    max-height: 100dvh;
    overflow-y: hidden;
    overflow-x: hidden;
    background: rgba(34, 40, 49, 0.65);
    padding: 20px;
    width: 330px;
    position: relative;
    z-index: 2;
    border-radius: 32px 0 0 32px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(18px) saturate(1.2);
    border: 1.5px solid rgba(255,255,255,0.08);
    &__status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__indicators {
        display: flex;
        gap: 10px;
    }

    &__userContent {
        display: flex;
        align-items: center;
        gap: 18px;
        background: rgba(255,255,255,0.04);
        border-radius: 18px;
        padding: 16px 12px;
        margin-bottom: 10px;
        box-shadow: 0 2px 12px 0 rgba(31,38,135,0.08);
    }

    &__avatar img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 0;
        object-fit: cover;
        border: 2px solid #6a82fb;
        box-shadow: 0 2px 8px rgba(106,130,251,0.12);
    }

    &__userInfo {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__user {
        font-size: 1.1rem;
        font-weight: 600;
        color: #fff;
        letter-spacing: 0.5px;
    }

    &__id {
        font-size: 0.9rem;
        color: #bfc9d1;
    }

    &__btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin-left: auto;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        padding: 6px 10px;
        margin-bottom: 10px;
        box-shadow: 0 2px 8px rgba(31, 38, 135, 0.06);

        button {
            width: 100%;
        }
    }

    &__edit, &__logout {
        background: rgba(255,255,255,0.08);
        border: none;
        color: #fff;
        border-radius: 12px;
        padding: 6px 10px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(31,38,135,0.08);
    }
    &__edit:hover {
        background: #6a82fb;
        box-shadow: 0 4px 16px rgba(106,130,251,0.18);
    }
    &__logout:hover {
        background: #fc5c7d;
        box-shadow: 0 4px 16px rgba(252,92,125,0.18);
    }

    &__indicatorContent {
        margin-bottom: 18px;
    }
    &__status {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255,255,255,0.04);
        border-radius: 12px;
        padding: 8px 12px;
        box-shadow: 0 2px 8px rgba(31,38,135,0.06);
    }
    &__indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 4px;
    }
    .indicator__red {
        background-color: #fc5c7d;
    }
    .indicator__green {
        background-color: #6a82fb;
    }
    &__statusBtns {
        display: flex;
        gap: 6px;
    }
    &__connect, &__disconnect {
        background: rgba(255,255,255,0.08);
        border: none;
        border-radius: 10px;
        padding: 4px 8px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(31,38,135,0.08);
    }
    &__connect:hover {
        background: #6a82fb;
        box-shadow: 0 4px 16px rgba(106,130,251,0.18);
    }
    &__disconnect:hover {
        background: #fc5c7d;
        box-shadow: 0 4px 16px rgba(252,92,125,0.18);
    }

    &__title {
        align-items: center;
        text-align: center;
        font-size: 1.3rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
    }

    &__chats {
    flex: 1 1 auto;
    min-height: 0;
    max-height: 45vh;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    background: rgba(255,255,255,0.03);
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(31,38,135,0.04);
    padding: 8px 0;
    }

    &__createChat {
        width: 100%;
        height: 44px;
        background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        bottom: 0;
        left: 0;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 14px;
        margin-top: 16px;
        box-shadow: 0 2px 8px rgba(106,130,251,0.10);
        transition: background 0.2s, box-shadow 0.2s;
        gap: 8px;
    }
    &__createChat:hover {
        background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
        box-shadow: 0 4px 16px rgba(252,92,125,0.18);
    }
    &__createChatIcon {
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: 4px;
    }
}

.chatsPanel__wrapper,
.chatsPanel__content {
    height: 100%;
}




</style>