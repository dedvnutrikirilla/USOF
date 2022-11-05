const Entity = require('./entity.js'),
      CustomError = require('./errors.js'),
      hashPassword = require('../utils/hasher.js');

//const UserAttributes = ['login', 'fullName', 'email', 'profilePic', 'role', 'socialCredit'];
const UserExcludeArr = ['email', 'password'];
const chunkSize = 10;

module.exports = class User extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async getAll(role = 'user', chunk = 1) {
        const exclude = role == 'admin'? [] : UserExcludeArr;
        return await this.getPagination(chunkSize * (chunk - 1), 
        chunkSize, exclude);
    };

    async get(role = 'user', id) {
        const exclude = role == 'admin'? [] : UserExcludeArr;
        const pawn = await this.getOnebyCols({
            id: id
        }, exclude);
        return pawn;
    };

    async getByLogin(role = 'user', login) {
        this.insertionProtector({login: login});
        const exclude = role == 'admin'? [] : UserExcludeArr;
        const pawn = await this.getOnebyCols({
            login: login
        }, exclude);
        return pawn;
    };

    async set(login, password, email, fullName, isAdmin) {
        this.insertionProtector({
            login: login,
            email: email
        });
        if (!login || !password || !email)
            throw new CustomError(-999); // -999 po prichine idi nahui
        else if (login.length < 4 || password.length < 6)
            throw new CustomError(1022);
        password = hashPassword(password);
        const userData = {
            login: login,
            password: password
        }
        if (fullName) {
            if(fullName.length < 4)
                throw new CustomError(1022);
            this.insertionProtector({fullName: fullName});
            userData.fullName = fullName;
        }
        if (isAdmin) userData.email = email;

        const pawn = await this.getOnebyCols({
            login: login
        });
        if (!pawn) {
            await this.sequelModel.create(userData);
            return;
        }
        else return pawn;
    };

    async edit(newData, targetId, isAdmin, requestLogin) {
        const pawnTarget = await this.getOnebyCols({id: targetId});
        // data about user can be changed only by themselves or by admin
        if(!isAdmin && (newData.socialCredit || newData.role || newData.password))
            throw new CustomError(1002);
        if(pawnTarget.login != requestLogin && !isAdmin)
            throw new CustomError(1002);
        if (newData.login) {
            const pawnByNewLogin = await this.getOnebyCols({login: newData.login});
            if (pawnByNewLogin)
                throw new CustomError(1001);
        }
        
        for (const key in newData) {
            if (Object.hasOwnProperty.call(newData, key)) {
                if (newData[key]) {
                    console.log('changed: ' + key + ': ' + pawnTarget[key] + ' to ' + newData[key]);
                    pawnTarget[key] = newData[key];
                }
            }
        }
        await pawnTarget.save();
    };
}
