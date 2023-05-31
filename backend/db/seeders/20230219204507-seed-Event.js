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
        name: "Bike Ride (Moderate) from Astoria Park to Brooklyn Waterfront & back",
        description: "Meet at Shore Blvd to start the 12 mile ride to Marsha P. Johnson State Park (williamsburg) and back. Bring helmet, spare tube.",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 5,
        startDate: "2023-6-03 19:00:00",
        endDate: "2023-6-03 21:00:00",
      },
            {
        venueId: 2,
        groupId: 2,
        name: "Hike the Heights to the High Bridge",
        description: "This 6-mile walk is part of the 19th annual 'Hike the Heights' community event. The walk starts at Central Park and ends with a walk across the 175-year-old High Bridge, to the Bronx side and back. Our route takes us through Morningside, St. Nicholas, Jackie Robinson and Highbridge parks.",
        type: 'In person',
        private: false,
        capacity: 45,
        price: 30,
        startDate: "2023-6-03 21:45:00",
        endDate: "2023-6-03 23:30:00",
      },
            {
        venueId: 3,
        groupId: 3,
        name: "The Non-competitive Tennis Partner Program",
        description: "Join us for Summer Tennis. Play under the lights 'til 9:00pm at this beautiful wooded park*. Make sure you only use 3-4 of the same numbered balls. Public courts do not allow use of more than 6 balls per court. Also please try to use the same age balls as it will help you improve your game. And remember to bring plenty of water!",
        type: 'In person',
        private: true,
        capacity: 10,
        price: 20,
        startDate: "2023-5-31 19:00:00",
        endDate: "2023-5-31 21:00:00",
      },
            {
        venueId: 4,
        groupId: 4,
        name: "Wildwood - 53rd to Chestnut + Lucky Lab",
        description: "Meet up at 830 take off at 9am. \n 10 miles \n Bag check available",
        type: 'In person',
        private: true,
        capacity: 20,
        price: 5,
        startDate: "2023-6-25 18:30:00",
        endDate: "2023-6-25 20:00:00",
      },
      {
        venueId: 5,
        groupId: 1,
        name: "Long Run - Cycling Saturday",
        description: "It's a free event! Only rain can stop us! June 17th (Saturday) Disclaimer of liability: By participating in this activity you agree that organizers are not to be held responsible for any damages, injuries, or losses that may occur before, during or after the event.",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 0,
        startDate: "2023-6-17 14:00:00",
        endDate: "2023-6-17 16:00:00",
      },
      {
        venueId: 6,
        groupId: 2,
        name: "Massapequa Preserve Hike",
        description: "https://www.alltrails.com/parks/us/new-york/massapequa-preserve | Meet at Massapequa LIRR Station",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 0,
        startDate: "2023-6-15 17:00:00",
        endDate: "2023-6-15 19:30:00",
      },
      {
        venueId: 7,
        groupId: 3,
        name: "Tennis 4.0 and Up",
        description: "This meetup is for players 4.0 and up who can hold rally,direction, and accuracy.",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 0,
        startDate: "2023-6-03 18:00:00",
        endDate: "2023-6-03 19:45:00",
      },
      {
        venueId: 8,
        groupId: 4,
        name: "Palisades Park Trail Run (Easy Pace) - 4 Miles 🏃‍♀️",
        description: "I've done this one not long ago, there will be one short hiking section consisting of ascending stairs and everything else will be a smooth run, not a lot of obstacles like rocks or tree roots as compared to other North NJ trails. Plus the 'foresty' part is only half of the run, the other half is the Hudson River shoreline. There are great views of the Hudson River and the GW Bridge! The parking lot will be the Ross Dock area and parking is free on Wednesdays.",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 0,
        startDate: "2023-6-14 18:30:00",
        endDate: "2023-6-14 19:45:00",
      },
      {
        venueId: 9,
        groupId: 5,
        name: "️Advanced Level Volunteer Trip - Sunrise Red Hook - 11 mile round trip",
        description: "One of our best trips! You get to see the Statue of Liberty and cross the challenging, yet awesome, NY harbor. Super fun, but not for the faint of heart.",
        type: 'In person',
        private: false,
        capacity: 100,
        price: 0,
        startDate: "2023-6-02 12:30:00",
        endDate: "2023-6-02 16:00:00",
      },






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
