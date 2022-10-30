const { DataTypes } = require('sequelize');
const config = require('./dbModelsConfig.json');

module.exports = function(sequelizeEntity) {
  const commentsModel = sequelizeEntity.define('Comments', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    /*author: {
        type: DataTypes.STRING(config.loginLen),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'login'
        }
    },*/
    authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
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
    },
    publishDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    modelName: 'Comments',
    timestamps: true
  });
  return commentsModel;
} 