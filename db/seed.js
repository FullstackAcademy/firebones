const db = require('APP/db')
    , {User, Thing, Favorite, Promise} = db

const users = seed(User)({
  god: {
    email: 'god@example.com',
    name: 'So many names',
    password: '1234',
  },
  barack: {
    name: 'Barack Obama',
    email: 'barack@example.gov',
    password: '1234'
  },
})

const things = seed(Thing)({
  surfing: {name: 'surfing'},
  smiting: {name: 'smiting'},
  puppies: {name: 'puppies'},
})

const favorites = seed(Favorite)(
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  //
  // This lets us reference previously-created rows in order to create the join
  // rows.
  ({users, things}) => ({
    // The easiest way to seed associations seems to be to just create rows
    // in the join table.
    'obama loves surfing': {user_id: users.barack.id, thing_id: things.surfing.id},
    'god is into smiting': {user_id: users.god.id, thing_id: things.smiting.id},
    'obama loves puppies': {user_id: users.barack.id, thing_id: things.puppies.id},
    'god loves puppies': {user_id: users.god.id, thing_id: things.puppies.id},
  })
)

if (module === require.main) {
  db.didSync
    .then(() => db.sync({force: true}))
    .then(() => ({users, things}))
    .then(favorites)
    .finally(() => db.close())
}

const {mapValues} = require('lodash')

// seed(Model: Sequelize.Model) -> (rows: Function|Object) -> (others?: )
function seed(Model) {
  return rows => others => {
    if (typeof rows === 'function') {
      rows = Promise.props(
        mapValues(others,
          other =>
            typeof other === 'function' ? other() : other))
        .then(rows)
    }

    return Promise.resolve(rows)
      .then(rows => Promise.props(
        mapValues(rows, row =>
          Promise.props(row)
            .then(row => Model.create(row))
      )))
      .then(seeded => {
        console.log(`Seeded ${Object.keys(seeded).length} ${Model.name} OK`)
        return seeded
      }).catch(error => {
        console.error(`Error seeding ${Model.name}`, error)
      })
  }
}

module.exports = Object.assign(seed, {users, things, favorites})
