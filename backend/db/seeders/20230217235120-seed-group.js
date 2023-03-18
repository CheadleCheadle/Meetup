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
      name: "HACK New Jersey",
      about: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      type: "In person",
      private: false,
      city: "New York",
      state: "NY",
    },
    {
      organizerId: 2,
      name: "Carpe Diem",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      type: "In person",
      private: false,
      city: "Portland",
      state: "OR",
    },
     {
      organizerId: 3,
      name: "David’s Halfcourt Hitsquad",
      about: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      type: "In person",
      private: true,
      city: "West Linn",
      state: "OR"
     },
     {
      organizerId: 4,
      name: "Northwest Trail Runners",
      about: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      type: "In person",
      private: true,
      city: "Portland",
      state: "OR"
     }

   ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups"
    return queryInterface.bulkDelete(options, null, {});
  }
};
