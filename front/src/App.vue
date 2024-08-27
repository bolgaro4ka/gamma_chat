<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { isAuthOrRedirectToLogin, reloadPage, redirect } from './common/app';
import ChatsPanel from './components/ChatsPanel.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { watch } from 'vue';
import Loader from './components/Loader.vue';
import IApp from './components/IApp.vue';

const router = useRouter()

const key = ref(0)

const emits = defineEmits(['closeContextsMenu']);


const handleLogin = () => {
  key.value += 1
  localStorage.setItem('needReload', 'true');
  redirect(router, '/');
}

const handleUpdateThePanel = () => {
  key.value += 1
}

const handleGlobalClick = (e : Event) => {
  e.currentTarget?.dispatchEvent(new Event('closeContextsMenu', {bubbles: true, cancelable: true, composed: true}));
}

document.addEventListener('updateThePanel', handleUpdateThePanel);







isAuthOrRedirectToLogin(router);
</script>

<template>
  <main @click="handleGlobalClick">
     <IApp v-if="false"/> 
    <Suspense><ChatsPanel :key="key"/><template #fallback><Loader/></template></Suspense>
    <Suspense>
      <div class="content"><RouterView @login="handleLogin " class="content" /></div>
      <template #fallback>
        <Loader/>
      </template>
    </Suspense>
  </main>
  
</template>

<style scoped>
main {
  display: flex;
  height: 100dvh;
  overflow: hidden;
}

.content {
  width: 100%;
  height: 100dvh;
  overflow-x: hidden;
}

</style>
