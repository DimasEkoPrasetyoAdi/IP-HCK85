'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Session, { foreignKey: 'host_id' })
      User.belongsToMany(models.Session, { through: models.SessionParticipant, as:'joinedSessions' })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
        len: { args: [3, 50], msg: 'Name must be between 3–50 characters' }
      }
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Email cannot be empty' },
        isEmail: { msg: 'Email must be valid' }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [60, 60], msg: 'Password hash must be 60 chars (bcrypt)' }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};