<script setup lang="ts">
import { socket } from "@/socket";
import { getMe, logout } from "@/common/jwt";
import { computed, onMounted, reactive, ref, type Reactive } from "vue";
import { reloadPage } from "@/common/app";
import { useRouter } from "vue-router";
import { state } from "@/socket";

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

</script>

<template>
    <div class="chatsPanel">
        <div class="chatsPanel__wrapper">
            <div class="chatsPanel__content">
                <div class="chatsPanel__userContent">
                    <div class="chatsPanel__userInfo">
                        <div class="chatsPanel__user"><p>{{ user.username ? user.username : 'Не авторизирован' }}</p></div>
                        <div class="chatsPanel__email"><p>{{ user.email ? user.email : '' }}</p></div>
                        <div class="chatsPanel__id"><p>{{ user.id ? user.id : '' }}</p></div>
                    </div>
                    <button @click="() => {logout(); reloadPage($router);}" class="chatsPanel__logout"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></button>
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
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.chatsPanel {
    height: 100vh;
    overflow-y: visible;
    overflow-x: hidden;
    background-color: #2a3038;
    padding: 20px;
    width: 400px;
    &__status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__userContent {
        display: flex;
        justify-content: space-between;
    }

    p {
        color: var(--vt-c-white);
    }
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

.chatsPanel__logout, .chatsPanel__connect, .chatsPanel__disconnect {
    background-color: transparent;
    border: none;
    color: var(--vt-c-white);
    cursor: pointer;
}



</style>