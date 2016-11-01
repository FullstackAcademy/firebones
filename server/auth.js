const app = require('APP')
const debug = require('debug')(`${app.name}:auth`)
const passport = require('passport')

const User = require('APP/db/models/user')
const OAuth = require('APP/db/models/oauth')
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

passport.use(new (require('passport-local').Strategy) (
  (email, password, done) => {
    debug('will authenticate user(email: "%s")', email)
    User.findOne({where: {email}})
      .then(user => {
        if (!user) {
          debug('authenticate user(email: "%s") did fail: no such user', email)
          return done(null, false, { message: 'Login incorrect' })
        }
        return user.authenticate(password)
          .then(ok => {
            if (!ok) {
              debug('authenticate user(email: "%s") did fail: bad password')              
              return done(null, false, { message: 'Login incorrect' })
            }
            debug('authenticate user(email: "%s") did ok: user.id=%d', user.id)
            done(null, user)              
          })
      })
      .catch(done)
  }
))

/******** Facebook **********/
const env = require('APP').env
const facebook = passport => {
  if (!env.FACEBOOK_CLIENT_ID || !env.FACEBOOK_CLIENT_SECRET)
    return

  const clientID = env.FACEBOOK_CLIENT_ID
    , clientSecret = env.FACEBOOK_CLIENT_SECRET
    , callbackURL = '/api/auth/login/facebook'     
  if (!clientID) {
    console.error(`${__filename}: You need to set FACEBOOK_CLIENT_ID`)
    return
  }
  if (!clientSecret) {
    console.error(`${__filename}: You need to set FACEBOOK_CLIENT_SECRET`)
    return      
  }
  passport.use(
    new (require('passport-facebook').Strategy) (
      {clientID, clientSecret, callbackURL},
      OAuth.loginV2
    )
  )
}
facebook(passport)

auth.get('/whoami', (req, res) => res.send(req.user))

auth.post('/:strategy/login', (req, res, next) =>
  passport.authenticate(req.params.strategy, {
    successRedirect: '/'
  })(req, res, next)
)

module.exports = auth

