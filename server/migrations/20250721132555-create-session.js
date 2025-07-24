'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sport_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model : 'Sports',
          key :'id'
        },
        onUpdate : 'CASCADE',
        onDelete: 'SET NULL'
      },
      provinsi_id: {
        type: Sequelize.STRING,
        allowNull:false
      },
      kabupaten_id: {
        type: Sequelize.STRING,
        allowNull:false
      },
      kecamatan_id: {
        type: Sequelize.STRING
      },
      session_date: {
        type: Sequelize.DATE,
        allowNull:false
      },
      duration_hours: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      ai_recommendation: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};