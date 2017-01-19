var postcss = require('postcss'),
    main = require('./main');

module.exports = postcss.plugin('postcss-grid-kiss', main);