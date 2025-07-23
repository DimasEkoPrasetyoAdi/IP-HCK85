'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SessionParticipant extends Model {
    static associate(models) {
      // Define associations without any extra options
      SessionParticipant.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      SessionParticipant.belongsTo(models.Session, {
        foreignKey: 'session_id'
      });
    }
  }
  SessionParticipant.init({
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'session_id'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  }, {
    sequelize,
    modelName: 'SessionParticipant',
    tableName: 'SessionParticipants',
    timestamps: true
  });
  return SessionParticipant;
};