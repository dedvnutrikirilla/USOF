const controller = require('./controllers/controlUser.js');

module.exports = function (server, opts, done) {
    server.get('/api/users', controller.getAllUsers);
    server.get('/api/users/:userId', controller.getUser);
    server.get('/api/users/login/:login', controller.getUserByLogin);
    server.get('/api/users/avatar/:avatarName', controller.getAvatar)
    server.post('/api/users', controller.setUser);
    server.patch('/api/users/avatar', controller.editUserAvatar);
    server.patch('/api/users/:userId', controller.editUser);
    server.delete('/api/users/:userId', controller.deleteUser);

    done();
}
