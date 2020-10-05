/*
eslint-disable
id-length,
func-style,
max-len,
no-console,
no-sync,
id-match,
*/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const colorize = (str) => console.log(chalk[({
  'error': 'red',
  failed: 'red',
  warning: 'yellow',
  note: 'grey',
  undefined: 'blue',
})[(str.toLowerCase().match(/error|failed|warning|note/) || [])[0]]](str));


module.exports = function WebpackLoader() {
  const options = (this.options && this.options.eslint) || this.query || {};

  if (options.watch_file && Array.isArray(options.watch_file)) {
    options.watch_file.forEach((elm) => this.addDependency(elm));
  }

  if (options.watch_dir && Array.isArray(options.watch_dir)) {
    options.watch_dir.forEach((elm) => this.addContextDependency(elm));
  }

  colorize(execSync(options.execute).toString());

  return `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;
};
