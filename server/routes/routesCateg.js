const controller = require('./controllers/controlCateg.js');

module.exports = function (server, opts, done) {
    server.get('/api/categories', controller.getAll);
    server.get('/api/categories/:categoryId', controller.get);
    server.get('/api/categories/:categoryId/posts', controller.getPosts);
    server.post('/api/categories', controller.set);
    server.patch('/api/categories/:categoryId', controller.edit);
    server.delete('/api/categories/:categoryId', controller.delete);

    done();
}