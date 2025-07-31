<script setup lang="ts">

import { redirect, reloadPage } from '@/common/app';
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const password = ref('');
const email = ref('');

const error = ref('')

const router = useRouter()

const emit = defineEmits(['login'])


function login(e : Event) {
    e.preventDefault();

    error.value = ''

    if (!email.value || !password.value) error.value += 'Заполните все поля <br/>'
    if (email.value.length <= 1 || password.value.length <= 1) error.value += 'Какое-то/Какие-то поле (-я) содержит (-ат) меньше или равно 1 знака<br/>'
    if (!email.value.includes('@')) error.value += 'Email должен содержать @<br/>'

    if (error.value) return


    axios.post('/auth/login', {
        email: email.value,
        password: password.value
    }).then((response) => {
        if (response.status !== 200 && response.status !== 201) {
            error.value = 'Неверные данные'
            return
        }
        console.log(response);  
        localStorage.setItem('token', 'Bearer ' + response.data.token);
        emit('login')
        redirect(router, '/');
        return response.data

    }).catch((e) => {
        error.value = 'Неверные данные'
    })
}



</script>

<template>
    
<div class="login-bg">
  <form @submit.prevent="login" class="login-form">
    <div class="form">
      <h2 class="form-title">Вход в Gamma Chat</h2>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" v-model="email" placeholder="Введите email">
      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" v-model="password" placeholder="Введите пароль">
      <button type="submit" class="login-btn">Войти</button>
      <transition name="fade">
        <RouterLink to="/reg" class="btn_reg">
          <span class="reg-text">Регистрация</span>
        </RouterLink>
      </transition>
      <p v-if="error" class="error" :innerHTML="error"></p>
    </div>
  </form>
</div>
    
   
</template>

<style scoped lang="scss">

.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
}

.login-form {
  width: 100%;
  max-width: 400px;
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

.login-btn {
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
.login-btn:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(106,130,251,0.18);
}

.btn_reg {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 32px;
  border-radius: 16px;
  background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border: none;
  box-shadow: 0 2px 8px rgba(252,92,125,0.12);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.3s, transform 0.2s;
}
.btn_reg:hover {
  background: linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%);
  transform: scale(1.05);
}
.reg-text {
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