db.counters.drop();
db.users.drop();
db.groups.drop();

db.counters.insert([
  {
    _id: 'users',
    seq: 0
  },
  {
    _id: 'groups',
    seq: 0
  }
]);
