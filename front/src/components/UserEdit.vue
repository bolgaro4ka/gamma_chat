<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { getMe } from '@/common/jwt';
import axios from 'axios';
import { socket } from '@/socket';
import { notifyMe } from '@/common/notifications';

const me = await getMe();

const avatarFile = ref<File | null>(null);
const nameInput : Ref<null> | Ref<HTMLInputElement> = ref(me.first_name ? me.first_name : null)
const lastInput : Ref<null> | Ref<HTMLInputElement> = ref(me.last_name ? me.last_name : null)
const usernameInput : Ref<null> | Ref<HTMLInputElement> = ref(me.username ? me.username : null)

const emits = defineEmits(['close']);




async function handleCreate (e : Event) {
    e.preventDefault();

    let avatarBase64 = null;

    if (avatarFile.value) {
        avatarBase64 = await fileToBase64(avatarFile.value);
    }

    socket.emit('updateUser', {
        first_name: nameInput.value ? (document.getElementById('name') as HTMLInputElement).value : null,
        userId: me.id,
        last_name: lastInput.value ? (document.getElementById('lastInput') as HTMLInputElement).value : null,
        username: usernameInput.value ? (document.getElementById('usernameInput') as HTMLInputElement).value : null,
        avatar: avatarBase64
    });

    emits('close');
}

function handleLoadFile (e : Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        avatarFile.value = input.files[0];
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
</script>

<template>
    <div class="updateUser" >
        <form>
            <input type="text" placeholder="Имя" id="name" v-model="nameInput" autocomplete="on">
            <input type="text" placeholder="Фамилия" id="lastInput" v-model="lastInput">
            <div style="display: flex; align-items: center; gap: 5px;"><p class="dog">@</p><input type="text" placeholder="Юзернейм" v-model="usernameInput" id="usernameInput" autocomplete="on"></div>
            <input type="file" @change="handleLoadFile" accept="image/*"/>
            <button type="submit" value="Create" @click="handleCreate">Применить</button>
        </form>
    </div>
</template>


<style scoped lang="scss">  
.updateUser {
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        margin-top: 10px;
        padding: 10px;
        background-color: #2a3038;

        .dog {
            color: #2e73a3;
            font-size: x-large;
            font-weight: bold;
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