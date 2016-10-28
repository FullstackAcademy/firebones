'use strict';
var Sequelize = require('sequelize')
var db = require('APP/db/db')

module.exports = db.define('users', {
  name: Sequelize.STRING,
})
