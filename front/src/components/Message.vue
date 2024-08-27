<script setup lang="ts">

import { ref } from 'vue';

const props= defineProps(['src', 'pos', 'userId', 'file'])

const emits = defineEmits(['openMenu']);

const isValidImg = ref(props.src.includes('undefined') ? false : true)


</script>

<template>

    <div class="message" v-bind="$attrs" :userId="$props.userId">
        <img class="avatar" 
            :src="isValidImg ? props.src : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
            v-if="$props.pos == 'left'" 
            @contextmenu="$emit('openMenu', $event)" 
            :userId="$props.userId"
        >
        <div class="message-body">
            <div v-if="$props.file">
                <div :class="`file ${props.pos}`">
                    <a :href="props.file" download target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
                    </a>
                </div>
            </div>
            <div class="message-text">
                <p class="username"><slot name="username"></slot></p>
                <p class="text"><slot name="message"></slot></p>
                <p class="time"><slot name="time"></slot></p>
            </div>
        </div>
        <img class="avatar" 
            :src="isValidImg ? props.src : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
            v-if="$props.pos == 'right'" 
            @contextmenu="$emit('openMenu', $event)" 
            :userId="$props.userId"
        >
    </div>

</template>

<style scoped lang="scss">
@media screen and (max-width: 800px) {

    .message {
        width: 90%;

        * {
            font-size: 12px;
            word-break: break-all;
        }
    }
    
}

    .message {
        display: flex;
        gap: 10px;
        align-items: end;

        .file {
            width: 40px;
            height: 40px;
            background-color: #2a3038;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2000px;

            svg {
                margin-top: 4px;
            }
        }

        .left {
            background-color: #287a9b;
        }

        .right {
            background-color: #2a3038;
        }

        img {
            width: 40px;
            height: 40px;
            border-radius: 2000px;
            

            object-fit: cover;
        }

        .message-body {
            width: 500px;
            height: auto;
            display: flex;
            align-items: center;
            gap: 10px;
            background-color: #2a3038;
            color: white;
            border-radius: 20px 20px 20px 0px;
            padding: 9px;
        }

        .message-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            gap: 5px;

            .time {
                padding-right: 5px;
                font-size: 10px;
                width: 100%;
                text-align: end;
            }
        }

        .text {
            word-break: break-word;
            width: 480px;
        }

        .username {
            color: #85de85;
            font-weight: bold;
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