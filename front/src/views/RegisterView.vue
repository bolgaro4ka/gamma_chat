<script setup lang="ts">

import { reloadPage } from '@/common/app';
import axios from 'axios';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const email = ref('');
const name = ref('');

const error = ref('')

const router = useRouter()


function login(e : Event) {
    e.preventDefault();

    error.value = '';
    const regexp_no_special = /^[a-zA-Z0-9]+$/;
    if (!username.value || !password.value || !email.value || !name.value.split(' ')[0] || !name.value.split(' ')[1]) error.value += 'Все поля должны быть заполнены <br/> '
    if (username.value.length <= 1 || password.value.length  <= 1 || email.value.length  <= 1 || name.value.split(' ')[0].length  <= 1 || name.value.split(' ')[1].length  <= 1) error.value += 'Какое-то/Какие-то поле (-я) содержит (-ат) меньше или равно 1 знака<br/>'
    if (username.value.length >= 15) error.value += 'Логин должен содержать не более 15 символов<br/>'
    if (name.value.split(' ').length != 2) error.value += 'Имя должно содержать ровно 2 слова<br/>' 
    if (name.value.split(' ')[0].length >= 15) error.value += 'Имя должно содержать не более 15 символов<br/>'
    if (name.value.split(' ')[1].length >= 15) error.value += 'Фамилия должна содержать не более 15 символов<br/>'
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
        first_name: name.value.split(' ')[0],
        last_name: name.value.split(' ')[1]
    }).then((response) => {
        if (response.data.response.message === "User with this email found") {
            error.value = 'Пользователь с таким email уже зарегистрирован';
            return
        }
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
<div class="register-bg">
  <form @submit.prevent="login" class="register-form">
    <div class="form">
      <h2 class="form-title">Регистрация в Gamma Chat</h2>
      <label for="username">Ник</label>
      <input type="text" id="username" name="username" v-model="username" placeholder="Введите ник">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" v-model="email" placeholder="Введите email">
      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" v-model="password" placeholder="Введите пароль">
      <label for="first_name">Имя</label>
      <input type="text" id="first_name" name="first_name" v-model="name" placeholder="Введите фамилию и имя">
      <button type="submit" class="register-btn">Зарегистрироваться</button>
      <transition name="fade">
        <RouterLink to="/login" class="btn_login">
          <span class="login-text">Уже есть аккаунт?</span>
        </RouterLink>
      </transition>
      <p v-if="error" class="error" :innerHTML="error"></p>
    </div>
  </form>
</div>
</template>

<style scoped lang="scss">

.register-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  overflow: auto;
}

.register-form {
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(34, 40, 49, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 32px 24px 24px 24px;
  border: 2px solid transparent;
  border-image: var(--tg-gradient) 1;
  animation: fadeIn 0.8s;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.form-title {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

label {
  color: #bfc9d1;
  font-size: 1rem;
  align-self: flex-start;
  margin-left: 8px;
}

input {
  width: 100%;
  height: 40px;
  border-radius: 16px;
  border: none;
  padding: 0 16px;
  background: #23272f;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6a82fb;
}

.register-btn {
  background-image: var(--tg-gradient);
  color: white;
  border: none;
  width: 60%;
  height: 40px;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}
.register-btn:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(106,130,251,0.18);
}

.btn_login {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 32px;
  border-radius: 16px;
  background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border: none;
  box-shadow: 0 2px 8px rgba(106,130,251,0.12);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.3s, transform 0.2s;
}
.btn_login:hover {
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  transform: scale(1.05);
}
.login-text {
  position: relative;
  z-index: 2;
}

.error {
  color: #fc5c7d;
  text-align: center;
  font-weight: bolder;
  margin-top: 8px;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>