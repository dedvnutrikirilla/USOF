const { DataTypes } = require('sequelize');
const config = require('./dbModelsConfig.json');

module.exports = function(sequelizeEntity) {
  const likesModel = sequelizeEntity.define('Likes', {
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
    type: {
        // False for dislike, True for like
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
  }, {
    modelName: 'Likes',
    timestamps: true
  });
  return likesModel;
} 