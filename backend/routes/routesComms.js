const controler = require('./controllers/controlComm.js');

module.exports = function (server, opts, done) {
    server.get('/api/comments/:commentId', controler.get);
    server.get('/api/comments/:commentId/like', controler.getLikes);
    server.get('/api/comments/:commentId/likeCount', controler.getLikesCount);
    server.post('/api/comments/:commentId/like', controler.setLike);
    server.patch('/api/comments/:commentId', controler.edit);
    server.delete('/api/comments/:commentId', controler.delete);
    server.delete('/api/comments/:commentId/like', controler.deleteLike);

    done();
}
