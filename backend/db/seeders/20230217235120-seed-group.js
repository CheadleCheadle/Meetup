'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = "Groups"
   await queryInterface.bulkInsert(options, [
    {
      organizerId: 1,
      name: "First Group",
      about: "Just the first group",
      type: "In person",
      private: "true",
      city: "New York",
      state: "NY",
      numMembers: 10,
      previewImage: null,
    }
   ], {}

   )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Groups"
    await queryInterface.bulkDelete(options, null, {});
  }
};
