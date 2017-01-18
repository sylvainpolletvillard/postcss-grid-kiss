/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
	if (!isNaN(str)) return parseFloat(str) + "fr";

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
				return percentage + "fr";
			case "view":
				return "" + percentage + (direction === "vertical" ? "vh" : "vw");
			case "grid":
			default:
				return percentage + "%";
		}
	}

	// `> *length*` or `< *length*`: a minimum or maximum value
	if (str.startsWith("<")) return "minmax(auto, " + parseDimension(str.substring(1), direction) + ")";

	if (str.startsWith(">")) return "minmax(" + parseDimension(str.substring(1), direction) + ", auto)";

	// a range between a minimum and a maximum or `minmax(min, max)`

	var _str$split = str.split("-"),
	    _str$split2 = _slicedToArray(_str$split, 2),
	    min = _str$split2[0],
	    max = _str$split2[1];

	if ([min, max].every(function (dim) {
		return REGEX_DIMENSION.test(dim);
	})) {
		return "minmax(" + parseDimension(min, direction) + ", " + parseDimension(max, direction) + ")";
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

module.exports = { parseDimension: parseDimension, isFillingRemainingSpace: isFillingRemainingSpace };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.range = function (start, end) {
	return [].concat(_toConsumableArray(new Array(end - start).keys())).map(function (i) {
		return i + start;
	});
};

exports.indentMultiline = function (lines, indent) {
	return "\n" + lines.map(function (line) {
		return indent + line;
	}).join("\n");
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("postcss");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var postcss = __webpack_require__(2);

var _require = __webpack_require__(13),
    parse = _require.parse;

var _require2 = __webpack_require__(1),
    indentMultiline = _require2.indentMultiline;

var _require3 = __webpack_require__(4),
    getAlignContent = _require3.getAlignContent;

var _require4 = __webpack_require__(11),
    getJustifyContent = _require4.getJustifyContent;

var _require5 = __webpack_require__(5),
    getAlignSelf = _require5.getAlignSelf;

var _require6 = __webpack_require__(12),
    getJustifySelf = _require6.getJustifySelf;

var _require7 = __webpack_require__(10),
    getGridRows = _require7.getGridRows;

var _require8 = __webpack_require__(9),
    getGridCols = _require8.getGridCols;

var _require9 = __webpack_require__(8),
    getGridAreas = _require9.getGridAreas;

var _require10 = __webpack_require__(7),
    getFallback = _require10.getFallback;

var DEFAULTS_OPTIONS = {
	fallback: false,
	screwIE: false,
	optimizeCalc: true
};

module.exports = function (options) {
	options = Object.assign({}, DEFAULTS_OPTIONS, options);

	return function (css, result) {
		css.walkDecls('grid-kiss', function (decl) {

			var input = parse(decl);
			var grid = { props: new Map(), rule: decl.parent };
			var zones = [];
			var indent = decl.raws.before.match(/.*$/)[0];

			grid.props.set("display", "grid");
			grid.props.set("align-content", getAlignContent(input));
			grid.props.set("justify-content", getJustifyContent(input));
			grid.props.set("grid-template-rows", getGridRows(input));
			grid.props.set("grid-template-columns", getGridCols(input));
			grid.props.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));

			// grid properties
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = grid.props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _slicedToArray(_step.value, 2),
					    prop = _step$value[0],
					    value = _step$value[1];

					if (value != null) {
						decl.cloneBefore({ prop: prop, value: value });
					}
				}

				// zone declarations
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = input.zones.filter(function (zone) {
					return zone.selector != null;
				})[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var zone = _step2.value;

					var props = new Map();

					props.set("grid-area", zone.name);
					props.set("justify-self", getJustifySelf(zone));
					props.set("align-self", getAlignSelf(zone));

					var rule = postcss.rule({
						selector: grid.rule.selector + " > " + zone.selector,
						source: decl.source
					});

					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = props[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _step4$value = _slicedToArray(_step4.value, 2),
							    prop = _step4$value[0],
							    value = _step4$value[1];

							if (value != null) {
								rule.append({ prop: prop, value: value });
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					var _lastRule = zones.length > 0 ? zones[zones.length - 1].rule : grid.rule;
					grid.rule.parent.insertAfter(_lastRule, rule);
					zones.push({ props: props, rule: rule, zone: zone });
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			if (options.fallback) {
				var fallback = getFallback({
					zones: zones, grid: grid, input: input, decl: decl, result: result, options: options
				});

				var supportsRule = postcss.atRule({
					name: "supports",
					params: 'not (grid-template-areas:"test")'
				});

				var ieHackRule = postcss.atRule({
					name: "media",
					params: 'screen and (min-width:0\\0)'
				});

				supportsRule.append(fallback.grid.rule);
				ieHackRule.append(fallback.grid.rule);
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = fallback.zones.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var zoneFallback = _step3.value;

						supportsRule.append(zoneFallback.rule);
						ieHackRule.append(zoneFallback.rule);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				var lastRule = zones.length > 0 ? zones[zones.length - 1].rule : grid.rule;
				if (!options.screwIE) {
					grid.rule.parent.insertAfter(lastRule, ieHackRule);
				}
				grid.rule.parent.insertAfter(lastRule, supportsRule);
			}

			decl.remove();
		});
	};
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.getAlignContent = function (_ref) {
	var rows = _ref.rows;


	var isSpaceRow = function isSpaceRow(row) {
		return (/^\s*$/.test(row)
		);
	},
	    hasSpaceRows = rows.some(isSpaceRow),
	    hasSpaceRowsBeforeContent = isSpaceRow(rows[0]),
	    hasSpaceRowsAfterContent = isSpaceRow(rows[rows.length - 1]),
	    firstContentRowIndex = rows.findIndex(function (row) {
		return !isSpaceRow(row);
	}),
	    lastContentRowIndex = rows.length - 1 - rows.slice().reverse().findIndex(function (row) {
		return !isSpaceRow(row);
	}),
	    hasContent = firstContentRowIndex >= 0 && lastContentRowIndex < rows.length,
	    hasSpaceRowsBetweenContent = hasContent && rows.slice(firstContentRowIndex, lastContentRowIndex).some(isSpaceRow),
	    hasDoubleSpaceRowsBetweenContent = hasContent && rows.slice(firstContentRowIndex, lastContentRowIndex - 1).some(function (row, index, rows) {
		return isSpaceRow(row) && isSpaceRow(rows[index + 1]);
	});

	if (!hasSpaceRows) return "stretch";
	if (hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasDoubleSpaceRowsBetweenContent) return "space-around";
	if (hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasSpaceRowsBetweenContent) return "space-evenly";
	if (hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent) return "center";
	if (hasSpaceRowsBeforeContent) return "end";
	if (hasSpaceRowsAfterContent) return "start";
	if (hasSpaceRowsBetweenContent) return "space-between";
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.getAlignSelf = function (zone) {

	var topIndicator = zone.content.search(/↑|\^/),
	    bottomIndicator = zone.content.search(/↓|[^\w]v[^\w]/);

	if (topIndicator >= 0 && bottomIndicator > topIndicator) return "stretch";
	if (bottomIndicator >= 0 && topIndicator >= bottomIndicator) return "center";
	if (topIndicator >= 0) return "start";
	if (bottomIndicator >= 0) return "end";

	return null;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var reduce = __webpack_require__(14);

var _require = __webpack_require__(0),
    isFillingRemainingSpace = _require.isFillingRemainingSpace;

var shouldOptimizeCalc = void 0;
function enableOptimization(bool) {
	shouldOptimizeCalc = bool;
}
function optimize(expr) {
	return shouldOptimizeCalc ? reduce(expr) : expr;
}

function sum() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var dims = args.filter(function (arg) {
		return arg && arg !== "0";
	});
	return dims.length < 2 ? dims[0] : optimize("calc(" + dims.join(" + ") + ")");
}

function remaining(dim) {
	if (!dim || dim == "0") return "100%";
	return optimize("calc(100% - " + dim + ")");
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
		return optimize("calc(" + remainingSpace + " * " + fr + " / " + totalFr + ")");
	}

	var sumFixed = fixedDims.length == 1 ? fixedDims[0] : sum.apply(undefined, _toConsumableArray(fixedDims));
	if (fr === totalFr) {
		return sum(sumFixed, remainingSpace);
	}

	return sum(sumFixed, "calc(" + remainingSpace + " * " + fr + " / " + totalFr + ")");
}

module.exports = { sum: sum, remaining: remaining, fraction: fraction, optimize: optimize, enableOptimization: enableOptimization };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    isFillingRemainingSpace = _require.isFillingRemainingSpace;

var calc = __webpack_require__(6);

function getFallback(_ref) {
	var zones = _ref.zones,
	    grid = _ref.grid,
	    decl = _ref.decl,
	    result = _ref.result,
	    input = _ref.input,
	    options = _ref.options;

	calc.enableOptimization(options.optimizeCalc);

	var colIndexes = input.colIndexes,
	    rowIndexes = input.rowIndexes;

	var colsDim = input.colsDim.map(function (dim) {
		return dimensionFallback(dim, { decl: decl, result: result });
	});
	var rowsDim = input.rowsDim.map(function (dim) {
		return dimensionFallback(dim, { decl: decl, result: result });
	});

	var fallback = {
		grid: getGridFallback({ colsDim: colsDim, rowsDim: rowsDim, rule: grid.rule, props: grid.props }),
		zones: new Map()
	};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = zones[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var zone = _step.value;

			fallback.zones.set(zone, getZoneFallback({
				zone: zone, grid: grid, colIndexes: colIndexes, rowIndexes: rowIndexes, colsDim: colsDim, rowsDim: rowsDim
			}));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return fallback;
}

function dimensionFallback(dim, _ref2) {
	var decl = _ref2.decl,
	    result = _ref2.result;

	if (dim.startsWith("minmax(")) {
		decl.warn(result, "minmax() operator is not supported in fallback mode. Replaced by 1fr.");
		dim = "1fr";
	}
	if (dim.startsWith("fit-content")) {
		decl.warn(result, "fit-content() operator is not supported in fallback mode. Replaced by 1fr.");
		dim = "1fr";
	}
	return dim;
}

function getGridFallback(_ref3) {
	var rowsDim = _ref3.rowsDim,
	    colsDim = _ref3.colsDim,
	    rule = _ref3.rule;


	var grid = {
		rule: rule.clone({ nodes: [] }),
		props: new Map()
	};

	var gridWidth = colsDim.some(isFillingRemainingSpace) ? "100%" : calc.optimize(calc.sum.apply(calc, _toConsumableArray(colsDim)));
	var gridHeight = rowsDim.some(isFillingRemainingSpace) ? "100%" : calc.optimize(calc.sum.apply(calc, _toConsumableArray(rowsDim)));

	grid.props.set("position", "relative");
	grid.props.set("display", "block");
	grid.props.set("width", gridWidth);
	grid.props.set("height", gridHeight);

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = grid.props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _step2$value = _slicedToArray(_step2.value, 2),
			    prop = _step2$value[0],
			    value = _step2$value[1];

			if (value != null) {
				grid.rule.append({ prop: prop, value: value });
			}
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return grid;
}

function getZoneFallback(_ref4) {
	var _ref4$zone = _ref4.zone,
	    rule = _ref4$zone.rule,
	    props = _ref4$zone.props,
	    zone = _ref4$zone.zone,
	    rowIndexes = _ref4.rowIndexes,
	    colIndexes = _ref4.colIndexes,
	    rowsDim = _ref4.rowsDim,
	    colsDim = _ref4.colsDim,
	    grid = _ref4.grid;


	var fallbackRule = rule.clone({ nodes: [] });
	var fallbackProps = new Map();

	var _getHeight = getHeight({ zone: zone, props: props, rowsDim: rowsDim, rowIndexes: rowIndexes }),
	    height = _getHeight.height,
	    isStretchingVertically = _getHeight.isStretchingVertically;

	var _getWidth = getWidth({ zone: zone, props: props, colsDim: colsDim, colIndexes: colIndexes }),
	    width = _getWidth.width,
	    isStretchingHorizontally = _getWidth.isStretchingHorizontally;

	var _getVerticalOffset = getVerticalOffset({ props: props, zone: zone, grid: grid, rowsDim: rowsDim, rowIndexes: rowIndexes, height: height }),
	    verticalOffset = _getVerticalOffset.verticalOffset,
	    alignByBottom = _getVerticalOffset.alignByBottom;

	var _getHorizontalOffset = getHorizontalOffset({ props: props, zone: zone, grid: grid, colsDim: colsDim, colIndexes: colIndexes, width: width }),
	    horizontalOffset = _getHorizontalOffset.horizontalOffset,
	    alignByRight = _getHorizontalOffset.alignByRight;

	fallbackProps.set("position", "absolute");
	fallbackProps.set("box-sizing", "border-box");
	fallbackProps.set("transform", getTransform({ props: props }));
	fallbackProps.set(isStretchingVertically ? "height" : "max-height", height);
	fallbackProps.set(isStretchingHorizontally ? "width" : "max-width", width);
	fallbackProps.set(alignByBottom ? "bottom" : "top", verticalOffset);
	fallbackProps.set(alignByRight ? "right" : "left", horizontalOffset);

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = fallbackProps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var _step3$value = _slicedToArray(_step3.value, 2),
			    prop = _step3$value[0],
			    value = _step3$value[1];

			if (value != null) {
				fallbackRule.append({ prop: prop, value: value });
			}
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return { props: fallbackProps, rule: fallbackRule };
}

function getVerticalOffset(_ref5) {
	var props = _ref5.props,
	    zone = _ref5.zone,
	    grid = _ref5.grid,
	    rowsDim = _ref5.rowsDim,
	    rowIndexes = _ref5.rowIndexes,
	    height = _ref5.height;


	var alignSelf = props.get("align-self") || "stretch";

	var offsetDims = [],
	    alignByBottom = false,
	    gridDelta = getAlignContentFallbackDelta({ zone: zone, grid: grid, rowsDim: rowsDim, rowIndexes: rowIndexes });

	if (alignSelf === "end") {
		alignByBottom = true;
		var bottomIndex = rowIndexes.findIndex(function (rowIndex) {
			return rowIndex === zone.bottom;
		});
		for (var y = rowIndexes.length - 1; y > bottomIndex; y -= 2) {
			offsetDims.push(rowsDim[Math.floor(y / 2)]);
		}
	} else {
		var topIndex = rowIndexes.findIndex(function (rowIndex) {
			return rowIndex === zone.top;
		});
		for (var _y = 0; _y < topIndex; _y += 2) {
			offsetDims.push(rowsDim[Math.floor(_y / 2)]);
		}
	}

	if (alignByBottom && gridDelta && gridDelta != "0") {
		gridDelta = calc.remaining(gridDelta);
	}

	var offset = calc.sum(gridDelta, calc.fraction(offsetDims, rowsDim), alignSelf === "center" ? "calc(" + height + " / 2)" : "0") || "0";

	return {
		verticalOffset: calc.optimize(offset),
		alignByBottom: alignByBottom
	};
}

function getHorizontalOffset(_ref6) {
	var props = _ref6.props,
	    zone = _ref6.zone,
	    grid = _ref6.grid,
	    colsDim = _ref6.colsDim,
	    colIndexes = _ref6.colIndexes,
	    width = _ref6.width;


	var justifySelf = props.get("justify-self") || "stretch";

	var offsetDims = [],
	    alignByRight = false,
	    gridDelta = getJustifyContentFallbackDelta({ zone: zone, grid: grid, colsDim: colsDim, colIndexes: colIndexes });

	if (justifySelf === "end") {
		alignByRight = true;
		var rightIndex = colIndexes.findIndex(function (colIndex) {
			return colIndex === zone.right;
		});
		for (var x = colIndexes.length - 1; x > rightIndex; x -= 2) {
			offsetDims.push(colsDim[Math.floor(x / 2)]);
		}
	} else {
		var leftIndex = colIndexes.findIndex(function (colIndex) {
			return colIndex === zone.left;
		});
		for (var _x = 0; _x < leftIndex; _x += 2) {
			offsetDims.push(colsDim[Math.floor(_x / 2)]);
		}
	}

	if (alignByRight && gridDelta && gridDelta != "0") {
		gridDelta = calc.remaining(gridDelta);
	}

	var offset = calc.sum(gridDelta, calc.fraction(offsetDims, colsDim), justifySelf === "center" ? "calc(" + width + " / 2)" : "0") || "0";

	return {
		horizontalOffset: calc.optimize(offset),
		alignByRight: alignByRight
	};
}

function getHeight(_ref7) {
	var zone = _ref7.zone,
	    props = _ref7.props,
	    rowsDim = _ref7.rowsDim,
	    rowIndexes = _ref7.rowIndexes;


	var alignSelf = props.get("align-self") || "stretch";

	var dims = [],
	    topIndex = rowIndexes.findIndex(function (rowIndex) {
		return rowIndex === zone.top;
	}),
	    bottomIndex = rowIndexes.findIndex(function (rowIndex) {
		return rowIndex === zone.bottom;
	});

	for (var y = topIndex; y < bottomIndex; y += 2) {
		dims.push(rowsDim[Math.floor(y / 2)]);
	}

	return {
		height: calc.optimize(calc.fraction(dims, rowsDim) || "100%"),
		isStretchingVertically: alignSelf === "stretch"
	};
}

function getWidth(_ref8) {
	var zone = _ref8.zone,
	    props = _ref8.props,
	    colsDim = _ref8.colsDim,
	    colIndexes = _ref8.colIndexes;


	var justifySelf = props.get("justify-self") || "stretch";

	var dims = [],
	    leftIndex = colIndexes.findIndex(function (colIndex) {
		return colIndex === zone.left;
	}),
	    rightIndex = colIndexes.findIndex(function (colIndex) {
		return colIndex === zone.right;
	});
	for (var x = leftIndex; x < rightIndex; x += 2) {
		dims.push(colsDim[Math.floor(x / 2)]);
	}

	return {
		width: calc.optimize(calc.fraction(dims, colsDim) || "100%"),
		isStretchingHorizontally: justifySelf === "stretch"
	};
}

function getTransform(_ref9) {
	var props = _ref9.props;

	var isCenteredVertically = props.get("align-self") === "center";
	var isCenteredHorizontally = props.get("justify-self") === "center";

	if (isCenteredVertically && isCenteredHorizontally) return "translate(-50%,-50%)";
	if (isCenteredVertically) return "translateY(-50%)";
	if (isCenteredHorizontally) return "translateX(-50%)";
}

function getJustifyContentFallbackDelta(_ref10) {
	var zone = _ref10.zone,
	    grid = _ref10.grid,
	    colsDim = _ref10.colsDim,
	    colIndexes = _ref10.colIndexes;


	if (colsDim.some(isFillingRemainingSpace)) return "0"; // fluid zone will fit all the remaining space

	var justifyGrid = grid.props.get("justify-content") || "stretch";

	if (justifyGrid === "stretch") return "0";
	if (justifyGrid === "start") return "0";

	var remainingSpace = calc.remaining(calc.sum.apply(calc, _toConsumableArray(colsDim))),
	    leftIndex = colIndexes.findIndex(function (colIndex) {
		return colIndex === zone.left;
	}),
	    index = Math.floor(leftIndex / 2),
	    nbCols = colsDim.length;

	if (justifyGrid === "end") return remainingSpace;
	if (justifyGrid === "center") return "calc(" + remainingSpace + " / 2)";
	if (justifyGrid === "space-between") return "calc(" + remainingSpace + " * " + index + " / " + (nbCols - 1) + ")";
	if (justifyGrid === "space-around") return "calc(" + remainingSpace + " * " + (index * 2 + 1) + " / " + nbCols * 2 + ")";
	if (justifyGrid === "space-evenly") return "calc(" + remainingSpace + " * " + (index + 1) + " / " + (nbCols + 1) + ")";
}

function getAlignContentFallbackDelta(_ref11) {
	var zone = _ref11.zone,
	    grid = _ref11.grid,
	    rowsDim = _ref11.rowsDim,
	    rowIndexes = _ref11.rowIndexes;


	if (rowsDim.some(isFillingRemainingSpace)) return "0"; // fluid zone will fit all the remaining space

	var alignGrid = grid.props.get("align-content") || "stretch";

	if (alignGrid === "stretch") return "0";
	if (alignGrid === "start") return "0";

	var remainingSpace = calc.remaining(calc.sum.apply(calc, _toConsumableArray(rowsDim))),
	    topIndex = rowIndexes.findIndex(function (rowIndex) {
		return rowIndex === zone.top;
	}),
	    index = Math.floor(topIndex / 2),
	    nbRows = rowsDim.length;

	if (alignGrid === "end") return remainingSpace;
	if (alignGrid === "center") return "calc(" + remainingSpace + " / 2)";
	if (alignGrid === "space-between") return "calc(" + remainingSpace + " * " + index + " / " + (nbRows - 1) + ")";
	if (alignGrid === "space-around") return "calc(" + remainingSpace + " * " + (index * 2 + 1) + " / " + nbRows * 2 + ")";
	if (alignGrid === "space-evenly") return "calc(" + remainingSpace + " * " + (index + 1) + " / " + (nbRows + 1) + ")";
}

module.exports = { getFallback: getFallback, getZoneFallback: getZoneFallback, getGridFallback: getGridFallback };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.getGridAreas = function (_ref) {
	var zones = _ref.zones,
	    rowIndexes = _ref.rowIndexes,
	    colIndexes = _ref.colIndexes;


	var areaNames = [];

	var _loop = function _loop(y) {
		areaNames[y] = [];

		var _loop2 = function _loop2(_x) {
			var currentZone = zones.find(function (zone) {
				return rowIndexes[2 * y] >= zone.top && rowIndexes[2 * y + 1] <= zone.bottom && colIndexes[2 * _x] >= zone.left && colIndexes[2 * _x + 1] <= zone.right;
			});
			if (currentZone) {
				areaNames[y][_x] = currentZone.name || "...";
			} else {
				// gap
				areaNames[y][_x] = "...";
				zones.push({
					isGap: true,
					top: rowIndexes[2 * y], bottom: rowIndexes[2 * y + 1],
					left: colIndexes[2 * _x], right: colIndexes[2 * _x + 1]
				});
			}
		};

		for (var _x = 0; _x < colIndexes.length / 2; _x++) {
			_loop2(_x);
		}
	};

	for (var y = 0; y < rowIndexes.length / 2; y++) {
		_loop(y);
	}

	var longestNameLengthByCol = [];
	for (var _y = 0; _y < areaNames.length; _y++) {
		for (var x = 0; x < areaNames[_y].length; x++) {
			if (!(x in longestNameLengthByCol)) longestNameLengthByCol[x] = 0;
			var nameLength = areaNames[_y][x].length;
			if (nameLength > longestNameLengthByCol[x]) {
				longestNameLengthByCol[x] = nameLength;
			}
		}
	}

	return areaNames.map(function (row) {
		return "\"" + row.map(function (name, x) {
			return (name + " ".repeat(longestNameLengthByCol[x])).slice(0, longestNameLengthByCol[x]);
		}).join(" ") + "\"";
	});
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    parseDimension = _require.parseDimension;

exports.getGridCols = function (input) {
	var decl = input.decl,
	    rows = input.rows,
	    zones = input.zones,
	    colIndexes = input.colIndexes,
	    rowIndexes = input.rowIndexes;

	var gridCols = new Array(Math.floor(colIndexes.length / 2)).fill("1fr"); // autofill by default

	// match border content
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = zones[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var zone = _step.value;
			var _arr = ["top", "bottom"];

			for (var _i = 0; _i < _arr.length; _i++) {
				var side = _arr[_i];
				var borderContent = cleanupDimInput(rows[zone[side]].substring(zone.left, zone.right)),
				    colIndexLeft = colIndexes.indexOf(zone.left),
				    colIndexRight = colIndexes.indexOf(zone.right),
				    _colDim = parseDimension(borderContent, "horizontal");

				if (_colDim != null) {
					if (colIndexRight === colIndexLeft + 1) {
						gridCols[Math.floor(colIndexLeft / 2)] = _colDim;
					} else {
						throw decl.error("You cannot specify the width of a zone occupying more than one column.", { plugin: 'postcss-mixins' });
					}
				}
			}
		}

		// check the last row
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var lastRow = rows[rowIndexes.slice(-1)[0] + 1];
	if (lastRow) {
		for (var x = 0; x < gridCols.length; x++) {
			var content = cleanupDimInput(lastRow.substring(colIndexes[2 * x], colIndexes[2 * x + 1] + 1)),
			    colDim = parseDimension(content, "horizontal");

			if (colDim != null) {
				gridCols[x] = colDim;
			}
		}

		// check horizontal gaps
		for (var _x = 0; _x < colIndexes.length - 2; _x += 2) {
			var left = colIndexes[_x + 1] + 1,
			    right = colIndexes[_x + 2] - 1;

			var gapDimensionInfo = cleanupDimInput(lastRow.substring(left, right)),
			    gapDim = parseDimension(gapDimensionInfo, "horizontal");

			if (gapDim != null) {
				// horizontal gap detected
				gridCols.splice(Math.floor(_x / 2) + 1, 0, gapDim);
				colIndexes.splice(_x + 2, 0, left, right);
				_x += 2;
			}
		}
	}

	input.colsDim = gridCols;
	return gridCols.join(" ");
};

function cleanupDimInput(input) {
	return input.replace(/[^a-zA-Z0-9()\-\s%,<>]/g, "") // remove anything that is not part of a dimension value
	.replace(/^-+|-+$/g, ""); // remove remaining '-' segments but preserve range dimensions
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    parseDimension = _require.parseDimension;

exports.getGridRows = function (input) {
	var rows = input.rows,
	    colIndexes = input.colIndexes,
	    rowIndexes = input.rowIndexes,
	    gridRows = [];


	for (var y = 0; y < rowIndexes.length; y += 2) {
		var dimension = parseDimension(getRowDimInfo({
			rows: rows, colIndexes: colIndexes,
			from: rowIndexes[y] + 1,
			to: rowIndexes[y + 1] - 1
		}), "vertical");

		if (dimension === null) dimension = "1fr";
		gridRows.push(dimension);
	}

	// check vertical gaps
	for (var _y = 0; _y < rowIndexes.length - 2; _y += 2) {
		var top = rowIndexes[_y + 1] + 1,
		    bottom = rowIndexes[_y + 2] - 1,
		    gapDimension = parseDimension(getRowDimInfo({ rows: rows, colIndexes: colIndexes, from: top, to: bottom }), "vertical");

		if (gapDimension != null) {
			// vertical gap detected
			gridRows.splice(Math.floor(_y / 2) + 1, 0, gapDimension);
			rowIndexes.splice(_y + 2, 0, top, bottom);
			_y += 2;
		}
	}

	input.rowsDim = gridRows;
	return gridRows.join(" ");
};

function getRowDimInfo(_ref) {
	var rows = _ref.rows,
	    colIndexes = _ref.colIndexes,
	    from = _ref.from,
	    to = _ref.to;

	var lastContentColIndex = colIndexes.slice(-1)[0];
	return rows.slice(from, to + 1).map(function (row) {
		return row.substring(lastContentColIndex + 1);
	}).join(" ");
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    range = _require.range;

exports.getJustifyContent = function (_ref) {
	var cols = _ref.cols;


	var isSpaceCol = function isSpaceCol(col) {
		return (/^\s*$/.test(col)
		);
	},
	    hasSpaceCols = cols.some(isSpaceCol),
	    hasSpaceColsBeforeContent = isSpaceCol(cols[0]) && isSpaceCol(cols[1]),
	    hasSpaceRowsAfterContent = isSpaceCol(cols[cols.length - 1]) && isSpaceCol(cols[cols.length - 2]),
	    firstContentColIndex = cols.findIndex(function (col) {
		return !isSpaceCol(col);
	}),
	    lastContentColIndex = cols.length - 1 - cols.slice().reverse().findIndex(function (col) {
		return !isSpaceCol(col);
	}),
	    hasContent = firstContentColIndex >= 0 && lastContentColIndex < cols.length,
	    hasSpaceColsBetweenContent = hasContent && cols.slice(firstContentColIndex, lastContentColIndex - 1).some(function (col, index, cols) {
		return isSpaceCol(col) && isSpaceCol(cols[index + 1]);
	}),
	    hasDoubleSpaceColsBetweenContent = hasContent && cols.slice(firstContentColIndex, lastContentColIndex - 3).some(function (col, index, cols) {
		return isSpaceCol(col) && range(1, 4).every(function (i) {
			return isSpaceCol(cols[index + i]);
		});
	});

	if (!hasSpaceCols) return "stretch";
	if (hasDoubleSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent) return "space-around";
	if (hasSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent) return "space-evenly";
	if (hasSpaceColsBetweenContent && !hasSpaceColsBeforeContent && !hasSpaceRowsAfterContent) return "space-between";
	if (hasSpaceColsBeforeContent && hasSpaceRowsAfterContent) return "center";
	if (hasSpaceColsBeforeContent) return "end";
	if (hasSpaceRowsAfterContent) return "start";
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.getJustifySelf = function (zone) {

	var leftIndicator = zone.content.search(/←|</),
	    rightIndicator = zone.content.search(/→|>/);

	if (leftIndicator >= 0 && rightIndicator > leftIndicator) return "stretch";
	if (rightIndicator >= 0 && leftIndicator > rightIndicator) return "center";
	if (leftIndicator >= 0) return "start";
	if (rightIndicator >= 0) return "end";

	return null;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(1),
    range = _require.range;

var CORNERS_CHARS = /[+┌┐└┘╔╗╚╝]/;

function parse(decl) {
	var rows = getRows(decl.value),
	    cols = getCols({ rows: rows }),
	    _getCorners = getCorners({ rows: rows }),
	    colIndexes = _getCorners.colIndexes,
	    rowIndexes = _getCorners.rowIndexes,
	    zones = getZones({ rows: rows, cols: cols, colIndexes: colIndexes, rowIndexes: rowIndexes });


	return {
		decl: decl, rows: rows, cols: cols, zones: zones, rowIndexes: rowIndexes, colIndexes: colIndexes
	};
}

function getRows(str) {
	return str.match(/".*"/g).map(function (row) {
		return row.slice(1, row.length - 1);
	});
}

function getCols(_ref) {
	var rows = _ref.rows;

	var colsLength = rows.reduce(function (min, row) {
		return row.length < min ? row.length : min;
	}, Math.pow(2, 31) - 1);
	return range(0, colsLength).map(function (x) {
		return rows.map(function (row) {
			return row[x];
		}).join('');
	});
}

function getCorners(_ref2) {
	var rows = _ref2.rows;

	var colIndexes = new Set(),
	    rowIndexes = new Set();
	rows.forEach(function (row, rowIndex) {
		row.split('').forEach(function (char, colIndex) {
			if (CORNERS_CHARS.test(char)) {
				colIndexes.add(colIndex);
				rowIndexes.add(rowIndex);
			}
		});
	});

	colIndexes = Array.from(colIndexes).sort(function (a, b) {
		return a - b;
	});
	rowIndexes = Array.from(rowIndexes).sort(function (a, b) {
		return a - b;
	});

	return { colIndexes: colIndexes, rowIndexes: rowIndexes };
}

function getZones(_ref3) {
	var rows = _ref3.rows,
	    cols = _ref3.cols,
	    colIndexes = _ref3.colIndexes,
	    rowIndexes = _ref3.rowIndexes;

	var zones = [];

	for (var y = 0; y < rowIndexes.length; y += 2) {
		var _loop = function _loop(x) {
			var top = rowIndexes[y],
			    left = colIndexes[x],
			    zone = { top: top, left: left };

			if (!isInZone({ zones: zones, x: left, y: top }) && x + 1 in colIndexes && y + 1 in rowIndexes) {
				(function () {

					var bottom = void 0,
					    right = void 0;

					if (CORNERS_CHARS.test(rows[top][left])) {
						// a zone starts here, see how far if goes
						bottom = cols[left].slice(top + 1).search(CORNERS_CHARS) + top + 1;
						right = rows[top].slice(left + 1).search(CORNERS_CHARS) + left + 1;
					} else {
						zone.isHole = true; // no zone found, presumed as hole
						bottom = rowIndexes[y + 1];
						right = colIndexes[x + 1];
					}

					zone.bottom = bottom;
					zone.right = right;
					zone.content = rows.slice(top + 1, bottom).map(function (row) {
						return row.substring(left + 1, right);
					}).join(" ");
					zone.selector = zone.content.replace(/[^\w]v[^\w]|[^\w#.\[\]]/g, "") || null;
					zone.name = getZoneName({ zone: zone, zones: zones });

					zones.push(zone);
				})();
			}
		};

		for (var x = 0; x < colIndexes.length; x += 2) {
			_loop(x);
		}
	}

	return zones;
}

function getZoneName(_ref4) {
	var zone = _ref4.zone,
	    zones = _ref4.zones;

	if (!zone.selector) return null;

	var zoneNames = new Set(zones.map(function (z) {
		return z.name;
	})),
	    zoneSelectors = new Set(zones.map(function (z) {
		return z.selector;
	})),
	    zoneNamesBySelector = new Map([].concat(_toConsumableArray(zoneSelectors)).map(function (selector) {
		return [selector, zones.find(function (z) {
			return z.selector === selector;
		}).name];
	}));

	if (zoneNamesBySelector.has(zone.selector)) {
		return zoneNamesBySelector.get(zone.selector);
	}

	var baseName = zone.selector.replace(/(\w)([#.\[])/g, "$1_") // .foo#bar.baz[qux] => .foo_bar_baz_qux]
	.replace(/[^\w]/g, ""); // .foo_bar_baz_qux] => foo_baz_baz_qux

	var aliasNum = 1,
	    name = baseName;

	while (zoneNames.has(name)) {
		name = baseName + aliasNum;
		aliasNum++;
	}

	zoneNames.add(name);
	zoneNamesBySelector.set(zone.selector, name);
	return name;
}

function isInZone(_ref5) {
	var zones = _ref5.zones,
	    x = _ref5.x,
	    y = _ref5.y;

	return zones.some(function (zone) {
		return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
	});
}

module.exports = { parse: parse, getRows: getRows, getCols: getCols, getCorners: getCorners, getZones: getZones, getZoneName: getZoneName, isInZone: isInZone };

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("reduce-css-calc");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const
	postcss = __webpack_require__(2),
	main    = __webpack_require__(3);

module.exports = postcss.plugin('postcss-grid-kiss', main);

/***/ })
/******/ ]);