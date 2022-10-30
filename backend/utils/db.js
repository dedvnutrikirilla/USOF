const config = require('./dbConfig.json');
const { Sequelize } = require('sequelize');

// Table models initializers
// Those are just functions
// MI - Model Initialization
const UsersMI = require('../dbModels/initUsers.js'),
      PostsMI = require('../dbModels/initPosts.js'),
      CatgsMI = require('../dbModels/initCategories.js'),
      CommsMI = require('../dbModels/initComments.js'), //!!!
      LikesMI = require('../dbModels/initLikes.js');
const PostsCatgsMI = require('../dbModels/initPostsCategories.js'),
      LikesPostsMI = require('../dbModels/initLikesPosts.js'),
      LikesCommsMI = require('../dbModels/initLikesComments.js');
//

module.exports = class DataBase {
    constructor() {
        const sequelize = new Sequelize(config.database, 
            config.user, config.password, config.params)
        
        this.sequelize = sequelize;
        // Initializin all models
        const usersModel = UsersMI(this.sequelize),
              postsModel = PostsMI(this.sequelize),
              catgsModel = CatgsMI(this.sequelize),
              commsModel = CommsMI(this.sequelize),
              likesModel = LikesMI(this.sequelize);
        const postsCatgsModel = PostsCatgsMI(this.sequelize),
              likesPostsModel = LikesPostsMI(this.sequelize),
              likesCommsModel = LikesCommsMI(this.sequelize);
        //
        
        // User model links
        usersModel.hasMany(likesModel, {as: 'Likes', foreignKey: 'authorId', onDelete:'SET NULL'});
        usersModel.hasMany(postsModel, {as: 'Posts', foreignKey: 'authorId', onDelete:'SET NULL'});
        usersModel.hasMany(commsModel, {as: 'Comments', foreignKey: 'authorId', onDelete:'SET NULL'});
        likesModel.belongsTo(usersModel, {as: 'Author', foreignKey: 'authorId'});
        postsModel.belongsTo(usersModel, {as: 'Author', foreignKey: 'authorId'});
        commsModel.belongsTo(usersModel, {as: 'Author', foreignKey: 'authorId'});
        // Posts model links
        postsModel.hasMany(postsCatgsModel, {as: 'PostCategories', foreignKey:'postId', onDelete:'CASCADE'});
        postsModel.hasMany(likesPostsModel, {as: 'PostLikes', foreignKey: 'postId', onDelete:'CASCADE'});
        postsModel.hasMany(commsModel, {as: 'PostComments', foreignKey: 'postId', onDelete:'CASCADE'});
        postsCatgsModel.belongsTo(postsModel, {as: 'Post', foreignKey: 'postId'});
        likesPostsModel.belongsTo(postsModel, {as: 'Post', foreignKey: 'postId'});
        commsModel.belongsTo(postsModel, {as: 'Post', foreignKey: 'postId'});
        // Categories model Links
        catgsModel.hasMany(postsCatgsModel, {as: 'PostCategories', foreignKey: 'categoryId', onDelete:'CASCADE'});
        postsCatgsModel.belongsTo(catgsModel, {as: 'Category', foreignKey: 'categoryId'});
        // Comments model Links
        commsModel.hasMany(likesCommsModel, {as:'CommentLikes', foreignKey: 'commentId', onDelete:'CASCADE'});
        likesCommsModel.belongsTo(commsModel, {as:'Comments', foreignKey: 'commentId', onDelete:'CASCADE'});
        // Likes model links
        likesModel.hasMany(likesCommsModel, {as: 'CommentLikes', foreignKey: 'likeId', onDelete:'CASCADE'});
        likesModel.hasMany(likesPostsModel, {as: 'PostLikes', foreignKey: 'likeId', onDelete:'CASCADE'});
        likesCommsModel.belongsTo(likesModel, {as: 'Like', foreignKey:'likeId'});
        likesPostsModel.belongsTo(likesModel, {as: 'Like', foreignKey:'likeId'});
        

        this.__syncModels();
        console.log(this.sequelize.models);
    }

    __end() {
        this.sequelize.close();
    }

    async __syncModels() { 
        // Synchronize all models
        // If table exists and differs - alter
        await this.sequelize.sync({ alter: false });
    }
}