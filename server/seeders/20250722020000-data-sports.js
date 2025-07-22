'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Sports', [
      {
        name: 'Badminton',
        calories_per_hour: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Running',
        calories_per_hour: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Futsal',
        calories_per_hour: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Basketball',
        calories_per_hour: 700,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sports', null, {});
  }
};
