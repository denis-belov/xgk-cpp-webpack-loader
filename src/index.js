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
  warning: 'yellow',
  note: 'grey',
  undefined: 'blue',
})[(str.toLowerCase().match(/error|warning|note/) || [])[0]]](str));


module.exports = function WebpackLoader() {
  const options = (this.options && this.options.eslint) || this.query || {};

  options.watch.forEach((elm) => this.addContextDependency(elm));

  colorize(execSync(options.execute).toString());

  return `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;
};
