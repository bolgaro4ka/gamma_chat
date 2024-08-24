<script setup lang="ts">
import SendForm from '@/components/SendForm.vue'
import Message from '@/components/Message.vue'
import axios from 'axios'
import { onMounted, onUpdated, ref, watch, type Ref } from 'vue'
import { getMe } from '@/common/jwt'
import { scrollToBottomOfChat } from '@/common/app'
import { useRoute } from 'vue-router'
import { socket } from '@/socket';
import { notifyMe } from '@/common/notifications';


const route = useRoute()

const msgInput = ref(null)
const messages: any = ref([])
const me: any = await getMe()
const chatEl = ref(null)

const chatElem : Ref<null> | Ref<HTMLElement> = ref(null)

const host = ref(axios.defaults.baseURL)

watch(
    () => route.params.id,
    async (newID, oldID) => {
        getMessages()
        
    }
)

const getMessages = async () => {
    messages.value = []
    try {
        const { data } = await axios.get('http://127.0.0.1:3000/api/chat/' + route.params.id, {
        })
        console.log(data)
        data.forEach((item : any) => {
            messages.value.push(item)
        });
    } catch (error) {
        console.log(error)
    }

}

getMessages()
onUpdated(async () => {
    scrollToBottomOfChat()
    await bgImgChange()
})

onMounted(async () => {
    await bgImgChange()
})

async function bgImgChange() {
    console.log('bg change')
    const chat = await axios.get('/api/chat/' + route.params.id + '/info')
    console.log(chat)
    if (!chat.data?.background_image) chatEl.value.style.backgroundImage = 'none'
    chatEl.value.style.backgroundImage = `url(${host.value+chat.data?.background_image?.replace('.', '')})`
    console.log(chatEl.value.style.backgroundImage)
}




socket.on('recMessage', (msgu) => {
    if (msgu.chatId != route.params.id) return
    messages.value.push(msgu);
    console.log(msgu)
    notifyMe(msgu.username+': '+msgu.text)
    scrollToBottomOfChat()

})

socket.on('updImgChat', (msgu) => {
    console.log(msgu)
    console.error('CHANGE')
    if (msgu.id != route.params.id) return
    (chatEl.value as HTMLElement).style.backgroundImage = `url(${host.value+msgu.background_image?.replace('.', '')})`
})





</script>

<template>
    <div class="chat__container" ref="chatEl">
        <div class="chat" ref="chatElem">
            <div class="messages">
                <Message v-for="message in messages" :key="message.id" :src="message.authorAvatar?.replace('.', '') ? host+message.authorAvatar?.replace('.', '') : host+message.author?.avatar?.replace('.', '')" :pos="message.username == me.username ? 'right' : 'left'" :userId="message.author?.id ? message.author?.id : message.userId " :class="message.username == me.username ? 'message-right' : 'message-left'">
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
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding: 10px;
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