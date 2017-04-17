/**
 * Concurrently run our various dev tasks.
 *
 * Usage: node dev
 **/

const app = require('.')
    , chalk = require('chalk'), {bold} = chalk
    , {red, green, blue, cyan, yellow} = bold
    , dev = module.exports = () => run({
      server: task(app.package.scripts['start-watch'], {color: blue}),
      build: task(app.package.scripts['build-watch'], {color: green}),
      lint: task(app.package.scripts['lint-watch'], {color: cyan}),
      test: task(app.package.scripts['test-watch'], {color: yellow})
    })

function run(tasks) {
  Object.keys(tasks)
    .map(name => tasks[name](name))
}

function task(command, {
  spawn=require('child_process').spawn,
  path=require('path'),
  color
}={}) {
  return name => {
    const stdout = log({name, color}, process.stdout)
        , stderr = log({name, color, text: red}, process.stderr)
        , proc = spawn(command, {
          shell: true,
          stdio: 'pipe',
          env: Object.assign({}, process.env, {
            NODE_ENV: 'development',
            PATH: [ path.join(app.root, 'node_modules', '.bin')
                  , process.env.PATH ].join(path.delimiter)
          })
        }).on('error', stderr)
          .on('exit', (code, signal) => {
            stderr(`Exited with code ${code}`)
            if (signal) stderr(`Exited with signal ${signal}`)
          })
    proc.stdout.on('data', stdout)
    proc.stderr.on('data', stderr)
  }
}

function log({
  name,
  ts=timestamp,
  color=none,
  text=none,
}, out=process.stdout) {
  return data => data.toString()
    // Strip out screen-clearing control sequences, which really
    // muck up the output.
    .replace('\u001b[2J', '')
    .replace('\u001b[1;3H', '')
    .split('\n')
    .forEach(line => out.write(`${color(`${ts()} ${name}   \t⎹ `)}${text(line)}\n`))
}

const dateformat = require('dateformat')
function timestamp() {
  return dateformat('yyyy-mm-dd HH:MM:ss (Z)')
}

function none(x) { return x }

if (module === require.main) { dev() }
