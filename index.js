'use strict'
const chalk = require('chalk')
const pkg = require('./package.json')

const nameError =
`*******************************************************************
 You need to give your app a proper name.

 The package name

    ${pkg.name}

isn't valid. If you don't change it, things won't work right.

Please change it in ${__dirname}/package.json
  ~ xoxo, bones
********************************************************************`

const reasonableName = /^[[a-z0-9]\-]+$/
if (!reasonableName.test(pkg.name)) {
  console.error(chalk.red(nameError))
}

module.exports = {
  get name() { return pkg.name },
  get isTesting() { return !!global.it },
  get isProduction() {
    return process.env.NODE_ENV === 'production'
  },
  package: pkg,
}