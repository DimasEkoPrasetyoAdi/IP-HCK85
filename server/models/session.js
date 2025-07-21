'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    host_id: DataTypes.INTEGER,
    sport_id: DataTypes.INTEGER,
    provinsi_id: DataTypes.INTEGER,
    kabupaten_id: DataTypes.INTEGER,
    kecamatan_id: DataTypes.INTEGER,
    session_date: DataTypes.DATE,
    duration_hours: DataTypes.INTEGER,
    ai_recommendation: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};