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
          url: "https://res.cloudinary.com/devex/image/fetch/c_scale,f_auto,q_auto,w_720/https://lh4.googleusercontent.com/VQyrPPyh-FGdV2BJtlcwDphesnxERD6SLWvGtARygLDVNSsXhFF0kzG_yXvLyiARZbKIG3VYF_CIbF4_B-Wy3Eu7kKhHKKR3pq_2ob2pdZgxt_Wz_uqXjRMrhIBKREQnJo--Ui9b",
          preview: true,
        },

        {
          groupId: 2,
          url: "https://static.vecteezy.com/system/resources/previews/001/218/566/original/carpe-diem-motivational-icon-vector.jpg",
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
