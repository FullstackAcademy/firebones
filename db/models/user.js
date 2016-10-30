'use strict'

const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const db = require('APP/db')

module.exports = db.define('users', {
  name: Sequelize.STRING,  
  email: {
    type: Sequelize.STRING,
    validate: {
			isEmail: true,
			notEmpty: true,
		}
  },

  // We support oauth, so users may or may not have passwords.
  password_digest: Sequelize.STRING,
	password: Sequelize.VIRTUAL,
	password_confirmation: Sequelize.VIRTUAL,
}, {
	indexes: [{fields: ['email'], unique: true,}],
	instanceMethods: {
		authenticate: function(plaintext) {
      return new Promise((resolve, reject) =>
        bcrypt.compare(plaintext, this.password_digest,
          (err, result) =>
            err ? reject(err) : resolve(result))
      )
    }
	},
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword,
  }
})

function setEmailAndPassword(user) {
  user.email = user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

	if (user.password != user.password_confirmation) {
		throw new Error("Password confirmation doesn't match password")
	}

  return new Promise((resolve, reject) =>
	  bcrypt.hash(user.get('password'), 10, (err, hash) => {
		  if (err) reject(err)
		  user.set('password_digest', hash)
      resolve(user)
	  })
  )
}