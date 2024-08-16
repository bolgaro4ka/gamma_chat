<script setup lang="ts">
import Chat from '@/components/Chat.vue'


</script>
<template>
  <div class="wrapperMainView">
  <Suspense >
    <Chat/>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</div>
</template>


<style scoped>
.wrapperMainView {
  height: 100%;
  
}

</style>