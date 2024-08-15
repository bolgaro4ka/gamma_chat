import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

app.use(router)

app.mount('#app')
