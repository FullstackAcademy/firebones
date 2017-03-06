'use strict'

const app = require('APP')
const debug = require('debug')(`${app.name}:oauth`)
const Sequelize = require('sequelize')
const db = require('APP/db')
const User = require('./user')

const OAuth = db.define('oauths', {
  uid: Sequelize.STRING,
  provider: Sequelize.STRING,

  // OAuth v2 fields
  accessToken: Sequelize.STRING,
  refreshToken: Sequelize.STRING,

  // OAuth v1 fields
  token: Sequelize.STRING,
  tokenSecret: Sequelize.STRING,

  // The whole profile as JSON
  profileJson: Sequelize.JSON,
}, {
  // Further reading on indexes:
  // 1. Sequelize and indexes: http://docs.sequelizejs.com/en/2.0/docs/models-definition/#indexes
  // 2. Postgres documentation: https://www.postgresql.org/docs/9.1/static/indexes.html
	indexes: [{fields: ['uid'], unique: true,}],
})

// OAuth.V2 is a default argument for the OAuth.setupStrategy method - it's our callback function that will execute when the user has successfully logged in
OAuth.V2 = (accessToken, refreshToken, profile, done) =>
  OAuth.findOrCreate({
    where: {
      provider: profile.provider,
      uid: profile.id,
    }
  })
  .spread(oauth => {
    debug(profile)
    debug('provider:%s will log in user:{name=%s uid=%s}',
      profile.provider,
      profile.displayName,
      profile.id
    )
    oauth.profileJson = profile
    oauth.accessToken = accessToken

    // db.Promise.props is a Bluebird.js method; basically like "all" but for an object whose properties might contain promises.
    // Docs: http://bluebirdjs.com/docs/api/promise.props.html
    return db.Promise.props({
      oauth,
      user: oauth.getUser(),
      _saveProfile: oauth.save(),
    })
  })
  .then(({ oauth, user }) => user ||
    User.create({
      name: profile.displayName,
    })
    .then(user => db.Promise.props({
      user,
      _setOauthUser: oauth.setUser(user)
    }))
    .then(({user}) => user)
  )
  .then(user => done(null, user))
  .catch(done)

// setupStrategy is a wrapper around passport.use, and is called in authentication routes in server/auth.js
OAuth.setupStrategy =
({
  provider,
  strategy,
  config,
  oauth=OAuth.V2,
  passport
}) => {
  const undefinedKeys = Object.keys(config)
        .map(k => config[k])
        .filter(value => typeof value === 'undefined')
  if (undefinedKeys.length) {
    for (let key in config) {
      if (!config[key]) debug('provider:%s: needs environment var %s', provider, key)
    }
    debug('provider:%s will not initialize', provider)
    return
  }

  debug('initializing provider:%s', provider)

  passport.use(new strategy(config, oauth))
}

module.exports = OAuth
