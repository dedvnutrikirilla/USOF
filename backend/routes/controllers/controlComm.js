const Comment = require('../../models/comment.js'),
      Post = require('../../models/post.js'),
      Like = require('../../models/like.js'),
      relationsTable = require('../../models/relationsTable.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js');
const User = require('../../models/user.js');
//

module.exports = {
    get: async(request, reply) => {
        try {
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            const commModel = new Comment(request.db.sequelize.models.Comments);
            const comment = await commModel.get(request.params.commentId)
            reply.status(200).send(comment);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getLikes: async(request, reply) => {
        try {
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            const commentLikeModel = new relationsTable(request.db.sequelize.models.LikesComments);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            const likesArr = await likeModel.get(commentLikeModel, {commentId: request.params.commentId});

            reply.status(200).send(likesArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getLikesCount: async(request, reply) => {
        try {
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            const commentLikeModel = new relationsTable(request.db.sequelize.models.LikesComments);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            const likesCount = await likeModel.getCount(commentLikeModel, {commentId: request.params.commentId});

            reply.status(200).send(likesCount);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    setLike: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            if (typeof request.body.type != 'boolean')
                throw new CustomError(1061);
            const commentModel = new Post(request.db.sequelize.models.Comments);
            const comment = await commentModel.get(request.params.commentId);
            if (!comment) throw new CustomError(1023);
            const userModel = new User(request.db.sequelize.models.Users);
            const commentLikeModel = new relationsTable(request.db.sequelize.models.LikesComments);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            await likeModel.set(commentLikeModel, commentModel, userModel, request.user.id,
            'commentId', request.params.commentId, request.body.type, 'CommentLikes');
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    edit: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            if (!request.body.content)
                throw new CustomError(1051);
            const commentModel = new Comment(request.db.sequelize.models.Comments);
            await commentModel.edit(request.user.id, request.params.commentId, request.body.content);
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    delete: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            const commentModel = new Comment(request.db.sequelize.models.Comments);
            await commentModel.delete(request.user.id, request.user.role, request.params.commentId);
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    deleteLike: async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1005);
            if (!request.params || request.params.commentId == null
            || isNaN(request.params.commentId))
                throw new CustomError(1023);
            
            const commentModel = new Post(request.db.sequelize.models.Posts);
            const comment = await commentModel.get(request.params.commentId);
            if (!comment) throw new CustomError(1023);
            const userModel = new User(request.db.sequelize.models.Users);
            const commentLikeModel = new relationsTable(request.db.sequelize.models.LikesComments);
            const likeModel = new Like(request.db.sequelize.models.Likes);
            likeModel.delete(commentLikeModel, commentModel, userModel, request.user.id,
            'commentId', request.params.commentId, request.body.type, 'CommentLikes');
            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}