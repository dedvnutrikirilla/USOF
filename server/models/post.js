const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
//
const PostExcludeArr = ['createdAt', 'updatedAt'];
const chunkSize = 10;

module.exports = class Post extends Entity {
    constructor(sequelModel) {
        super(sequelModel);
    };

    async getAll(chunk = 1) {
        return await this.getPagination(chunkSize * (chunk - 1), 
        chunkSize, PostExcludeArr);
    }

    async get(id) { 
        return await this.getOnebyCols({id: id}, PostExcludeArr);
    }

    async getAllByCateg(PostsCategories, categoryId, chunk = 1) {
        return await PostsCategories.sequelModel.findAll({
            where: {categoryId: categoryId},
            offset: chunkSize * (chunk - 1), limit: chunkSize,
            raw: true,
            include: [{
                model: this.sequelModel, as: 'Post'
            }]
        });
    }

    // can swap login to id
    async set(title, content, authorId) {
        if(!title || !content)
            throw new CustomError(1031);
        return await this.sequelModel.create({title: title, content: content, authorId: authorId});
    }

    async edit(postId, title, content, status, authorId, postCategory, newCategs) {
        const currentPost = await this.get({id: postId});
        if (!currentPost) throw new CustomError(1023);
        if (currentPost.authorId != authorId)
            throw new CustomError(1024);
        if (status && status != 'active' && status != 'inactive')
            throw new CustomError(1021, 'status');
        if(title) currentPost.title = title;
        if(content) currentPost.content = content;
        if(status) currentPost.status = status;
        await currentPost.save();

        if (newCategs) {
            const oldPostCategs = await postCategory.sequelModel.findAll({
                where: {postId: postId},
                raw: true
            });
            oldPostCategs.forEach(category => {
                postCategory.deleteByCols({categoryId: category.categoryId});
            });
            
            if (!Array.isArray(newCategs))
                throw new CustomError(1041);
            newCategs.forEach(categoryId => {
                if(isNaN(categoryId)) throw new CustomError(1041);
                postCategory.set({categoryId: categoryId, postId: postId});
            });   
        }
    }
}