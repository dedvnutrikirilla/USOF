const Category = require('../../models/category.js'),
      Post = require('../../models/post.js'),
      CustomError = require('../../models/errors.js'),
      relationsTable = require('../../models/relationsTable.js'),
      errorReplier = require('../../utils/errorReplier.js');

module.exports = {
    getAll: async(request, reply) => {
        try {
            const categModel = new Category(request.db.sequelize.models.Categories);
            const categsArr = await categModel.getAll(request.params.chunk);
            reply.status(200).send(categsArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    get: async(request, reply) => {
        try {
            if (!request.params || request.params.categoryId == null
            || isNaN(request.params.categoryId))
                throw new CustomError(1023);
            const categModel = new Category(request.db.sequelize.models.Categories);
            const categ = await categModel.get(request.params.categoryId);
            if (!categ) throw new CustomError(1023);
            reply.status(200).send(categ);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getPosts: async(request, reply) => {
        try {
            if (!request.params || request.params.categoryId == null
            || isNaN(request.params.categoryId))
                throw new CustomError(1023);
            const postCategory = new relationsTable(request.db.sequelize.models.PostsCategories);
            const post = new Post(request.db.sequelize.models.Posts);

            const postArr = await post.getAllByCateg(postCategory, request.params.categoryId, request.params.chunk);
            reply.status(200).send(postArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    set: async(request, reply) => {
        try {
            if(!request.user || !request.user.id)
                throw new CustomError(1005);
            const {title, description} = request.body;
            const categModel = new Category(request.db.sequelize.models.Categories);
            await categModel.set(title, description);
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    edit: async(request, reply) => {
        try {
            if (!request.params || request.params.categoryId == null
            || isNaN(request.params.categoryId))
                throw new CustomError(1023);
            if(!request.user || request.user.role != 'admin')
                throw new CustomError(1002);
            const {title, description} = request.body;
            const categModel = new Category(request.db.sequelize.models.Categories);
            await categModel.edit(request.params.categoryId, title, description);
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    delete: async(request, reply) => {
        try {
            if (!request.params || request.params.categoryId == null
            || isNaN(request.params.categoryId))
                throw new CustomError(1023);
            if(!request.user || request.user.role != 'admin')
                throw new CustomError(1002);
            const categModel = new Category(request.db.sequelize.models.Categories);
            // nocheckin if categ exists, so on delete not found does nothin
            /*const categ = await categModel.get(request.params.categoryId);
            if (!categ) throw new CustomError(1023);*/
            categModel.deleteByCols({id: request.params.categoryId })
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },
}