const { DataTypes } = require('sequelize');
const config = require('./dbModelsConfig.json');

module.exports = function(sequelizeEntity) {
  const categoriesModel = sequelizeEntity.define('Categories', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(config.categoryLen),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    modelName: 'Categories',
    timestamps: false
  });
  return categoriesModel;
} 