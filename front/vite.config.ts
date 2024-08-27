import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    manifest: {
      name: 'Gamma Chat',
      short_name: 'Gamma',
      description: 'Chat for chatting',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#3f51b5',
      icons: [
        {
          src: '/src/assets/icons/192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/src/assets/icons/512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      // настройки workbox, если необходимо
    }
  })],
  
  server: {
    host: '0.0.0.0',
    port: 5000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
