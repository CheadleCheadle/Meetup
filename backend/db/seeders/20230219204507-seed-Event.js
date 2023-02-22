'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      options.tableName = "Events";
     await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Festival",
        description: "just a festival",
        type: 'Festival',
        capacity: 300,
        price: 10,
        startDate: "2021-11-19 20:00:00",
        endDate: "2021-11-19 20:00:00",
      }
     ], {});
  },

   down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Events";
    await queryInterface.bulkDelete(options, null, {});
  }
};
