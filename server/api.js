'use strict'
const api = require('express').Router()

api.get('/hello', (req, res) => res.send({hello: 'world'}))

module.exports = api