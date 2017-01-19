const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
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
}