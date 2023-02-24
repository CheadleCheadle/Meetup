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
   options.tableName = "EventImages";
       await queryInterface.bulkInsert(options, [

        {
          eventId: 1,
          url: "image url",
          preview: true,
        },
        {
          eventId: 2,
          url: "image url",
          preview: true,
        },
        {
          eventId: 3,
          url: "image url",
          preview: true,
        },
        {
          eventId: 4,
          url: "image url",
          preview: true,
        },
       ], {})
  },

   down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "EventImages";
       await queryInterface.bulkDelete(options, null, {});
  }
};
