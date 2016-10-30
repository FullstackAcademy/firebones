'use strict'
const api = require('express').Router()
const db = require('APP/db')

api
  .get('/hello', (req, res) => res.send({hello: 'world'}))
  .use('/auth', require('./auth'))
  
  // Send along any errors
  .use((err, req, res, next) => res.status(500).send(err))

  // No routes matched? 404.
  .use((req, res) => res.status(404).end())

module.exports = api