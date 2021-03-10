const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const comment_parser = require('../node_modules/comment-parser/lib');



const colorize = (text) => {

	let color = null;

	switch ((text.toLowerCase().match(/error|failed|warning|note/) || [])[0]) {

	case 'error': {

		color = 'red';

		break;
	}

	case 'failed': {

		color = 'red';

		break;
	}

	case 'warning': {

		color = 'yellow';

		break;
	}

	case 'note': {

		color = 'grey';

		break;
	}

	default: {

		color = 'blue';
	}
	}

	chalk[color](text);
};



module.exports = function WebpackLoader(source) {

	const [ parsed_comments ] =
		comment_parser
			.parse(source)
			.filter((comment) => comment.description.includes('@xgk/cpp-webpack-loader'));



	if (parsed_comments) {

		const options = {

			make: null,
			makefile: null,
			execute: null,
			target: null,
			watch_directories: [],
		};



		parsed_comments.tags.forEach((tag) => {

			switch (tag.type) {

			case 'makefile': {

				options.makefile = path.join(this.rootContext, tag.name);

				break;
			}

			case 'execute': {

				options.execute = tag.name;

				break;
			}

			case 'target': {

				options.target = path.join(this.rootContext, tag.name);

				break;
			}

			case 'watch_directories':

				options.watch_directories.push(...(tag.name).split(' ').map((dir) => path.join(this.rootContext, dir)));

				break;

			default:
			}
		});



		options.watch_directories.forEach((elm) => this.addContextDependency(elm));



		// If "makefile" is defined it will be used rather than "execute" command will be executed

		if (options.makefile) {

			const { dir, base } = path.parse(options.makefile);

			colorize(

				execSync(`cd ${ dir } && make -f ${ base }`).toString(),
			);
		}
		else if (options.execute) {

			colorize(

				execSync(`${ options.makefile }`).toString(),
			);
		}



		let result = null;



		const buffer =
			Array.prototype.slice.call(

				fs.readFileSync(path.resolve(options.target)),
			);

		switch (path.parse(options.target).ext) {

		case '.wasm': {

			result = `/*eslint-disable*/ export default new Uint8Array([ ${ buffer } ]).buffer;`;

			break;
		}

		case '.js': {

			result = `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;

			break;
		}

		default: {

			result = `/*eslint-disable*/ export default new Uint8Array([ ${ buffer } ]).buffer;`;
		}
		}

		return result;
	}

	return '';
};
