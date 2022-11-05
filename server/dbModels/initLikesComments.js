const { DataTypes } = require('sequelize');

module.exports = function(sequelizeEntity) {
  const LikesCommentsModel = sequelizeEntity.define('LikesComments', {
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
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Comments',
            key: 'id'
        }
    }
  }, {
    modelName: 'LikesComments',
    timestamps: false
  });
  return LikesCommentsModel;
} 