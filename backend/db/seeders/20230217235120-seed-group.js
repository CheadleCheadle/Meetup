'use strict';

/** @type {import('sequelize-cli').Migration} */
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
   await queryInterface.bulkInsert('Groups', [
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
   ]

   )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
