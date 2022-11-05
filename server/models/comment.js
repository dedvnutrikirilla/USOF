const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
//
const CommentExcludeArr = ['createdAt', 'updatedAt'];
const chunkSize = 10;

module.exports = class ComentModel extends Entity {
    constructor(sequelModel) {
        super(sequelModel);
    };

    async set(authorId, postId, content) {
        this.insertionProtector(postId, authorId, content);
        return await this.sequelModel.create({
            authorId: authorId,
            postId: postId,
            content: content
        });
    };

    async edit(requestId, commentId, content) {
        const comment = await this.get(commentId);
        if (!comment) throw new CustomError(1023);
        console.log(comment.authorId + ' - ' +  requestId);
        if (comment.authorId != requestId) throw new CustomError(1024);
        comment.content = content;
        await comment.save();
    };

    async delete(requestId, requestRole, commentId) {
        const comment = await this.get(commentId);
        if (!comment) throw new CustomError(1023);
        if (comment.authorId != requestId && requestRole != 'admin')
            throw new CustomError(1002);
        this.deleteByCols({id: commentId});
    }
    
    // get all comments from post
    async getAll(postId) {
        return await this.getAllbyCols({postId: postId}, CommentExcludeArr);
    };

    async get(commentId) {
        return await this.getOnebyCols({id: commentId}, CommentExcludeArr);
    };
}