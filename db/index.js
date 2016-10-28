'use strict'
const debug = require('debug')('sql')
const chalk = require('chalk')
const Sequelize = require('sequelize')
const pkg = require('APP/package.json')

const dbUrl = process.env.DATABASE_URL || `postgres://localhost:5432/${pkg.name}`

console.log(chalk.yellow(`Opening database connection to ${url}`));

// create the database instance
module.exports = new Sequelize(`postgres://localhost:5432/${pkg.name}`, {
  logging: debug, // Set DEBUG=sql in the environment to get SQL queries 
  native: true    // lets Sequelize know we can use pg-native for ~30% more speed
});

// pull in our models
require('./models')