'use strict'

const {resolve} = require('path')
const chalk = require('chalk')
const pkg = require('./package.json')
const debug = require('debug')(`${pkg.name}:boot`)

const nameError =
`*******************************************************************
 You need to give your app a proper name.

 The package name

    ${pkg.name}

isn't valid. If you don't change it, things won't work right.

Please change it in ${__dirname}/package.json
  ~ xoxo, bones
********************************************************************`

const reasonableName = /^[a-z0-9\-_]+$/
// RegExp.text docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
if (!reasonableName.test(pkg.name)) {
  console.error(chalk.red(nameError))
}

// This will load a secrets file from
//
//      ~/.your_app_name.env.js
//   or ~/.your_app_name.env.json
//
// and add it to the environment.
// Note that this needs to be in your home directory, not the project's root directory
const env = Object.create(process.env)
  , secretsFile = resolve(env.HOME, `.${pkg.name}.env`)
try {
  Object.assign(env, require(secretsFile))
} catch (error) {
  debug('%s: %s', secretsFile, error.message)
  debug('%s: env file not found or invalid, moving on', secretsFile)
}

const PORT = process.env.PORT || 1337

module.exports = {
  get name() { return pkg.name },
  get isTesting() { return !!global.it },
  get isProduction() {
    return process.env.NODE_ENV === 'production'
  },
  get baseUrl() {
    return env.BASE_URL || `http://localhost:${PORT}`
  },
  get port() {
    return env.PORT || 1337
  },
  package: pkg,
  env,
}
