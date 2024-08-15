import axios from "axios";

export async function getMe() : Promise<any> {
    try {
        const response = await axios.get('auth/me', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        if (response.status !== 200 && response.status !== 201) {
            console.log('Ошибка! Плохой статус код. ('+response.status+')');
            return 'Ошибка! Плохой статус код. ('+response.status+')';
        }
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Ошибка!  ('+error+')');
        return error;
    } 
}

export async function isAuthorized() : Promise<any> {
    localStorage.getItem('token')
    const response = await axios.get('/auth/is_auth', {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    });
    if (response.status !== 200) {
        return false;
    }
    return response.data;
}

export async function  logout() : Promise<void> {
    localStorage.removeItem('token');
}
