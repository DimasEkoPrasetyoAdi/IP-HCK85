'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Sessions', [
      {
        host_id: 1,
        sport_id: 1,
        provinsi_id: "DKI Jakarta",
        kabupaten_id: "Jakarta Pusat",
        kecamatan_id: "Gambir",
        title: 'Badminton Morning',
        description: 'Friendly intermediate match',
        session_date: new Date(new Date().getTime() + 86400000), 
        duration_hours: 2,
        ai_recommendation: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sessions', null, {});
  }
};
