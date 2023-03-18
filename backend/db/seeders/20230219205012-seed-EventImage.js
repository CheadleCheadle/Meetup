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
          url: "https://edison365.com/wp-content/uploads/2022/03/How-do-hackathons-work.png",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://media.istockphoto.com/id/1370862129/vector/happy-st-patricks-day-celtic-lettering-logo-on-green-clover-and-shamrock-background.jpg?s=612x612&w=0&k=20&c=qTCWqrKWeyxfByde309qkmj70LNpDU9LdG0aObQrLBI=",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695__340.jpg",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://opb-opb-prod.cdn.arcpublishing.com/resizer/KwDlh3ZbfTJOUp4mKDbkTzv42jo=/767x0/smart/cloudfront-us-east-1.images.arcpublishing.com/opb/GHYQM4EWFVDOTIKC7WDURJJPPQ.jpg",
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
