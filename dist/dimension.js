var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var REGEX_LENGTH = /^(\d+(?:\.\d+)?)([a-z]{1,4})$/,
    REGEX_PERCENT = /^(\d+(?:\.\d+)?)%\s*(free|grid|view)?$/,
    REGEX_DIMENSION = /(\d+(?:\.\d+)?)%?\s*([a-z]{1,4})/,
    REGEX_CALC = /^calc\((.*)\)$/;

function parseDimension(str, direction) {

	str = str.trim();

	// when no value is specified, row and column sizes are set as `auto`
	if (str.length === 0) return null;

	if (str === "auto") return "1fr";

	// non-negative number representing a fraction of the free space in the grid container
	if (!isNaN(str)) return `${parseFloat(str)}fr`;

	if (REGEX_LENGTH.test(str)) return str;

	// calc() expression
	if (REGEX_CALC.test(str)) return str;

	if (REGEX_PERCENT.test(str)) {
		var _str$match = str.match(REGEX_PERCENT),
		    _str$match2 = _slicedToArray(_str$match, 3),
		    percentage = _str$match2[1],
		    referential = _str$match2[2];

		switch (referential) {
			case "free":
				return `${percentage}fr`;
			case "view":
				return `${percentage}${direction === "vertical" ? "vh" : "vw"}`;
			case "grid":
			default:
				return `${percentage}%`;
		}
	}

	// `> *length*` or `< *length*`: a minimum or maximum value
	if (str.startsWith("<")) return `minmax(auto, ${parseDimension(str.substring(1), direction)})`;

	if (str.startsWith(">")) return `minmax(${parseDimension(str.substring(1), direction)}, auto)`;

	// a range between a minimum and a maximum or `minmax(min, max)`

	var _str$split = str.split("-"),
	    _str$split2 = _slicedToArray(_str$split, 2),
	    min = _str$split2[0],
	    max = _str$split2[1];

	if ([min, max].every(function (dim) {
		return REGEX_DIMENSION.test(dim);
	})) {
		return `minmax(${parseDimension(min, direction)}, ${parseDimension(max, direction)})`;
	}

	// a keyword representing the largest maximal content contribution of the grid items occupying the grid track
	if (str === "max" || str === "max-content") return "max-content";

	// a keyword representing the largest minimal content contribution of the grid items occupying the grid track
	if (str === "min" || str === "min-content") return "min-content";

	// a keyword representing the formula min(max-content, max(auto, *length*)),
	// which is calculated similar to auto (i.e. minmax(auto, max-content)),
	// except that the track size is clamped at argument *length* if it is greater than the auto minimum.

	if (str.startsWith("fit")) return str.replace(/fit (.*)$/, "fit-content($1)");

	return null;
}

function isFillingRemainingSpace(dim) {
	return dim.endsWith("fr");
}

module.exports = { parseDimension, isFillingRemainingSpace };