<script setup lang="ts">
import SendForm from '@/components/SendForm.vue'
import Message from '@/components/Message.vue'
import axios from 'axios'
import io from 'socket.io-client'
import { ref, watch } from 'vue'
import { getMe } from '@/common/jwt'
import { scrollToBottomOfChat } from '@/common/app'
import { useRoute } from 'vue-router'


const socket = io('http://127.0.0.1:3000')

const route = useRoute()

const msgInput = ref(null)
const messages: any = ref([])
const me: any = await getMe()

watch(
    () => route.params.id,
    (newID, oldID) => {
        getMessages()
    }
)

const getMessages = async () => {
    messages.value = []
    try {
        const { data } = await axios.get('http://127.0.0.1:3000/api/chat/' + route.params.id, {
        })
        console.log(data)
        data.forEach(item => {
            messages.value.push(item)
        });
    } catch (error) {
        console.log(error)
    }

}

getMessages()



socket.on('recMessage', (msgu) => {
    if (msgu.chatId != route.params.id) return
    messages.value.push(msgu);
    console.log('btm')
    scrollToBottomOfChat()

})





</script>

<template>
    <div class="chat__container">
        <div class="chat">
            <div class="messages">
                <Message v-for="message in messages" :key="message.id"
                    :class="message.username == me.username ? 'message-right' : 'message-left'">
                    <template #username>
                        {{ message.username }}
                    </template>

                    <template #time>
                        {{ new Date(message.createdAt).toLocaleString('ru', {
                            year: 'numeric', month: 'numeric', day:
                                'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})}}
                    </template>

                    <template #message>
                        {{ message.text }}
                    </template>
                </Message>
            </div>
        </div>
        

    </div>
    <SendForm />
</template>

<style scoped lang="scss">
.chat__container {
    height: calc(100vh - 70px);
    overflow-y: auto;
}

.chat {
    margin: 0 auto;
    width: 100%;
    
   
    padding: 5px;
   

}

.messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>