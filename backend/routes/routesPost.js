const controler = require('./controllers/controlPost.js');

module.exports = function (server, opts, done) {
    server.get('/api/posts', controler.getAll);
    server.get('/api/posts/:postId', controler.get);
    server.get('/api/posts/:postId/comments', controler.getAllComs);
    server.post('/api/posts/:postId/comments', controler.setCom);
    server.get('/api/posts/:postId/categories', controler.getAllCategs);
    server.get('/api/posts/:postId/likeCount', controler.getCountLikes);
    server.get('/api/posts/:postId/like', controler.getAllLikes);
    server.post('/api/posts/', controler.set);
    server.post('/api/posts/:postId/like', controler.setLike);
    server.patch('/api/posts/:postId', controler.edit);
    server.delete('/api/posts/:postId', controler.delete);
    server.delete('/api/posts/:postId/like', controler.deleteLike);
    done();
}
