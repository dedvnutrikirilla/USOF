const User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      jwtConfig = require('../../utils/jwtConfig.json'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js'),
      hashPassword = require('../../utils/hasher.js');

const mailer = new Mailer();

module.exports = {
    loginer : async (request, reply) => {
        try{
            if (!request.body.login || !request.body.password)
                throw new CustomError(-999); // -999 po prichine idi nahui
            const user = new User(request.db.sequelize.models.Users);
            user.insertionProtector(request.body);

            const pawn = await user.getOnebyCols({
                login: request.body.login
            });
            if(!pawn)
                throw new CustomError(1003);
            else if(pawn.password != hashPassword(request.body.password))
                throw new CustomError(1004);
            else if(pawn.email === 'unconfirmed')
                throw new CustomError(1006);
            else
                reply.sendAuthToken(pawn.id, pawn.login, pawn.role);
        }catch(error) {
            errorReplier(error, reply);
        }
    },
    
    register : async (request, reply) => {
        try {
            if (!request.body.login || !request.body.password 
            || !request.body.email || !request.body.fullName)
                throw new CustomError(-999); // -999 po prichine idi nahui
            const user = new User(request.db.sequelize.models.Users);
            const pawn = await user.set(request.body.login, request.body.password, 
            request.body.email, request.body.fullName, false);
            if(!pawn) {
                mailer.sendConfirmEmail(request.body.email, request.jwt.sign({
                    email: request.body.email,
                    login: request.body.login
                }, jwtConfig.mailToken.secret, jwtConfig.mailToken.sign));
                reply.status(200).send();
            }
            else if(pawn.login == request.body.login)
                throw new CustomError(1001);
            else throw new CustomError(-999);
        } catch (error) {
            errorReplier(error, reply);
        }
    },
    
    logouter : async (request, reply) => {
        if(!request.cookies.AuthToken) reply.status(401).send();
        else reply.status(200).setCookie('AuthToken', null);
    },

    reseter : async (request, reply) => {
        try {
            if(!request.user || !request.user.login) throw new CustomError(1024);
            if (!request.body.password || !request.body.newPassword)
                throw new CustomError(-999); // -999 po prichine idi nahui
            if (request.body.newPassword.length < 6 || request.body.password.length < 6)
                throw new CustomError(1022);
            const user = new User(request.db.sequelize.models.Users);
            user.insertionProtector(request.body);

            const pawn = await user.getOnebyCols({
                login: request.user.login
            });
            if(!pawn)
                throw new CustomError(1003);
            else if(pawn.password != hashPassword(request.body.password))
                throw new CustomError(1004);
            mailer.sendPasswordReset(pawn.email, request.jwt.sign({
                newPassword: hashPassword(request.body.newPassword),
                login: request.user.login
            }, jwtConfig.passToken.secret, jwtConfig.passToken.sign));
                reply.status(200).send();    
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    resetConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;

            if(!token) throw new CustomError(-999);
            request.jwt.verify(token, async (err, payload) => {
                if(err) throw new CustomError(1005);
                const user = new User(request.db.sequelize.models.Users);
                const pawn = await user.getOnebyCols({
                    login: payload.login
                }, []);
                pawn.password = payload.newPassword;
                await pawn.save();
            });
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    mailConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;
            if(!token) throw new CustomError(-999);

            request.jwt.verify(token, async (err, payload) => {
                if(err) throw new CustomError(1005);
                const user = new User(request.db.sequelize.models.Users);
                const pawn = await user.getOnebyCols({
                    login: payload.login
                });
                pawn.email = payload.email;
                await pawn.save();
            });
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}