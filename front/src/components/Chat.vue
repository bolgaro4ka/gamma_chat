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
const chatEl : Ref<null> | Ref<HTMLElement> = ref(null)
const isContextMenuOpen = ref(false)
const contextMenu : Ref<null> | Ref<HTMLElement> = ref(null)
const chatElem : Ref<null> | Ref<HTMLElement> = ref(null)
const currentUserID : Ref<number> | Ref<string> | any = ref(0)

const host = ref(axios.defaults.baseURL)




const userAvatar = ref('')
const userName = ref('')
const userLastName = ref('')
const userFirstName = ref('')
const userEmail = ref('')


watch(
    () => route.params.id,
    async (newID, oldID) => {
        getMessages()
        await bgImgChange()
        
    }
)

const getMessages = async () => {
    messages.value = []
    try {
        const { data } = await axios.get('/api/chat/' + route.params.id, {
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
    if (!chat.data?.background_image){
         (chatEl.value as HTMLElement).style.backgroundImage = 'none'
    }
    (chatEl.value as HTMLElement).style.backgroundImage = `url(${host.value+chat.data?.background_image?.replace('.', '')})`
    console.log((chatEl.value as HTMLElement).style.backgroundImage)
}

async function handleContextMenu(e : MouseEvent) {
    e.preventDefault();
    const x =  e.clientX;
    const y =  e.clientY;
    
    

    console.log(x, y)

    const currentTarget = e.currentTarget as HTMLElement;
    const userID = currentTarget.getAttribute('userid');

    if (userID == me.id) return
    console.log(userID)

    const user = await axios.get('/api/user/' + userID)

    currentUserID.value = userID
    userAvatar.value = user.data.avatar
    userName.value = user.data.username
    userLastName.value = user.data.last_name
    userFirstName.value = user.data.first_name
    userEmail.value = user.data.email

    console.log(userEmail.value)


    isContextMenuOpen.value = !isContextMenuOpen.value;

    (contextMenu.value as HTMLElement).style.left = `${x}px`;
    (contextMenu.value as HTMLElement).style.top = `${y}px`;

}

document.getElementsByTagName('main')[0].addEventListener('closeContextsMenu', () => {
    isContextMenuOpen.value = false
})



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
    if (!chatEl.value) return
    (chatEl as any).value.style.backgroundImage = `url(${host.value+msgu.background_image?.replace('.', '')})`
})

socket.on('recMessageWithFile', (msgu) => {
    console.log(msgu, 'recMessageWithFile')
    if (msgu.chatId != route.params.id) return
    messages.value.push(msgu);
    notifyMe(msgu.username+': '+msgu.text)
    scrollToBottomOfChat()
})





</script>

<template>
    <div class="chat__wrapper">
    <div class="chat__container" ref="chatEl">
        <div class="chat" ref="chatElem">
            <div class="messages">
                <Message 
                    v-for="message in messages" :key="message.id" 
                    :src="message.authorAvatar?.replace('.', '') ? host+message.authorAvatar?.replace('.', '') : host+message.author?.avatar?.replace('.', '')" 
                    :pos="message.username == me.username ? 'right' : 'left'" 
                    :userId="message.author?.id ? message.author?.id : message.userId " 
                    :class="message.username == me.username ? 'message-right' : 'message-left'"
                    :file="message?.file ? host+message.file.replace('.', '') : ''"
                    @openMenu="handleContextMenu($event)"
                >
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
        <Teleport to="body">
            <div class="contextMenu" v-show="isContextMenuOpen" ref="contextMenu">
                <div>
                    <div class="contextMenu__head">
                        <div class="contextMenu__avatar">
                            <img :src="userAvatar ? host+userAvatar.replace('.', '') : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"/> 
                        </div>
                        <div>
                            <p>{{ userFirstName }}</p>
                            <p>{{ userLastName }}</p>
                            
                        </div>
                        <p class="id">{{ currentUserID }}</p>

                    </div>
                    
                    
                    <p>@{{ userName }}</p>
                    <p>{{ userEmail }}</p>
                    
                </div>
            </div>
        </Teleport>
        

    </div>
    <SendForm />
    </div>
</template>

<style scoped lang="scss">
.chat__wrapper {
    min-height: 100dvh;
}
.chat__container {
    height: calc(100dvh - 70px);
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

.contextMenu {
    position: absolute;
    height: 400px;
    background-color: transparent;
    backdrop-filter: blur(10px);
    display: flex;
    z-index: 1000;
    flex-direction: column;
    padding: 10px;

    img {
        width: 100px;
        height: 100px;
        border-radius: 2000px;
        margin-right: 10px;

        object-fit: cover;
    }

    &__item {
        padding: 10px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: var(--color-text) 1px solid;
    }

    &__head {
        display: flex;
        gap: 10px;
        align-items: center;

        .id {
            font-size: 40px;
            margin-left: 10px;
        }

        p {
            color: #7dce7e;
            font-weight: bolder;
        }
    }

    &__item:hover {
        background-color: #2e73a3;
    }
}

.messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>