
exports.seed = function(knex, Promise) {
  return knex('garage_items').del()
    .then(function () {
      return knex('garage_items').insert([
        {id: 1, name: 'Tent', reason: 'camping', cleanliness: 'Dusty'},
        {id: 2, name: 'Tarp', reason: 'all purpose', cleanliness: 'Rancid'},
        {id: 3, name: 'Frisbee', reason: 'Fun', cleanliness: 'Sparkling'},
      ]);
    });
};
