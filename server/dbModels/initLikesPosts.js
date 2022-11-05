const { DataTypes } = require('sequelize');

module.exports = function(sequelizeEntity) {
  const LikesPostsModel = sequelizeEntity.define('LikesPosts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    likeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Likes',
          key: 'id'
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'id'
        }
    }
  }, {
    modelName: 'LikesPosts',
    timestamps: false
  });
  return LikesPostsModel;
} 
