'use strict'
const chalk = require('chalk')
const pkg = require('./package.json')

const nameError =
`*******************************************************************
 You need to give your app a name.

 The package name

    ${pkg.name}

isn't valid. If you don't change it, things won't work right.

Please change it in ${__dirname}/package.json
  ~ xoxo, bones
********************************************************************`

const reasonableName = /^[\w\-]+$/
if (!reasonableName.test(pkg.name)) {
  console.error(chalk.red(nameError))
}

module.exports = pkg