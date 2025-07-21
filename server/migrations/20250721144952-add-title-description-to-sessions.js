'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessions', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Sessions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sessions', 'title');
    await queryInterface.removeColumn('Sessions', 'description')
  }
};
