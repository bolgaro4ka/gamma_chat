<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { isAuthOrRedirectToLogin, reloadPage } from './common/app';
import ChatsPanel from './components/ChatsPanel.vue';

const router = useRouter()




isAuthOrRedirectToLogin(router);
</script>

<template>
  <main>
    <ChatsPanel />
    <div class="content"><RouterView /></div>
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
