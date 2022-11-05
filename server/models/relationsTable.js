const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
//

module.exports = class RelationsTable extends Entity {
    constructor(sequelModel) {
        super(sequelModel);
    };

    async delete(id) {
        await this.deleteByCols({id: id});
    }

    async set(obj) {
        try {
            await this.sequelModel.create(obj);
        } catch (error) {
            console.log(error)
            // TODO LIST
            //
            // 0: cout
            // 1: Nothing
            // 2: NOTHING
            // 3: absolutely nothing
            // 4: le me think.... nothin 
        }
    }
}