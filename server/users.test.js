const request = require('supertest-as-promised')
const {expect} = require('chai')
const db = require('APP/db')
const User = require('APP/db/models/user')
const app = require('./start')

describe('/api/users', () => {
  describe('when not logged in', () => {
    it('GET /:id fails 401 (Unauthorized)', () =>
      request(app)
        .get(`/api/users/1`)
        .expect(401)
    )    

    it('POST creates a user', () =>
      request(app)
        .post('/api/users')
        .send({
          email: 'beth@secrets.org',
          password: '12345'
        })
        .expect(201)
    )

    it('POST redirects to the user it just made', () =>
      request(app)
        .post('/api/users')
        .send({
          email: 'eve@interloper.com',
          password: '23456',
        })
        .redirects(1)
        .then(res => expect(res.body).to.contain({
          email: 'eve@interloper.com'
        }))        
    )

    describe('DELETE', () => {
      const alice = {
        username: 'alice@users.org',
        password: '12345'
      }

      const bob = {
        username:'bob@secrets.org',
        password:'asdf'
      }

      before('create two users', () => 
        db.didSync
        .then(() => Promise.all([
          User.create({
            email: alice.username,
            password: alice.password
          })
          .then(_alice => alice.id = _alice.id),
          User.create({
            email: bob.username,
            password: bob.password
          })
          .then(_bob => bob.id = _bob.id),
        ]))
      )

      it('/:id fails 401 when user is not logged in', () =>
        request(app)
          .delete(`/api/users/${alice.id}`)
          .then(401)        
      )

      describe('when logged in', () => {
        const agent = request.agent(app)
        before('log in alice', () => agent
          .post('/api/auth/local/login') 
          .send(alice))
        
        it('/:id fails 403 when user tries to delete someone besides themself', () =>
            agent.delete(`/api/users/${bob.id}`)
            .then(403)        
        )
      })
    })
  })
})