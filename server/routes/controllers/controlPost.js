const Post = require('../../models/post.js'),
      User = require('../../models/user.js'),
      Like = require('../../models/like.js'),
      Category = require('../../models/category.js'),
      Comment = require('../../models/comment.js'),
      relationsTable = require('../../models/relationsTable.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js');
//

module.exports = {
    getAll: async(request, reply) => {
        try {
            const postModel = new Post(request.db.sequelize.models.Posts);
            const postsArray = await postModel.getAll(request.query.chunk);
            reply.status(200).send(postsArray);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    get: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const postModel = new Post(request.db.sequelize.models.Posts);
            const post = await postModel.get(request.params.postId);
            reply.status(200).send(post);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAllComs: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const comModel = new Comment(request.db.sequelize.models.Comments);
            const commentArr = await comModel.getAll(request.params.postId);
            reply.status(200).send(commentArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAllCategs: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const postsCatgModel = new relationsTable(request.db.sequelize.models.PostsCategories);
            const categoryModel = new Category(request.db.sequelize.models.Categories);
            const categoriesArr = await categoryModel.getByPost(postsCatgModel, request.params.postId);
            reply.status(200).send(categoriesArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAllLikes: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const postsLikeModel = new relationsTable(request.db.sequelize.models.LikesPosts);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            const likesArr = await likeModel.get(postsLikeModel, {postId: request.params.postId});
            reply.status(200).send(likesArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getCountLikes: async (request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const postsLikeModel = new relationsTable(request.db.sequelize.models.LikesPosts);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            const likesCount = await likeModel.getCount(postsLikeModel, {postId: request.params.postId});
            reply.status(200).send(likesCount);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    set: async(request, reply) => {
        try {
            if(!request.user || !request.user.id)
                throw new CustomError(1005);
            if(!request.body) throw new CustomError(1025);
            const {title, content, categoriesArr} = request.body;
            if (categoriesArr) {
                if (!Array.isArray(categoriesArr))
                    throw new CustomError(1041);
                categoriesArr.forEach(categoryId => {
                if(isNaN(categoryId))
                    throw new CustomError(1041);
                });
            }

            const postModel = new Post(request.db.sequelize.models.Posts);
            const post = await postModel.set(title, content, request.user.id);
            
            const postCategory = new relationsTable(request.db.sequelize.models.PostsCategories);
            if (categoriesArr) {
                categoriesArr.forEach(async (categoryId) => {
                    await postCategory.set({postId: post.id, categoryId: categoryId});
                });
            } 
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    setCom: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if(!request.body) throw new CustomError(1025);
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            if (!request.body.content)
                throw new CustomError(1051);
            const postModel = new Post(request.db.sequelize.models.Posts);
            const post = await postModel.get(request.params.postId);
            if (!post) throw new CustomError(1023);
            const comModel = new Comment(request.db.sequelize.models.Comments);
            const comment = await comModel.set(request.user.id, request.params.postId, request.body.content);
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    setLike: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            if (typeof request.body.type != 'boolean')
                throw new CustomError(1061);
            const postModel = new Post(request.db.sequelize.models.Posts);
            const posts = await postModel.get(request.params.postId);
            if (!posts) throw new CustomError(1023);
            const userModel = new User(request.db.sequelize.models.Users);
            const postsLikeModel = new relationsTable(request.db.sequelize.models.LikesPosts);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            const like = await likeModel.set(postsLikeModel, postModel, userModel, request.user.id,
            'postId', request.params.postId, request.body.type, 'PostLikes');
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    edit: async(request, reply) => {
        try {
            if(!request.user || request.user.id == null || isNaN(request.user.id))
                throw new CustomError(1005);
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            const {title, content, status, categoriesArr} = request.body;
            const postCategory = new relationsTable(request.db.sequelize.models.PostsCategories);
            const postModel = new Post(request.db.sequelize.models.Posts);
            
            await postModel.edit(request.params.postId, title, content, 
            status, request.user.id, postCategory, categoriesArr);

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    delete: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            if(!request.user) 
                throw new CustomError(1024);
            const postModel = new Post(request.db.sequelize.models.Posts);
            const post = await postModel.get(request.params.postId);
            if (!post) throw new CustomError(1023);
            if (post.authorId != request.user.id
            && request.user.role != 'admin')
                throw new CustomError(1002);
            
            postModel.deleteByCols({id: request.params.postId});
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    deleteLike: async(request, reply) => {
        try {
            if (!request.params || request.params.postId == null
            || isNaN(request.params.postId))
                throw new CustomError(1023);
            if(!request.user || request.user.id == null || isNaN(request.user.id)) 
                throw new CustomError(1024);
            
            const postModel = new Post(request.db.sequelize.models.Posts);
            const post = await postModel.get(request.params.postId);
            if (!post) throw new CustomError(1023);
            const userModel = new User(request.db.sequelize.models.Users);
            const postsLikeModel = new relationsTable(request.db.sequelize.models.LikesPosts);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            await likeModel.delete(postsLikeModel, postModel, userModel, request.user.id,
                'postId', request.params.postId, request.body.type, 'PostLikes');

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}