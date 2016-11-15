var autoprefixer = require('autoprefixer');

module.exports = {
	node: {
		fs: "empty"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel', // 'babel-loader' is also a valid name to reference
				query: {
					presets: ['es2015']
				}
			}
		]
	}
}