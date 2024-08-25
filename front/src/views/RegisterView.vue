<script setup lang="ts">

import { reloadPage } from '@/common/app';
import axios from 'axios';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const email = ref('');
const first_name = ref('');
const last_name = ref('');

const error = ref('')

const router = useRouter()


function login(e : Event) {
    e.preventDefault();

    error.value = '';
    const regexp_no_special = /^[a-zA-Z0-9]+$/;
    if (!username.value || !password.value || !email.value || !first_name.value || !last_name.value) error.value += 'Все поля должны быть заполнены <br/> '
    if (username.value.length <= 1 || password.value.length  <= 1 || email.value.length  <= 1 || first_name.value.length  <= 1 || last_name.value.length  <= 1) error.value += 'Какое-то/Какие-то поле (-я) содержит (-ат) меньше или равно 1 знака<br/>'
    if (username.value.length >= 15) error.value += 'Логин должен содержать не более 15 символов<br/>'
    if (first_name.value.length >= 15) error.value += 'Имя должно содержать не более 15 символов<br/>'
    if (last_name.value.length >= 15) error.value += 'Фамилия должна содержать не более 15 символов<br/>'
    if (regexp_no_special.test(username.value) === false) error.value += 'Логин должен содержать только буквы и цифры<br/>'
    if (password.value.length <= 8) error.value += 'Пароль должен содержать не менее 8 символов<br/>'
    if (/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()]{6,}/g .test(password.value) === false) error.value += 'Пароль должен содержать не менее 1 цифры, 1 прописной буквы, 1 строчной буквы и 1 специальный символ<br/>'

    if (error.value) {
        return
    }

    console.log(username.value, password.value);
    axios.post('/auth/reg', {
        username: username.value,
        email: email.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value
    }).then((response) => {
        console.log(response);  
        localStorage.setItem('token', 'Bearer ' + response.data.token);
        router.push('/');
        return response.data

    }).catch((error) => {
        console.log(error);
    })
}



</script>

<template>
    <form @submit.prevent="login">
        <div class="form">
            <label for="username" >Ник</label>
            <input type="text" id="username" name="username" v-model="username">
            <label for="email" >Email</label>
            <input type="email" id="email" name="email" v-model="email">
            <label for="password" >Пароль</label>
            <input type="password" id="password" name="password" v-model="password">
            <label for="first_name" >Имя</label>
            <input type="text" id="first_name" name="first_name" v-model="first_name">
            <label for="last_name" >Фамилия</label>
            <input type="text" id="last_name" name="last_name" v-model="last_name">
            <button type="submit">Регистрация</button>
            <p v-if="error" class="error" :innerHTML="error" ></p>
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
    max-width: 400px;
    font-weight: bolder;
}
</style>