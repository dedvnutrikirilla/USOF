const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
//

const likeExclude = ['id', 'postId', 'commentId', 'likeId'];

module.exports = class ComentModel extends Entity {
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(relationsModel, selectObj) {
        return await relationsModel.sequelModel.findAll({
            where: selectObj,
            attributes: {exclude: likeExclude},
            raw: true,
            include: [{
                model: this.sequelModel, as: 'Like'
            }]
        });
    };

    async getCount(relationsModel, selectObj) {
        const totalLikes =  await relationsModel.sequelModel.count({
            where: selectObj,
            attributes: {exclude: likeExclude},
            raw: true,
            include: [{
                model: this.sequelModel, as: 'Like'
            }]
        });

        const dislikes = await relationsModel.sequelModel.count({
            where: selectObj,
            attributes: {exclude: likeExclude},
            raw: true,
            include: [{
                model: this.sequelModel, as: 'Like',
                where: {type: false}
            }]
        });

        return totalLikes - (2 * dislikes);
    };

    async getAuthor() {
        
    }

    async set(relationsModel, targetModel, userModel, userId, targetIdName, targetId, type, alias) {
        const [selectedLike] = await this.sequelModel.findAll({
            where: {
                authorId: userId
            },
            include: [{
                model: relationsModel.sequelModel, as: alias,
                where: {[targetIdName]: targetId}
            }]
        });
        if (selectedLike) throw new CustomError(1062);
        const target = await targetModel.getOnebyCols({id: targetId});
        const targetAuthor = await userModel.getOnebyCols({id: target.authorId});
        if (type) targetAuthor.socialCredit = targetAuthor.socialCredit + 1;
        else targetAuthor.socialCredit = targetAuthor.socialCredit - 1;
        await targetAuthor.save();
        const like = await this.sequelModel.create({
            authorId: userId,
            type: type
        });
        await relationsModel.set({likeId: like.id, [targetIdName]: targetId});
    };

    async delete(relationsModel, targetModel, userModel, userId, targetIdName, targetId, type, alias) {
        const [selectedLike] = await this.sequelModel.findAll({
            where: {
                authorId: userId
            },
            include: [{
                model: relationsModel.sequelModel, as: alias,
                where: {[targetIdName]: targetId}
            }]
        });
        if (!selectedLike) throw new CustomError(1063);
        const target = await targetModel.getOnebyCols({id: targetId});
        const targetAuthor = await userModel.getOnebyCols({id: target.authorId});
        console.log(selectedLike);
        if (type) targetAuthor.socialCredit = targetAuthor.socialCredit - 1;
        else targetAuthor.socialCredit = targetAuthor.socialCredit + 1;
        await targetAuthor.save();
        await this.deleteByCols({
            id: selectedLike.id
        });
    }
}