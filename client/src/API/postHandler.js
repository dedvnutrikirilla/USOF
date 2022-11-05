import axios from 'axios';

export default class postHandler{
    static async getAll(chunk = 1) {
        try {
            const reply = await axios.get('/api/posts', {params:{chunk: chunk}});
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async get(id) {
        try {
            const reply = await axios.get('/api/posts/' + id);
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async new(data) {
        try {
            const reply = await axios.post('/api/posts/', data, {
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
    
    static async getCategories(postId) {
        try {
            const reply = await axios.get('/api/posts/' + postId + '/categories');
            return reply;
        } catch (error) {
            console.log(error);
        }
    }

    static async getComments(postId) {
        try {
            const reply = await axios.get('/api/posts/' + postId + '/comments');
            return reply;
        } catch (error) {
            console.log(error);
        }
    }
}
