'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Sports', 'calories_per_hour', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 300
    });

    await queryInterface.addColumn('Sessions', 'max_participants', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Sessions', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sports', 'calories_per_hour');
    await queryInterface.removeColumn('Sessions', 'max_participants');
    await queryInterface.removeColumn('Sessions', 'image_url');
  }
};
