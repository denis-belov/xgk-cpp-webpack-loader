/*
eslint-disable
id-length,
func-style,
max-len,
no-console,
no-sync,
*/

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const chokidar = require('chokidar');

const execSync = (cmd) => new Promise((resolve) => exec(cmd, { maxBuffer: 0xFFFFFFFF }, (err_, stdout) => resolve([ err_, stdout ])));

const colorize = (out) => out.forEach((elm) => (!elm || elm.toString().split('\r\n').forEach((str) => console.log(chalk[({
  'error': 'red',
  warning: 'yellow',
  note: 'grey',
  undefined: 'blue',
})[(str.toLowerCase().match(/error|warning|note/) || [])[0]]](str)))));

let watch = true;

module.exports = async function WebpackLoader() {
  const options = (this.options && this.options.eslint) || this.query || {};

  if (watch) {
    watch = false;

    chokidar.watch(options.watch).on('all', (event, path_) => {
      if (path.join(__dirname, path_) !== options.entry) {
        console.log(chalk.blue(event, path_));

        fs.writeFileSync(options.entry, fs.readFileSync(options.entry, 'utf8'), 'utf8');
      }
    });
  }

  colorize(await execSync(options.execute));

  return `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;
};
