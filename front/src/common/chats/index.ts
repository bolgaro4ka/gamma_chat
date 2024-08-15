import axios from "axios";

export async function getMessagesInChat(chatId : number|string) : Promise<any> {

    const response = await axios.get('/chats/' + chatId + '/messages')
    return response.data
}