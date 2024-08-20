<script setup lang="ts">
  import { ref, onMounted, onUnmounted, type Ref } from 'vue';
  
  const props : any = defineProps({
    title: {
      type: String,
    }
  });
  const emits : any = defineEmits(['close']);
  
  const md_content : Ref<null> | Ref<HTMLElement> = ref(null) as Ref<null> | Ref<HTMLElement>;
  const md_header : Ref<null> | Ref<HTMLElement> = ref(null) as Ref<null> | Ref<HTMLElement>;
  
  const pos : Ref<{ x: number, y: number, offsetX: number, offsetY: number, dragging: boolean }> = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0, dragging: false });
  
  const onDragStart = (e : MouseEvent) : void => {
    pos.value.dragging = true;
    pos.value.offsetX = e.offsetX;
    pos.value.offsetY = e.offsetY;
  };
  
  const onDrag = (e : MouseEvent) : void => {
    if (!pos.value.dragging) return;
    pos.value.x = e.clientX - pos.value.offsetX;
    pos.value.y = e.clientY - pos.value.offsetY;
    if (md_content.value) {
      (md_content.value as HTMLElement).style.left = `${pos.value.x}px`;
      (md_content.value as HTMLElement).style.top = `${pos.value.y}px`;
    }
  };
  
  const onDragEnd = () : void => {
    pos.value.dragging = false;
  };

  function handleClose (e : MouseEvent) {
    if (e.target === e.currentTarget) emits('close')
  }
  
  onMounted(() : void => {
    const header = md_header.value as HTMLElement;
    header.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
  });

  
  
  onUnmounted(() : void => {
    const header = md_header.value;
    if (header) {
        header.removeEventListener('mousedown', onDragStart);
    }
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDragEnd);
  });

  
  </script>



<template>
    <div class="modal" @click="handleClose">
      <div class="modal__content" ref="md_content">
        <div class="modal__header" ref="md_header">
          <h3>{{ props.title }}</h3>
          <div @click="() => emits('close')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </div>
        </div>
        <div @close="() => emits('close')">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  
<style scoped lang="scss">
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal__content {
        position: absolute;
        background: #287a9b;
        
        
      }
      .modal__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #2a3038;
        cursor: grab;
        resize: both;

        svg {
            cursor: pointer;
        }
      }
</style>