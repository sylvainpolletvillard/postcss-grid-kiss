const
	browserslist = require('browserslist'),
	caniuselite  = require('caniuse-lite');

module.exports = function caniuse(feature, browsers) {
	const { stats } = caniuselite.feature(caniuselite.features[feature]);
	return browserslist(browsers)
		.map((browser) => browser.split(" "))
		.every(([browser, version]) => stats[browser] && stats[browser][version] === "y")
}