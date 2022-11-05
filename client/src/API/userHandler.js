import axios from 'axios';

export default class userHandler{
    static async getAll(chunk = 1) {
        try {
            const reply = await axios.get('/api/users');
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async get(id) {
        try {
            const reply = await axios.get('/api/users/' + id);
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async getByLogin(login) {
        try {
            const reply = await axios.get('/api/users/login/' + login);
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async getAvatar(avatarName) {
        try {
            const reply = await axios.get('/api/users/avatar/' + avatarName);
            //console.log(reply.data);
            return -1;
        } catch (error) {
            
        }
    }
}