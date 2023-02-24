'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
   up: async (queryInterface, Sequelize) =>  {
   options.tableName = "Groups"
   return queryInterface.bulkInsert(options, [
    {
      organizerId: 1,
      name: "First Group",
      about: "Just the first group",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY",
    },
    {
      organizerId: 2,
      name: "Second Group",
      about: "Just the second group",
      type: "In person",
      private: false,
      city: "Portland",
      state: "OR",
    },
     {
      organizerId: 3,
      name: "Third Group",
      about: "Just the third group",
      type: "Online",
      private: true,
      city: "West Linn",
      state: "OR"
     },
     {
      organizerId: 4,
      name: "Fourth Group",
      about: "Just the fourth group",
      type: "Online",
      private: true,
      city: "East Linn",
      state: "OR"
     }

   ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups"
    return queryInterface.bulkDelete(options, null, {});
  }
};
