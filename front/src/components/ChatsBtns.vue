<script setup lang="ts">
import { getMe } from '@/common/jwt';
import { onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';


const me = await getMe();

const chats = await axios.get('/api/my/chats')

</script>

<template>
    <RouterLink v-for="chat in chats.data" :key="chat.id" :to="`/chat/${chat.id}`">
        <div class="chatsBtn">
            <div class="chatsBtn__avatar">

            </div>
            <p>{{ chat.name }}</p>
        </div>
    </RouterLink>

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

</style>