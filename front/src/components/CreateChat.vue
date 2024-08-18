<script setup lang="ts">
import { getMe } from '@/common/jwt';
import axios from 'axios';
import { ref } from 'vue';

const me = await getMe();
const users = await axios.get('/users/all');

const emits = defineEmits(['close'])

const strings : any = []


for (let user of users.data) {
    strings.push([`@${ user.username } (${ user.id }) - ${ user.first_name} ${ user.last_name }`, user.id])
}

const finds = ref(strings)
const selected = ref<string[]>([])

function handleFind (e : Event) {
    const value = (e.target as HTMLInputElement).value
    finds.value = []
    for (let string of strings) {
        if (string[0].toLowerCase().includes(value.toLowerCase()) && !selected.value.includes(string as never)) {
            finds.value.push(string as never)
        }
    }
};

function handleCreate (e : Event) {
    e.preventDefault();
    const userIds : any = []
    for (let user of selected.value) {
        userIds.push({id: user[1]})
    }
    const res = axios.post('/api/create/chat', {
        name: (document.getElementById('name') as HTMLInputElement).value,
        description: (document.getElementById('description') as HTMLInputElement).value,
        users: userIds
    })

    console.log(res)


}






</script>

<template>
    <div class="createChat" >
        <form @submit.prevent="handleCreate">
            <input type="text" placeholder="Name" id="name" ref="nameInput">
            <input type="text" placeholder="Description" id="description" ref="descriptionInput">
            <div>
                <input type="text" placeholder="Найти среди невыбранных..." id="type" @input="handleFind">
            

            </div>
            
            <div class="peoples">
                <select id="type" ref="typeInput" multiple>
                    <option v-for="str in finds" :key="str[1]" :value="str[1]" @click="selected.push(str); finds.splice(finds.indexOf(str), 1) ">{{str[0]}}</option>

                </select>   
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
                <select id="type" ref="typeInput" multiple>
                    <option v-for="str in selected" :key="str[1]" :value="str[1]" @click="selected.splice(selected.indexOf(str), 1); finds.push(str) ">{{str[0]}}</option>

                </select>   
            </div>
            <button type="submit" value="Create">Создать</button>
        </form>
    </div>

</template>


<style scoped lang="scss">  
.createChat {
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        margin-top: 10px;
        padding: 10px;
        background-color: #2a3038;

        .peoples {
            display: flex;
            width: 800px;
            align-items: center;

            svg {
                transform: scale(3);
                margin-right: 15px;
                margin-left: 10px;
                fill: #2e73a3;

            }
        }
    }

    input {
        width: 100%;
        border-radius: 20px;
        border: none;
        padding: 10px;
        background-color: #181818;
        color: white;
    }

    select {
        width: 100%;
        border-radius: 20px 0px 0px 20px;
        border: none;
        padding: 10px;
        height: 300px;
        background-color: #181818;
        color: white;
    }

    select:active, select:focus, select:focus-within, select:hover, input, input:active, input:focus, input:focus-within, input:hover {
        outline: none;
    }

    button {
        width: 100%;
        height: 30px;
        border: none;
        color: white;
        background-color: #2e73a3;
        display: flex;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
    }
}
</style>