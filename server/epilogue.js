const epilogue = require('epilogue')
const api = require('./api')
const db = require('APP/db')

// Epilogue can make routes for us
epilogue.initialize({app: api, sequelize: db})

const mustBeLoggedIn = (req, res, context) => {
  if (!req.user) {
    res.status(401).send('You must be logged in')
    return context.stop
  }

  return context.continue
}

const selfOnly = action => (req, res, context) => {
  if (req.params.id !== req.user.id) {
    res.status(403).send(`You can only ${action} yourself.`)
    return context.stop
  }
  return context.continue  
}

const forbidden = message => (req, res, context) => {
  res.status(403).send(message)
  return context.stop
}

epilogue.filters = {mustBeLoggedIn, selfOnly, forbidden,}
module.exports = epilogue
