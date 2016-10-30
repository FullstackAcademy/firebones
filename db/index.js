'use strict'
const debug = require('debug')('sql')
const chalk = require('chalk')
const Sequelize = require('sequelize')
const pkg = require('APP')

const name = process.env.DATABASE_NAME || pkg.name
const url = process.env.DATABASE_URL || `postgres://localhost:5432/${pkg.name}`

console.log(chalk.yellow(`Opening database connection to ${url}`));

// create the database instance
const db = module.exports = new Sequelize(url, {
  logging: debug, // export DEBUG=sql in the environment to get SQL queries 
  native: true,   // lets Sequelize know we can use pg-native for ~30% more speed
  define: {
    underscored: true,       // use snake_case rather than camelCase column names
    freezeTableName: true,   // don't change table names from the one specified
    timestamps: true,        // automatically include timestamp columns
  }
});

// pull in our models
require('./models')

// sync the db, creating it if necessary
function sync(opts) {
  db.sync(opts)
    .then(ok => console.log(`Synced models to db ${url}`))
    .catch(fail => {
      console.error(fail)
      if (process.env.NODE_ENV === 'production') {
        console.error(fail)
        return // Don't do this auto-create nonsense in prod
      }
      // Otherwise, do this autocreate nonsense
      console.log(`Creating database ${name}...`)
      require('child_process')
        .exec(`createdb "${name}"`, (err, _ok_) => {
          if (err) {
            return console.error(err)
          }
          sync({force: true})
        })
    })
}
sync()