'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {

    static associate(models) {
      Sport.hasMany(models.Session, { foreignKey: 'sport_id' })
    }
  }
  Sport.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Sport name cannot be empty' },
        len: { args: [3, 30], msg: 'Sport name must be 3–30 chars' }
      }
    },
    calories_per_hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 50, msg: 'Calories per hour must be at least 50' }
      }
    }
  }, {
    sequelize,
    modelName: 'Sport',
  });
  return Sport;
};