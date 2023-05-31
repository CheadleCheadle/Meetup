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
          url: "https://cdn.mos.cms.futurecdn.net/4qrW9mHjeDWK5hSFuTMkk3.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://traveler.marriott.com/wp-content/uploads/2017/09/NYCUptown_HighbridgePark.jpg",
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
        {
          eventId: 5,
          url: "https://hips.hearstapps.com/hmg-prod/images/cycling-power-allied-echo-0078-tara-trevor-raab-6435b957839d1.jpg",
          preview:true
        },
        {
          eventId: 6,
          url: "https://nassauobserver.com/wp-content/uploads/2015/11/MassapequaPreserve_112515A.jpg",
          preview: true
        },
        {
          eventId: 7,
          url: "https://recsports.usc.edu/wp-content/uploads/sites/4/2023/04/LCPracTen-8-1024x683.jpg",
          preview: true
        },
        {
          eventId: 8,
          url: "https://www.njpalisades.org/images/thumbs/mastheadPhotoNew.jpg",
          preview: true
        },
        {
          eventId: 9,
          url: "https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/Kayak-Adventures-7_248faed8-b080-2378-ece9ddeb6e0fd9ae.jpg",
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
    options.tableName = "EventImages";
       await queryInterface.bulkDelete(options, null, {});
  }
};
