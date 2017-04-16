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
  ({users, things}) => ({
    'obama loves surfing': {user_id: users.barack.id, thing_id: things.surfing.id},
    'god is into smiting': {user_id: users.god.id, thing_id: things.smiting.id},
    'obama loves puppies': {user_id: users.barack.id, thing_id: things.puppies.id},
    'god loves puppies': {user_id: users.god.id, thing_id: things.puppies.id},
  })
)

db.didSync
  .then(() => db.sync({force: true}))
  .then(() => Promise.props({
    users: users(),
    things: things(),
  }))
  .then(favorites)
  .finally(() => db.close())

const {mapValues} = require('lodash')

function seed(Model) {
  return rows => others => {
    if (typeof rows === 'function') {
      rows = Promise.props(others).then(rows)
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
