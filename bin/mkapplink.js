#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const {resolve} = require('path')

const appLink = resolve(__dirname, '..', 'node_modules', 'APP')

const symlinkError = error =>
`*******************************************************************
${appLink} must point to '..'

This symlink lets you require('APP/some/path') rather than
../../../some/path

I tried to create it, but got this error:
${error.message}

You might try this:

  rm ${appLink}

Then run me again.  

  ~ xoxo, bones
********************************************************************`

function makeAppSymlink() {
  console.log(`Linking '${appLink}' to '..'`)
  try {    
    try { fs.unlinkSync(appLink) } catch(swallowed) { }
    fs.symlinkSync('..', appLink)
  } catch (error) {
    console.error(chalk.red(symlinkError(error)))
    process.exit(1)
  }
  console.log(`Ok, created ${appLink}`)
}

function ensureAppSymlink() {
  try {
    const currently = fs.readlinkSync(appLink)    
    if (currently !== '..') {
      throw new Error(`${appLink} is pointing to '${currently}' rather than '..'`)
    }
  } catch (error) {
    makeAppSymlink()
  }
}

if (module === require.main) {
  ensureAppSymlink()
}