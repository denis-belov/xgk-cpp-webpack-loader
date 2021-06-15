const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports =
{
	target: 'node',

	// resolve:
	// {
	// 	extensions: [ '.js' ],
	// 	modules: [ './node_modules' ],
	// 	descriptionFiles: [ 'package.json' ],
	// },

	// module:
	// {
	// 	rules:
	// 	[
	// 		{
	// 			test: /\.js$/,
	// 			exclude: /node_modules/,
	// 			use: [ { loader: 'eslint-loader' } ],
	// 		},
	// 	],
	// },

	output:
	{
		path: path.join(__dirname, 'build'),
		filename: 'index.js',
		library: 'xgk@cpp-webpack-loader',
		libraryTarget: 'umd',
	},

	plugins:
	[
		new CleanWebpackPlugin(),
	],
};
