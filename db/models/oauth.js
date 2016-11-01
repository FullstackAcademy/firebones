'use strict'

const debug = require('debug')('oauth')
const Sequelize = require('sequelize')
const db = require('APP/db')

const OAuth = db.define('oauths', {
  uid: Sequelize.STRING,
  provider: Sequelize.STRING,

  // OAuth v2 fields
  accessToken: Sequelize.STRING,
  refreshToken: Sequelize.STRING,

  // OAuth v1 fields
  token: Sequelize.STRING,
  tokenSecret: Sequelize.STRING,
  
  profile: Sequelize.TEXT,
}, {
	indexes: [{fields: ['uid'], unique: true,}],
  instanceMethods: {
    authenticate(plaintext) {
      return new Promise((resolve, reject) =>
        bcrypt.compare(plaintext, this.password_digest,
          (err, result) =>
            err ? reject(err) : resolve(result))
        )
    }    
  }
})

OAuth.loginV2 = (accessToken, refreshToken, profile, done) =>
  this.findOrCreate({
    where: {
      provider: profile.provider,
      uid: profile.id,
    }})
    .then(oauth => {
      debug('provider:%s will log in user:{name=%s uid=%s}',
        profile.provider,
        profile.displayName,
        token.uid)
      return db.Promise.props({oauth, user: token.getUser()})
    })
    .then(({ oauth, user }) => user ||
      User.create({
        name: profile.displayName,        
      }).then(user => db.Promise.props({
        user,
        _didSetToken: oauth.setUser(user)
      }))
    )
    .then(({ user }) => done(null, user))
    .catch(done)

module.exports = OAuth