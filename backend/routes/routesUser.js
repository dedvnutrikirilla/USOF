const controler = require('./controllers/controlUser.js');

module.exports = function (server, opts, done) {
    server.get('/api/users', controler.getAllUsers);
    server.get('/api/users/:userId', controler.getUser);
    server.post('/api/users', controler.setUser);
    server.patch('/api/users/avatar', controler.editUserAvatar);
    server.patch('/api/users/:userId', controler.editUser);
    server.delete('/api/users/:userId', controler.deleteUser);

    done();
}
