const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
//
const CategExcludeArr = ['createdAt', 'updatedAt'];
const chunkSize = 10;

module.exports = class ComentModel extends Entity {
    constructor(sequelModel) {
        super(sequelModel);
    };

    async getAll(chunk = 1) {
        return await this.getPagination(chunkSize * (chunk - 1), 
        chunkSize);
    };

    async get(id) {
        return await this.getOnebyCols({id: id}, []);
    };

    async getByPost(PostsCategoriesModel, postId) {
        return await PostsCategoriesModel.sequelModel.findAll({
            where: {
                postId: postId
            },
            attributes: {exclude: ['id', 'postId', 'categoryId']},
            raw: true,
            include: [{
                model: this.sequelModel, as: 'Category'
            }]
        });
    };

    async set(title, description) {
        if(!title || !description)
            throw new CustomError(1031);
        this.insertionProtector({
            title: title,
            description: description
        });
        return await this.sequelModel.create({title: title, description: description});
    }

    async edit(id, title, description) {
        this.insertionProtector({id: id, title: title, description: description});
        const categ = await this.get(id);
        if (!categ) throw new CustomError(1041);
        if (title) categ.title = title;
        if (description) categ.description = description;
        categ.save();
    }
}