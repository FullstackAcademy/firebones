const debug = require('debug')('auth')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('APP/db/models/user')

const auth = require('express').Router()

passport.serializeUser((user, done) => {
  debug('will serialize user.id=%d', user.id)
  done(null, user.id)
  debug('did serialize user.id=%d', user.id)
})
passport.deserializeUser(
  (id, done) => {
    debug('will deserialize user.id=%d', id)
    User.findById(id)
      .then(user => {
        debug('deserialize did ok user.id=%d', user.id)
        done(null, user)
      })
      .catch(err => {
        debug('deserialize did fail err=%s', err)
        done(err)
      })
  }
)

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

auth.get('/whoami', (req, res) => res.send(req.user))

auth.post('/login', passport.authenticate('local', {
  successRedirect: '/'
}))

module.exports = auth

