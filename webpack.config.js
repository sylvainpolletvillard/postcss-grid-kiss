const path = require("path");
const BabiliPlugin = require("babili-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = [
	{
		entry: "./playground/main.js",
		output: {
			path: 'playground/dist',
			filename: "bundle.js"
		},
		node: {
			fs: "empty"
		},
		devtool: "source-map",
		plugins: [
			new BabiliPlugin()
		]
	},
	{
		target: "node",
		externals: [nodeExternals()],
		entry: "./index.js",
		output: {
			path: 'dist',
			filename: 'index.es5.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [ path.resolve(__dirname, "src") ],
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					}
				}
			]
		}
	}
]