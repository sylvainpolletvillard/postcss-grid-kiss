const
	postcss = require('postcss'),
	main    = require('./src/main');

module.exports = postcss.plugin('postcss-grid-kiss', main);