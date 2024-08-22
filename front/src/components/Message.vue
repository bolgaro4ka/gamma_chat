<script setup lang="ts">

import { ref } from 'vue';

const props= defineProps(['src', 'pos'])

const isValidImg = ref(props.src.includes('undefined') ? false : true)


</script>

<template>

    <div class="message" v-bind="$attrs">
        <img class="avatar" :src="isValidImg ? props.src : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" v-if="$props.pos == 'left'" >
        <div class="message-body">
            <p class="username"><slot name="username"></slot></p>
            <p class="text"><slot name="message"></slot></p>
            <p class="time"><slot name="time"></slot></p>
        </div>
        <img class="avatar" :src="props.src" v-if="$props.pos == 'right'">
    </div>

</template>

<style scoped lang="scss">
    .message {
        display: flex;
        gap: 10px;
        align-items: end;

        img {
            width: 40px;
            height: 40px;
            border-radius: 2000px;
            

            object-fit: cover;
        }

        .message-body {
            width: 500px;
            background-color: #2a3038;
            color: white;
            border-radius: 20px 20px 20px 0px;
            padding: 9px;
        }

        .username {
            color: #85de85;
            font-weight: bold;
        }

        .time {
            position: relative;
            float: right;
            margin-top: 2px;
            margin-right: 5px;
            font-size: 10px;
        }
    }

    .message-right {
        align-self: flex-end;
        .message-body{background-color: #287a9b; border-radius: 20px 20px 0px 20px;};
        

        .username {
            display: none;
        }
    }

    .message-left {
        text-align: left;
    }


</style>