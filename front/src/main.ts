import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'





const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://gamma-api.paia1nik.ru'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')


app.use(router)

app.mount('#app')
