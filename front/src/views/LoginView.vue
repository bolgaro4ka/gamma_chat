<script setup lang="ts">

import { redirect, reloadPage } from '@/common/app';
import axios from 'axios';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const password = ref('');
const email = ref('');

const error = ref('')

const router = useRouter()


function login(e : Event) {
    e.preventDefault();
    axios.post('http://127.0.0.1:3000/auth/login', {
        email: email.value,
        password: password.value
    }).then((response) => {
        console.log(response);  
        localStorage.setItem('token', 'Bearer ' + response.data.token);
        redirect(router, '/');
        return response.data

    }).catch((e) => {
        error.value = 'Неверные данные'
    })
}



</script>

<template>
    
        <form @submit.prevent="login">
            <div class="form">
                <label for="email" >Email</label>
                <input type="email" id="email" name="email" v-model="email">
                <label for="password" >Пароль</label>
                <input type="password" id="password" name="password" v-model="password">
                <button type="submit">Войти</button>
                <p v-if="error" class="error">{{ error }}</p>
            </div>
        </form>
    
   
</template>

<style scoped lang="scss">
.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    width: 500px;
    border: 10px solid;
    border-image-slice: 1;
    border-width: 5px;
    border-image-source: var(--tg-gradient)
}
form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    height: 100%;


    label {
        color: var(--vt-c-white);
    }

    input {
        width: 40%;
        height: 30px;
        border-radius: 20px;
        border: none;
        padding: 10px;
        background-color: #2a3038;
        color: white;
    }

    input:hover, input:focus, input:active {
        outline: none;
    }

    button {
        background-image: var(--tg-gradient);
        color: white;
        border: none;
        width: 40%;
        height: 30px;
        border-radius: 20px
    }
}

.error {
    color: red;
    text-align: center;
    font-weight: bolder;
}
</style>