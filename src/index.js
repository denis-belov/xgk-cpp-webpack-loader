const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const comment_parser = require('../node_modules/comment-parser/lib');

const colorize = (text) => {

	let color = null;

	switch ((text.toLowerCase().match(/error|failed|warning|note/) || [])[0]) {

	case 'error':

		color = 'red';
		break;

	case 'failed':

		color = 'red';
		break;

	case 'warning':

		color = 'yellow';
		break;

	case 'note':

		color = 'grey';
		break;

	default:

		color = 'blue';
		break;
	}

	chalk[color](text);
};



module.exports = function WebpackLoader(source) {

	const [ parsed_comments ] =
		comment_parser
			.parse(source)
			.filter((comment) => comment.description.includes('@xgk/cpp-webpack-loader'));

	let result = new ArrayBuffer();

	if (parsed_comments) {

		const options = {

			make: null,
			makefile: null,
			target: null,
			watch_directories: [],
		};

		// if (options.watch_file && Array.isArray(options.watch_file)) {
		// 	options.watch_file.forEach((elm) => this.addDependency(elm));
		// }

		parsed_comments.tags.forEach((tag) => {

			switch (tag.type) {

			case 'makefile':

				options.makefile = path.join(this.rootContext, tag.name);
				break;

			case 'target':

				options.target = path.join(this.rootContext, tag.name);
				break;

			case 'watch_directory':

				options.watch_directories.push(path.join(this.rootContext, tag.name));
				break;

			case 'watch_directories':

				options.watch_directories.push(...(tag.name).split(' ').map((dir) => path.join(this.rootContext, dir)));
				break;

			default:
			}
		});

		if (options.watch_directories && Array.isArray(options.watch_directories) && options.watch_directories.length) {

			options.watch_directories.forEach((elm) => this.addContextDependency(elm));
		}

		const { dir, base } = path.parse(options.makefile);

		colorize(

			execSync(`cd ${ dir } && make -f ${ base }`).toString(),
		);

		const buffer =
			Array.prototype.slice.call(

				fs.readFileSync(path.resolve(options.target)),
			);

		switch (path.parse(options.target).ext) {

		case '.wasm':

			result = `export default new Uint8Array([ ${ buffer } ]).buffer;`;

			break;

		case '.js':

			result = `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;

			break;

		default:
		}

		result = `export default new Uint8Array([ ${ buffer } ]).buffer;`;
	}

	return result;
};
