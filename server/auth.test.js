const request = require('supertest')
const {expect} = require('chai')
const db = require('APP/db'), {User} = db
const app = require('./start')

const alice = {
  username: 'alice@secrets.org',
  password: '12345'
}

/* global describe it before afterEach beforeEach */
describe('/api/auth', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  beforeEach('create a user', () =>
    User.create({
      email: alice.username,
      password: alice.password
    })
  )

  describe('POST /login/local (username, password)', () => {
    it('succeeds with a valid username and password', () =>
      request(app)
        .post('/api/auth/login/local')
        .send(alice)
        .expect(302)
        .expect('Set-Cookie', /session=.*/)
        .expect('Location', '/')
      )

    it('fails with an invalid username and password', () =>
      request(app)
        .post('/api/auth/login/local')
        .send({username: alice.username, password: 'wrong'})
        .expect(401)
      )
  })

  describe('GET /whoami', () => {
    describe('when not logged in', () =>
      it('responds with an empty object', () =>
        request(app).get('/api/auth/whoami')
          .expect(200)
          .then(res => expect(res.body).to.eql({}))
      ))

    describe('when logged in', () => {
      // supertest agents persist cookies
      const agent = request.agent(app)

      beforeEach('log in', () => agent
        .post('/api/auth/login/local')
        .send(alice))

      it('responds with the currently logged in user', () =>
        agent.get('/api/auth/whoami')
          .set('Accept', 'application/json')
          .expect(200)
          .then(res => expect(res.body).to.contain({
            email: alice.username
          }))
      )
    })
  })

  describe('POST /logout', () =>
    describe('when logged in', () => {
      const agent = request.agent(app)

      beforeEach('log in', () => agent
        .post('/api/auth/login/local')
        .send(alice))

      it('logs you out and redirects to whoami', () => agent
        .post('/api/auth/logout')
        .expect(302)
        .expect('Location', '/api/auth/whoami')
        .then(() =>
          agent.get('/api/auth/whoami')
            .expect(200)
            .then(rsp => expect(rsp.body).eql({}))
        )
      )
    })
  )
})
