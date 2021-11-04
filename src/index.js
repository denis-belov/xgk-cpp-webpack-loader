const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// const chalk = require('chalk');
const comment_parser = require('../node_modules/comment-parser/lib');



// const colorize = (text) =>
// {
// 	let color = null;

// 	switch ((text.toLowerCase().match(/error|failed|warning|note/) || [])[0])
// 	{
// 	case 'error':
// 	{
// 		color = 'red';

// 		break;
// 	}

// 	case 'failed':
// 	{
// 		color = 'red';

// 		break;
// 	}

// 	case 'warning':
// 	{
// 		color = 'yellow';

// 		break;
// 	}

// 	case 'note':
// 	{
// 		color = 'grey';

// 		break;
// 	}

// 	default:
// 	{
// 		color = 'blue';
// 	}
// 	}

// 	chalk[color](text);
// };



module.exports = function WebpackLoader(source)
{
	const loader_options = this.loaders?.[this.loaderIndex]?.options || {};

	const [ parsed_comments ] =
		comment_parser
			.parse(source)
			.filter((comment) => comment.description.includes('@xgk/cpp-webpack-loader'));

	const options =
	{
		// make: null,
		// makefile: null,
		execute: null,
		target: null,
		watchDirectories: [],
		watchFiles: [],
		// watchFiles2: [],
	};

	Object.assign(options, loader_options);

	if (parsed_comments)
	{
		parsed_comments.tags.forEach
		(
			(tag) =>
			{
				switch (tag.name)
				{
				case 'execute':
				{
					options.execute = tag.description;

					break;
				}

				case 'target':
				{
					options.target = tag.description;

					break;
				}

				case 'watchDirectories':
				case 'watchFiles':

					options[tag.name].push
					(
						...JSON.parse(tag.description),
					);

					break;

					// case 'watchFiles2':

					// 	options.watchFiles2.push(

					// 		...JSON.parse(tag.description),
					// 	);

					// 	break;

				default:
				}
			},
		);
	}

	// if (fs.existsSync(options.target))
	// {
	// 	fs.rmdirSync(options.target, { recursive: true });
	// }



	options.watchDirectories.forEach((elm) => this.addContextDependency(elm));

	options.watchFiles.forEach((elm) => this.addDependency(elm));



	// const _execute = () =>
	// {
	// 	if (options.execute)
	// 	{
	// 		colorize(

	// 			execSync(`${ options.execute }`).toString(),
	// 		);
	// 	}

	// };



	// options.watchFiles2.forEach(

	// 	({ file, execute }) =>
	// 	{
	// 		// fs.unwatchFile(file);

	// 		fs.watch(

	// 			file,

	// 			// { interval: 100 },

	// 			() =>
	// 			{
	// 				colorize(execSync(execute).toString());

	// 				_execute();
	// 			},
	// 		);
	// 	},
	// );

	// console.log(options.watchFiles2);

	if (options.execute)
	{
		// console.log(options.execute);
		console.log(execSync(`${ options.execute }`, { encoding: 'utf8' }));
		// colorize(execSync(`${ options.execute }`, { encoding: 'utf8' }));
	}



	let result = null;



	const buffer =
		Array.prototype.slice.call
		(
			fs.readFileSync(path.resolve(options.target)),
		);

	switch (path.parse(options.target).ext)
	{
	case '.wasm':
	{
		result = `/*eslint-disable*/ export default new Uint8Array([ ${ buffer } ]).buffer;`;

		break;
	}

	case '.js':
	{
		result = `/*eslint-disable*/${ fs.readFileSync(path.resolve(options.target), 'utf8') }`;

		break;
	}

	default:
	{
		result = `/*eslint-disable*/ export default new Uint8Array([ ${ buffer } ]).buffer;`;
	}
	}

	return result;
};
