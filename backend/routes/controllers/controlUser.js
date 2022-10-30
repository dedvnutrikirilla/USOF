const {pipeline} = require('stream'),
      Util = require('util'),
      Fs = require('fs'),
      {v4: uuidv4} = require('uuid'),
      Pump = Util.promisify(pipeline);

const User = require('../../models/user.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js'),
      Mailer = require('../../utils/mailer.js'),
      jwtConfig = require('../../utils/jwtConfig.json'),
      hashPassword = require('../../utils/hasher.js');

module.exports = {
    getAllUsers : async (request, reply) => {
        try {
            if (!request.user) request.user = {role: 'user'};
            const userModel = new User(request.db.sequelize.models.Users);
            const usersArray = await userModel.getAll(request.user.role, request.query.chunk);
            reply.status(200).send(usersArray);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getUser : async(request, reply) => {
        try {
            if (!request.params || request.params.userId == null
            || isNaN(request.params.userId))
                throw new CustomError(1023);
            if (!request.user) request.user = {role: 'user'};
            const userModel = new User(request.db.sequelize.models.Users);
            const users = await userModel.get(request.user.role, request.params.userId);
            reply.status(200).send(users);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    setUser : async(request, reply) => {
        try {
            if (!request.user || request.user.role != 'admin')
                throw new CustomError(1002);
            const user = new User(request.db.sequelize.models.Users);
            const pawn = await user.set(request.body.login,
            request.body.password, request.body.email, true);
            //
            if(!pawn) {
                reply.status(204).send();
            }
            else if(pawn.login == request.body.login)
                throw new CustomError(1001);
            else throw new CustomError(-999);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    deleteUser : async(request, reply) => {
        try {
            if (!request.params || request.params.userId == null
            || isNaN(request.params.userId))
                throw new CustomError(1023);
            const user = new User(request.db.sequelize.models.Users);
            if (!request.user)
                throw new CustomError(1005);
            else {
                const pawn = await user.get(request.user.role, request.params.userId);
                if (pawn.login != request.user.login
                && request.user.role != 'admin')
                    throw new CustomError(1005);
            }
            await user.deleteByCols({id: request.params.userId});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    editUser : async(request, reply) => {
        try {
            if (!request.params || request.params.userId == null
            || isNaN(request.params.userId))
                throw new CustomError(1023);
            const user = new User(request.db.sequelize.models.Users);
            // admin can change whatever they want, but users can edit only their profiles
            if (!request.user || !request.user.role || !request.user.login)
                throw new CustomError(1005);
            
            const {login, email, fullName, socialCredit, profilePic, role} = request.body;
            const data = {login, email, fullName, socialCredit, profilePic, role};
            user.insertionProtector(data);
            if(request.body.password) data.password = hashPassword(request.body.password);
            await user.edit(data, request.params.userId,
            request.user.role == 'admin', request.user.login);
            if (email) {
                const mailer = new Mailer();
                mailer.sendConfirmEmail(email, request.jwt.sign({
                    email: email,
                    login: login
                }, jwtConfig.mailToken.secret, jwtConfig.mailToken.sign));   
            }
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    editUserAvatar : async(request, reply) => {
        try {
            if (!request.user || !request.user.login)
                throw new CustomError(1005);
            const user = new User(request.db.sequelize.models.Users);
            const avatarPath = './profilePics/' +  request.user.login + '_' + uuidv4() + '.png';
            const data = await request.file();
            const previousPawn = await user.getOnebyCols({login: request.user.login});
            await user.edit({profilePic: avatarPath}, previousPawn.id, false, request.user.login);
            Fs.unlink(previousPawn.profilePic, (error) => {
                if (error) console.log(error);
                console.log('File deleted!');
            });
            await Pump(data.file, Fs.createWriteStream(avatarPath));
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}