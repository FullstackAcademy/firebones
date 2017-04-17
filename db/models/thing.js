'use strict'

const {STRING} = require('sequelize')

module.exports = db => db.define('things', {
  name: STRING,
})

module.exports.associations = (Thing, {User, Favorite}) => {
  Thing.belongsToMany(User, {as: 'lovers', through: Favorite})
}
