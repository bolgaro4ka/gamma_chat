<script setup lang="ts">
import { ref, onMounted } from 'vue';

const deferredPrompt = ref<Event | null>(null);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
  });
});

const installApp = () => {
  if (deferredPrompt.value) {
    (deferredPrompt.value as any).prompt();
    (deferredPrompt.value as any).userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Пользователь установил приложение');
      } else {
        console.log('Пользователь отказался от установки');
      }
      deferredPrompt.value = null;
    });
  }
};
</script>



<template>
    <div v-if="deferredPrompt" class="install-prompt">
      <button @click="installApp">Установить веб-приложение</button>
    </div>
  </template>
  
 
  
  
  <style>
  .install-prompt {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    z-index: 9999;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>