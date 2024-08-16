<script setup lang="ts">
</script>

<template>
    <div class="createChat">
        <form>
            <input type="text" placeholder="Name" id="name" ref="nameInput">
            <input type="text" placeholder="Description" id="description" ref="descriptionInput">
            <select id="type" ref="typeInput" multiple>
                <option value="1">Some people</option>
                <option value="2">Some people 2</option>
                <option value="3">Some people 3</option>
                <option value="4">Some people 4</option>
                <option value="5">Some people 5</option>

            </select>   
            <button type="submit" value="Create" @click="handleCreateChat">Создать</button>
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