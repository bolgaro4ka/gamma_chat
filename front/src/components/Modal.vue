<script setup lang="ts">


const emits = defineEmits(['close']);

const props = defineProps({
    title: String
})
</script>

<template>
    <div class="modal">
        <div class="modal__content">
            <div class="modal__header">
                <h3>{{ props.title }}</h3>
                <div @click="() => emits('close')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
            </div>
            <slot></slot>
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
        background: #2a3038;
        padding: 20px;
        min-height: 200px;
        min-width: 400px;
        border-radius: 10px;
    }

    .modal__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #287a9b;
    }
</style>