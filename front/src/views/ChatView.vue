<script setup lang="ts">
import Chat from '@/components/Chat.vue'
import Loader from '@/components/Loader.vue';


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