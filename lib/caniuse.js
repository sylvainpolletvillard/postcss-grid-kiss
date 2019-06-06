const
	browserslist = require('browserslist'),
	caniuselite = require('caniuse-lite');

function caniuse(feature, browsers, accepted = ["y"]) {
	const { stats } = caniuselite.feature(caniuselite.features[feature]);
	return browserslist(browsers)
		.map((browser) => browser.split(" "))
		.every(([browser, version]) => stats[browser] && accepted.includes(stats[browser][version]))
}

caniuse.cssGrid = function caniuseCssGrid(browsers) {
	return caniuse("css-grid", browsers)
}

caniuse.cssSupportsApi = function caniuseCssSupports(browsers) {
	// a #2: Does not support parentheses-less one-argument version ; so we always add parenthesis
	return caniuse("css-supports-api", browsers, ["y", "a #2"])
}

module.exports = caniuse