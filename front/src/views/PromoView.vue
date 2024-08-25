<script setup lang="ts">
import gsap from 'gsap';
import { onMounted } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
    
})



</script>

<template>
    <div class="promo" style=" overflow-y: visible">
        <section class="horizontal">
            <div class="horizontal__block bg-gsap">
                <h2>Он умеет многое</h2>
            </div>
            <div class="horizontal__block  bg-red">
                <h2>Даже горизонтальную прокрутку</h2>
            </div>
            <div class="horizontal__block  bg-blue">
                <h2>А ещё...</h2>
            </div>
        </section>
    </div>

</template>

<style scoped lang="scss">
@mixin fullHeight {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.horizontal {
    display: flex;
    width: 300vw;
    overflow-x: hidden;
    &__block {
        @include fullHeight;
        width: calc(100vw - 400px);
    }
}

.bg {
    &-red {
        background-color: red;
    }
    &-blue {
        background-color: blue;
    }
    &-gsap {
        background-color: rgb(103, 203, 2);
    }
}
</style>