function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var reduceCSSCalc = require('reduce-css-calc');

var _require = require("./dimension"),
    isFillingRemainingSpace = _require.isFillingRemainingSpace;

function sum() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var dims = args.filter(function (arg) {
		return arg && arg !== "0";
	});
	if (dims.length === 0) return '0';
	if (dims.length === 1) return dims[0];
	return reduceCSSCalc(`calc(${dims.join(" + ")})`);
}

function remaining(dim) {
	if (!dim || dim === "0") return "100%";
	return reduceCSSCalc(`calc(100% - ${dim})`);
}

function fraction(dims, allDims) {
	if (dims.length === 0 || dims.length === allDims.length) return null; // use default value

	if (dims.length === 1 && !isFillingRemainingSpace(dims[0])) return dims[0];

	if (dims.every(function (dim) {
		return !isFillingRemainingSpace(dim);
	})) // all fixed
		return sum.apply(undefined, _toConsumableArray(dims));

	var fr = dims.reduce(function (total, dim) {
		return isFillingRemainingSpace(dim) ? total + parseInt(dim) : total;
	}, 0),
	    totalFr = allDims.reduce(function (total, dim) {
		return isFillingRemainingSpace(dim) ? total + parseInt(dim) : total;
	}, 0),
	    allFixedDims = allDims.filter(function (dim) {
		return !isFillingRemainingSpace(dim);
	}),
	    fixedDims = dims.filter(function (dim) {
		return !isFillingRemainingSpace(dim);
	}),
	    remainingSpace = remaining(allFixedDims.join(" - "));

	if (fixedDims.length === 0) {
		// all relative
		if (fr === totalFr) {
			return remainingSpace;
		}
		return reduceCSSCalc(`calc(${remainingSpace} * ${fr} / ${totalFr})`);
	}

	var sumFixed = fixedDims.length === 1 ? fixedDims[0] : sum.apply(undefined, _toConsumableArray(fixedDims));
	if (fr === totalFr) {
		return sum(sumFixed, remainingSpace);
	}

	return sum(sumFixed, `calc(${remainingSpace} * ${fr} / ${totalFr})`);
}

module.exports = { sum, remaining, fraction };