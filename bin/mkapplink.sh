
const appLink = join(__dirname, 'node_modules', 'APP')

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
  console.log(`Linking '${appLink}' to '..' ...`)
  try {    
    fs.unlinkSync(appLink)
    fs.linkSync(appLink, '..')
  } catch (error) {
    console.error(chalk.red(nameError))
    process.exit(1)
  }
  console.log(`Ok, created ${appLink}`)
}

function checkAppSymlink() {
  try {
    const currently = fs.readlinkSync(appLink)
    if (currently !== '..') {
      throw new Error(`${appLink} is pointing to '${currently}' rather than '..'`)
    }
  } catch (error) {
    makeAppSymlink()
  }
}