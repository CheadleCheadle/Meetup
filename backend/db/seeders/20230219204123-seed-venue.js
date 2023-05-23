'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
   up: async (queryInterface, Sequelize) =>  {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = "Venues";
   await queryInterface.bulkInsert(options, [
    {
      groupId: 1,
      address: '12345 S Main St',
      city: 'Newport',
      state: "OR",
      lat: 44.6368,
      lng: -124.0535
    },
    {
      groupId: 2,
      address: '12345 S Main St',
      city: 'Athena',
      state: "OR",
      lat: 45.8118,
      lng: -118.4905
    },
    {
      groupId: 3,
      address: '12345 S Main St',
      city: 'Beaverton',
      state: "OR",
      lat:45.4869,
      lng: -122.8040
    },
    {
      groupId: 4,
      address: '12345 S Main St',
      city: 'Portland',
      state: "OR",
      lat: 45.5152,
      lng: -122.6784
    },
   ], {});
  },

   down: async (queryInterface, Sequelize) =>  {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Venues";
    await queryInterface.bulkDelete(options, null, {});
  }
};
