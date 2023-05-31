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
      name: "New York Real Estate Cycling Meetup Group",
      about: "This is a group for NYC Real Estate professionals interested in road cycling with other like-minded individuals to come together and ride. All skill levels are welcome. I started this group as a way to get out and meet other NYC Real Estate community cycling enthusiasts, post-COVID. Looking forward to riding with everybody.",
      type: "In person",
      private: false,
      city: "New York",
      state: "NY",
    },
    {
      organizerId: 2,
      name: "NYC Hikers, Explorers, Adventurers & Travelers (H.E.A.T)",
      about: "Life is about doing something different, learn something new, sharing new experiences, travel to new places, and making special memories together with new friends.",
      type: "In person",
      private: false,
      city: "New York",
      state: "NY",
    },
    {
      organizerId: 3,
      name: "David’s Halfcourt Hitsquad",
      about: "Bringing tennis players together in the Kansas City metro area and beyond, since 26 Dec 2008! All skill levels welcome ... including those wanting to learn how to play.",
      type: "In person",
      private: true,
      city: "Kansas City",
      state: "MO"
    },
    {
      organizerId: 4,
      name: "Northwest Trail Runners",
      about: "I hardly see any groups for specifically trail runners, so I started this group! I'd be open to organizing some road running events too though. I'm thinking weeknight runs will be closer to civilization, places like Palisades Park, Garret Mountain, Eagle Rock etc. And weekend afternoons, we can venture farther out to places like Ringwood Park or even Wawayanda.",
      type: "In person",
      private: true,
      city: "Paramus",
      state: "NJ"
    },
    {
      organizerId: 1,
      name: "Hoboken Cove Community Boathouse",
      about: "We are a free paddling group located at the Hoboken Cove Community Boathouse at the Hoboken waterfront. Our kayaking season at Maxwell Place begins in late May and runs through September. If you like to join our kayaking days inside our protected cove, there is no need to sign up or RSVP, just show up when we are open. Everyone is welcome!",
      type: "In person",
      private: false,
      city: "Hoboken",
      state: "NJ",
    },

   ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups"
    return queryInterface.bulkDelete(options, null, {});
  }
};
