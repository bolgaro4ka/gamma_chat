import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import { BASE_URL, BASE_URL_API } from './common/config'





const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = BASE_URL_API
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')


app.use(router)

app.mount('#app')
