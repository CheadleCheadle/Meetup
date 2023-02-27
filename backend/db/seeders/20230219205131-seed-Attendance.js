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
   options.tableName = "Attendances";
       await queryInterface.bulkInsert(options, [
        {
          eventId: 1,
          userId: 1,
          status: 'Attendee'
        },
        {
          eventId: 2,
          userId: 2,
          status: 'Attendee'
        },
        {
          eventId: 3,
          userId: 3,
          status: 'Attendee'
        },
        {
          eventId: 4,
          userId: 4,
          status: 'Attendee'
        },
         {
          eventId: 1,
          userId: 2,
          status: "Attendee"
         }

       ], options);
  },

   down: async (queryInterface, Sequelize) =>  {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Attendances";
    await queryInterface.bulkDelete(options, null, {});

  }
};
