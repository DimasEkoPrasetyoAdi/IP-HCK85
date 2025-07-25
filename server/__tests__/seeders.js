const { Sport } = require('../models');

const seedSports = async () => {
  try {
    await Sport.bulkCreate([
      { name: 'Basketball', calories_per_hour: 400 },
      { name: 'Football', calories_per_hour: 500 },
      { name: 'Tennis', calories_per_hour: 350 },
      { name: 'Badminton', calories_per_hour: 300 },
      { name: 'Volleyball', calories_per_hour: 250 }
    ], { ignoreDuplicates: true });
    
    console.log('Sports seeded successfully');
  } catch (error) {
    console.error('Error seeding sports:', error);
  }
};

module.exports = { seedSports };
