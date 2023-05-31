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
          url: "https://helios-i.mashable.com/imagery/articles/04j10PCNoJJFQbSy5wpmHRn/hero-image.fill.size_1248x702.v1680172923.jpg",
          preview: true,
        },

        {
          groupId: 2,
          url: "https://as2.ftcdn.net/v2/jpg/02/87/24/95/1000_F_287249541_Ui4Iqyp4ggPSuHg89yvvEWsB4ksH9jYT.jpg",
          preview: true
        },
        {
          groupId: 3,
          url: "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630",
          preview: true
        },
        {
          groupId: 4,
          url: "https://photos.thetrek.co/wp-content/uploads/2019/04/23113425/Screen-Shot-2019-04-23-at-10.33.35-AM-e1556040946541.png",
          preview: true
        },
        {
          groupId: 5,
          url: "https://www.communityboating.com/wp-content/uploads/2018/01/paddling-header.jpg",
          preview: true
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
    options.tableName = "GroupImages";
       await queryInterface.bulkDelete(options, null, {})
  }
};
