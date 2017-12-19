
exports.seed = function(knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return knex('garage_items').insert([
        {name: 'Tent', reason: 'camping', cleanliness: 'Dusty'},
        {name: 'Tarp', reason: 'all purpose', cleanliness: 'Rancid'},
        {name: 'Frisbee', reason: 'Fun', cleanliness: 'Sparkling'},
      ]);
    });
};
