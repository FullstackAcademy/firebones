#!/usr/bin/env node

// 'bin/setup' is a symlink pointing to this file, which makes a
// symlink in your project's main node_modules folder that points to
// the root of your project's directory.

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
    // fs.unlinkSync docs: https://nodejs.org/api/fs.html#fs_fs_unlinksync_path
    try { fs.unlinkSync(appLink) } catch(swallowed) { }
    // fs.symlinkSync docs: https://nodejs.org/api/fs.html#fs_fs_symlinksync_target_path_type
    const linkType = process.platform === 'win32' ? 'junction' : 'dir'
    fs.symlinkSync('..', appLink, linkType)
  } catch (error) {
    console.error(chalk.red(symlinkError(error)))
    // process.exit docs: https://nodejs.org/api/process.html#process_process_exit_code
    process.exit(1)
  }
  console.log(`Ok, created ${appLink}`)
}

function ensureAppSymlink() {
  try {
    // readlinkSync docs: https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options
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
