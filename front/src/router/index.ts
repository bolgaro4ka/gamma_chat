import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/NoChatView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/chat/:id',
      name: 'chatsID',
      component: () => import('../views/ChatView.vue')
    }
  ]
})

export default router
