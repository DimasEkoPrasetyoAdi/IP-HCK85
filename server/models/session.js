'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {

    static associate(models) {
      Session.belongsTo(models.User, { as: 'host', foreignKey: 'host_id' });
      Session.belongsTo(models.Sport, { foreignKey: 'sport_id' });
      Session.belongsToMany(models.User, { through: models.SessionParticipant,
        as: 'participants', foreignKey: 'session_id',
        otherKey: 'user_id' });
    }
  }
  Session.init({
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sport_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provinsi_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kabupaten_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kecamatan_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title cannot be empty' },
        len: {
          args: [5, 100],
          msg: 'Title must be between 5 and 100 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    session_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Session date must be a valid date' }
      }
    },
    duration_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1, msg: 'Minimum duration is 1 hour' },
        max: { args: 12, msg: 'Maximum duration is 12 hours' }
      }
    },
    ai_recommendation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: 1, msg: 'Minimum participants is 1' }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Image URL must be valid' }
      }
    }
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};