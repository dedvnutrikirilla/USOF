const { DataTypes } = require('sequelize');
const config = require('./dbModelsConfig.json');

module.exports = function(sequelizeEntity) {
  const usersModel = sequelizeEntity.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    login: {
      type: DataTypes.STRING(config.loginLen),
      allowNull: false,
      unique: 'login'
    },
    password: {
      type: DataTypes.STRING(config.passwordLen),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(config.fullNameLen)
    },
    email: {
      type: DataTypes.STRING(config.emailLen),
      allowNull: false,
      defaultValue: 'unconfirmed' // Dimas-Bebrass, ty pidor, ksta
    },
    profilePic: {
      type: DataTypes.STRING(config.profilePicLen),
      allowNull: false,
      // Check if this works (like '/' or '\/')
      defaultValue: 'profilePics/none.png'
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'moder'),
      allowNull: false,
      defaultValue: 'user'
    },
    socialCredit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    modelName: 'Users',
    timestamps: false,
  });
  return usersModel;
} 
