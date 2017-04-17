'use strict'

const {resolve} = require('path')
    , chalk = require('chalk')
    , pkg = require('./package.json')
    , debug = require('debug')(`${pkg.name}:boot`)

    , nameError =
`*******************************************************************
 You need to give your app a proper name.

 The package name

    ${pkg.name}

isn't valid. If you don't change it, things won't work right.

Please change it in ${__dirname}/package.json
  ~ xoxo, bones
********************************************************************`

const reasonableName = /^[a-z0-9\-_]+$/
// RegExp.test docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
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
    , secretsFile = resolve(require('homedir')(), `.${pkg.name}.env`)

try {
  const additionalEnv = require(secretsFile)
  Object.assign(env, additionalEnv)
  process.env = env
  debug('%s: %j', secretsFile, additionalEnv)
} catch (error) {
  debug('%s: %s', secretsFile, error.message)
  debug('%s: env file not found or invalid, moving on', secretsFile)
}

module.exports = {
  get name() { return pkg.name },
  get isTesting() { return !!global.it },
  get isProduction() {
    return env.NODE_ENV === 'production'
  },
  get isDevelopment() {
    return env.NODE_ENV === 'development'
  },
  get baseUrl() {
    return env.BASE_URL || `http://localhost:${env.port}`
  },
  get port() {
    return env.PORT || 1337
  },
  get root() {
    return __dirname
  },
  package: pkg,
  env,
}
