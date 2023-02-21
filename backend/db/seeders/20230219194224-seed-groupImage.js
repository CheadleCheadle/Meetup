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
   options.tableName = "GroupImages";
       await queryInterface.bulkInsert(options, [
        {
          groupId: 1,
          url: "somesort of url",
          preview: true,
        },

        {
          groupId: 2,
          url: 'group two url',
          preview: true
        }
       ], {})
  },

   down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "GroupImages";
       await queryInterface.bulkDelete(options, null, {})
  }
};
