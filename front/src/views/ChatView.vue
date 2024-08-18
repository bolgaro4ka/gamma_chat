<script setup lang="ts">
import { getMe } from '@/common/jwt';
import Chat from '@/components/Chat.vue'
import Loader from '@/components/Loader.vue';
import axios from 'axios';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '@/socket';
import { redirect } from '@/common/app';
import { useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()


const my_chats = await axios.get('/api/my/chats')
const ids : number[] = []
for (let chat of my_chats.data) {
  ids.push(chat['id'])
}

console.log(ids)

if (!ids.includes(Number(route.params.id))) {
  redirect(router, '/')
}




</script>
<template>
  <div class="wrapperMainView">
  <Suspense >
    <Chat/>
    <template #fallback>
      <Loader/>
    </template>
  </Suspense>
</div>
</template>


<style scoped>
.wrapperMainView {
  height: 100%;
  
}

</style>