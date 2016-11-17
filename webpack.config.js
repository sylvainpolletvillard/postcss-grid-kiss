const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
	node: {
		fs: "empty"
	},
	plugins: [
		new BabiliPlugin()
	]
}