'use strict'

const {STRING} = require('sequelize')

module.exports = db => db.define('favorites')

module.exports.associations = (Favorite, {Thing, User}) => {
  Favorite.belongsTo(Thing)
  Favorite.belongsTo(User)
}
