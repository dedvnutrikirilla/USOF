import axios from 'axios';

export default class authHandler{
    static async login(data) {
        try {
            const reply = await axios.post('/api/auth/login', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async register(data) {
        try {
            const reply = await axios.post('/api/auth/register', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async logout() {
        try {
            const reply = await axios.post('/api/auth/logout', null);
            return reply;
        } catch (error) {
            console.log(error);
        }
    }
    
}