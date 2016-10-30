const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('APP/db/models/user')

const auth = require('express').Router()

passport.use(new LocalStrategy(
  (email, password, done) => {
    User.findOne({where: {email}})
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Login incorrect' })
        }
        return user.authenticate(password)
          .then(ok => {
            if (!ok)
              return done(null, false, { message: 'Login incorrect' })
            done(null, user)              
          })
      })
      .catch(done)
  }
))

auth.post('/login', passport.authenticate('local', {
  successRedirect: '/'
}))

module.exports = auth

