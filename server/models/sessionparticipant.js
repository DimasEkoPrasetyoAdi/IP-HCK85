'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SessionParticipant extends Model {
   
    static associate(models) {
      SessionParticipant.belongsTo(models.User, { foreignKey: 'user_id' })
      SessionParticipant.belongsTo(models.Session, { foreignKey: 'session_id' })
    }
  }
  SessionParticipant.init({
    session_id: {
      type:DataTypes.INTEGER,
    allowNull:false
  },
    user_id: {
     type: DataTypes.INTEGER,
     allowNull:false
    }
  }, {
    sequelize,
    modelName: 'SessionParticipant',
  });
  return SessionParticipant;
};