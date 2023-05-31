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
      address: '19th Street & 23rd Drive, NY 11105',
      city: 'New York',
      state: "NY",
      lat: 40.78032,
      lng: -73.92166
    },
    {
      groupId: 2,
      address: 'Central Park, New York, NY',
      city: 'New York',
      state: "NY",
      lat: 40.78257,
      lng: -73.96555
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
      city: 'Kalamath',
      state: "OR",
      lat: 42.22570,
      lng: -121.78235
    },
    {
      groupId: 1,
      address: '3300 Coney Island Ave · Brooklyn, NY',
      city: 'Brooklyn',
      state: "NY",
      lat:40.57561062235096,
      lng:-73.95988108566911
    },
    {
      groupId: 2,
      address: "520 Parkside Blvd, Massapequa, NY 11758",
      city: 'Massapequa',
      state: 'NY',
      lat: 40.677312588073036,
      lng: -73.4679608396377
    },
    {
      groupId: 3,
      address: "Tualatin Hills Tennis Stadium, 50 NW 158th Ave, Beaverton, OR 97006",
      city: 'Beaverton',
      state: 'OR',
      lat: 45.5170522437835,
      lng: -122.83640732986088
    },
    {
      groupId: 4,
      address: "Henry Hudson Dr · Fort Lee, NJ",
      city: 'Fort Lee',
      state: 'NJ',
      lat: 40.85999040016494,
      lng: -73.95523864417827
    },
    {
      groupId: 5,
      address: "Frank Sinatra Dr · Hoboken, NJ",
      city: 'Hoboken',
      state: 'NJ',
      lat: 40.74830604004731,
      lng: -74.02393

    }
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
