'use strict'
const app = require('APP')
    , debug = require('debug')(`${app.name}:db`) // DEBUG=your_app_name:db
    , chalk = require('chalk')
    , Sequelize = require('sequelize')

    , name = (app.env.DATABASE_NAME || app.name) +
             (app.isTesting ? '_test' : '')
    , url = app.env.DATABASE_URL || `postgres://localhost:5432/${name}`

debug(chalk.yellow(`Opening database connection to ${url}`))
const db = module.exports = new Sequelize(url, {
  logging: require('debug')('sql'),  // export DEBUG=sql in the environment to
                                     // get SQL queries
  define: {
    underscored: true,       // use snake_case rather than camelCase column names.
                             // these are easier to work with in psql.
    freezeTableName: true,   // don't change table names from the one specified
    timestamps: true,        // automatically include timestamp columns
  }
})

// Initialize all our models and assign them as properties
// on the database object.
//
// This lets us use destructuring to get at them like so:
//
//   const {User, Product} = require('APP/db')
//
Object.assign(db, require('./models')(db),
  // We'll also make createAndSync available. It's sometimes useful in tests.
  {createAndSync})

// After defining all the models, sync the database.
// Notice that didSync *is* a Promise, rather than being a function that returns
// a Promise. It holds the state of this initial sync.
db.didSync = db.createAndSync()

// sync the db, creating it if necessary
function createAndSync(force=app.isTesting, retries=0, maxRetries=5) {
  return db.sync({force})
    .then(() => debug(`Synced models to db ${url}`))
    .catch(fail => {
      // Don't do this auto-create nonsense in prod, or
      // if we've retried too many times.
      if (app.isProduction || retries > maxRetries) {
        console.error(chalk.red(`********** database error ***********`))
        console.error(chalk.red(`    Couldn't connect to ${url}`))
        console.error()
        console.error(chalk.red(fail))
        console.error(chalk.red(`*************************************`))
        return
      }
      // Otherwise, do this autocreate nonsense
      debug(`${retries ? `[retry ${retries}]` : ''} Creating database ${name}...`)
      return new Promise(resolve =>
        // 'child_process.exec' docs: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
        require('child_process').exec(`createdb "${name}"`, resolve)
      ).then(() => createAndSync(true, retries + 1))
    })
}
