const insertionProtector = require('../utils/insertionProtector.js'),
      CustomError = require('./errors.js');

module.exports = class Entity{
    constructor(sequelModel) {
        this.sequelModel = sequelModel;
    }
    insertionProtector = insertionProtector;

    async tableLog() {
        await this.sequelModel.findAll()
        .then((result) => {
            console.log(JSON.stringify(result, null, 2));
        });
    };

    async deleteByCols(selectObject){
        await this.sequelModel.destroy({
            where: selectObject
        });
    };

    // Uberi "isRaw" Dibil
    async getAllbyCols(selectObject, excludeAttrs = []) {
        return await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            where: selectObject
        });
    };
    
    // Uberi "isRaw" Dibil
    async getOnebyCols(selectObject, excludeAttrs = []) {
        const [Users] = await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            where: selectObject
        });
        return Users;
    };

    async getPagination(offset = 0, limit = 10,  excludeAttrs = []) {
        return await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            offset: offset, limit: limit,
            raw: true 
        });
    }
}
