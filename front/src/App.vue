<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { isAuthOrRedirectToLogin, reloadPage, redirect } from './common/app';
import ChatsPanel from './components/ChatsPanel.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';

const router = useRouter()

const key = ref(0)

const emits = defineEmits(['closeContextsMenu']);


const handleLogin = () => {
  key.value += 1
  localStorage.setItem('needReload', 'true');
  redirect(router, '/');
}

const handleGlobalClick = (e : Event) => {
  e.currentTarget?.dispatchEvent(new Event('closeContextsMenu', {bubbles: true, cancelable: true, composed: true}));
}




isAuthOrRedirectToLogin(router);
</script>

<template>
  <main @click="handleGlobalClick">
    <ChatsPanel :key="key"/>
    <div class="content" ><RouterView @login="handleLogin " /></div>
  </main>
  
</template>

<style scoped>
main {
  display: flex;
}

.content {
  width: 100%;
}

</style>
