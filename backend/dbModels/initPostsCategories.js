const { DataTypes } = require('sequelize');

module.exports = function(sequelizeEntity) {
  const posCatModel = sequelizeEntity.define('PostsCategories', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    modelName: 'PostsCategories',
    timestamps: false
  });
  return posCatModel;
} 
