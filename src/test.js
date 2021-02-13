const { parse } = require('../node_modules/comment-parser/lib');

const source = `
/**
 * @xgk/cpp-webpack-loader
 * @param {execute} /src/cpp/makefiles/emcc-x64/makefile
 * @param {target} /src/cpp/build/emcc-x64/output/js/main.js
 * @param {watch_directory} /src/cpp/src
 * @param {watch_directory} /src/cpp/build
 */`;

const parsed = parse(source);

parsed[0].tags.forEach((elm) => console.log(elm));

// console.log(parsed);
