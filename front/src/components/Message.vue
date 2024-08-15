<script setup lang="ts">
</script>

<template>

    <div class="message" v-bind="$attrs">
        <p class="username"><slot name="username"></slot></p>
        <p class="text"><slot name="message"></slot></p>
        <p class="time"><slot name="time"></slot></p>
    </div>

</template>

<style scoped lang="scss">
    .message {
        width: 500px;
        background-color: #2a3038;
        color: white;
        border-radius: 20px 20px 20px 0px;
        padding: 9px;

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
        background-color: #287a9b;
        border-radius: 20px 20px 0px 20px;

        .username {
            display: none;
        }
    }

    .message-left {
        text-align: left;
    }


</style>