'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    
    static associate(models) {
      Sport.hasMany(models.Session,{foreignKey:'sport_id'})
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
  }
  }, {
    sequelize,
    modelName: 'Sport',
  });
  return Sport;
};