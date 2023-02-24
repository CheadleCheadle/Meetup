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
      lat: 120.6,
      lng: 219.4
    },
    {
      groupId: 2,
      address: '12345 S Main St',
      city: 'Athena',
      state: "OR",
      lat: 124.6,
      lng: 212.4
    },
    {
      groupId: 3,
      address: '12345 S Main St',
      city: 'Beaverton',
      state: "OR",
      lat: 210.6,
      lng: 234.4
    },
    {
      groupId: 4,
      address: '12345 S Main St',
      city: 'Portland',
      state: "OR",
      lat: 930.6,
      lng: 231.4
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
