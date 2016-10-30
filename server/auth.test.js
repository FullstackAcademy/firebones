const request = require('supertest-as-promised')
const {expect} = require('chai')
const User = require('APP/db/models/user')
const app = require('./start')

describe('/api/auth', () => {
  before('create a user', () =>
    User.sync({force: true})
      .then(_ => User.create({
        email: 'alice@secrets.org',
        password: '12345',
      }))
  )

  describe('POST /login (username, password)', () => {
    it('succeeds with a valid username and password', () =>
      request(app)
        .post('/api/auth/login')
        .send({username: 'alice@secrets.org', password: '12345'})
        .expect(302)
        .expect('Location', '/')
      )

    it('fails with an invalid username and password', () =>
      request(app)
        .post('/api/auth/login')
        .send({username: 'alice@secrets.org', password: '1234xxx5'})
        .expect(401)
      )      
  })
})