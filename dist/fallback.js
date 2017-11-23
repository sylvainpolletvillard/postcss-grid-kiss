var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var reduceCSSCalc = require('reduce-css-calc');

var _require = require("./dimension"),
    isFillingRemainingSpace = _require.isFillingRemainingSpace;

var calc = require("./calc-utils");

function getFallback(_ref) {
	var zones = _ref.zones,
	    grid = _ref.grid,
	    decl = _ref.decl,
	    result = _ref.result,
	    input = _ref.input;
	var colIndexes = input.colIndexes,
	    rowIndexes = input.rowIndexes;

	var colsDim = input.colsDim.map(function (dim) {
		return dimensionFallback(dim, { decl, result });
	});
	var rowsDim = input.rowsDim.map(function (dim) {
		return dimensionFallback(dim, { decl, result });
	});

	var fallback = {
		grid: getGridFallback({ colsDim, rowsDim, rule: grid.rule, props: grid.props }),
		zones: new Map()
	};

	var zonesCommonRule = grid.rule.clone({
		selector: grid.rule.selector + ' > *',
		nodes: []
	});
	zonesCommonRule.append({ prop: "position", value: "absolute" });
	zonesCommonRule.append({ prop: "box-sizing", value: "border-box" });
	fallback.zones.set('*', { rule: zonesCommonRule });

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = zones[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var zone = _step.value;

			fallback.zones.set(zone, getZoneFallback({
				zone, grid, colIndexes, rowIndexes, colsDim, rowsDim
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

	if (dim === "max-content" || dim === "min-content" || dim.startsWith("minmax(") || dim.startsWith("fit-content")) {
		decl.warn(result, dim + " operator is not supported in fallback mode. Replaced by 1fr.");
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

	var gridWidth = colsDim.some(isFillingRemainingSpace) ? "100%" : reduceCSSCalc(calc.sum.apply(calc, _toConsumableArray(colsDim)));
	var gridHeight = rowsDim.some(isFillingRemainingSpace) ? "100%" : reduceCSSCalc(calc.sum.apply(calc, _toConsumableArray(rowsDim)));

	grid.props.set("position", "relative");
	grid.props.set("display", "block");
	grid.props.set("width", gridWidth);
	grid.props.set("height", gridHeight);

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = grid.props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _ref4 = _step2.value;

			var _ref5 = _slicedToArray(_ref4, 2);

			var prop = _ref5[0];
			var value = _ref5[1];

			if (value != null) {
				grid.rule.append({ prop, value });
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

function getZoneFallback(_ref6) {
	var _ref6$zone = _ref6.zone,
	    rule = _ref6$zone.rule,
	    props = _ref6$zone.props,
	    zone = _ref6$zone.zone,
	    rowIndexes = _ref6.rowIndexes,
	    colIndexes = _ref6.colIndexes,
	    rowsDim = _ref6.rowsDim,
	    colsDim = _ref6.colsDim,
	    grid = _ref6.grid;


	var fallbackRule = rule.clone({ nodes: [] });
	var fallbackProps = new Map();

	var _getHeight = getHeight({ zone, props, rowsDim, rowIndexes }),
	    height = _getHeight.height,
	    isStretchingVertically = _getHeight.isStretchingVertically;

	var _getWidth = getWidth({ zone, props, colsDim, colIndexes }),
	    width = _getWidth.width,
	    isStretchingHorizontally = _getWidth.isStretchingHorizontally;

	var _getVerticalOffset = getVerticalOffset({ props, zone, grid, rowsDim, rowIndexes, height }),
	    verticalOffset = _getVerticalOffset.verticalOffset,
	    alignByBottom = _getVerticalOffset.alignByBottom;

	var _getHorizontalOffset = getHorizontalOffset({ props, zone, grid, colsDim, colIndexes, width }),
	    horizontalOffset = _getHorizontalOffset.horizontalOffset,
	    alignByRight = _getHorizontalOffset.alignByRight;

	fallbackProps.set("transform", getTransform({ props }));
	fallbackProps.set(isStretchingVertically ? "height" : "max-height", height);
	fallbackProps.set(isStretchingHorizontally ? "width" : "max-width", width);
	fallbackProps.set(alignByBottom ? "bottom" : "top", verticalOffset);
	fallbackProps.set(alignByRight ? "right" : "left", horizontalOffset);

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = fallbackProps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var _ref7 = _step3.value;

			var _ref8 = _slicedToArray(_ref7, 2);

			var prop = _ref8[0];
			var value = _ref8[1];

			if (value != null) {
				fallbackRule.append({ prop, value });
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

function getVerticalOffset(_ref9) {
	var props = _ref9.props,
	    zone = _ref9.zone,
	    grid = _ref9.grid,
	    rowsDim = _ref9.rowsDim,
	    rowIndexes = _ref9.rowIndexes,
	    height = _ref9.height;


	var alignSelf = props.get("align-self") || "stretch";

	var offsetDims = [],
	    alignByBottom = false,
	    gridDelta = getAlignContentFallbackDelta({ zone, grid, rowsDim, rowIndexes });

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

	if (alignByBottom && gridDelta && gridDelta !== "0") {
		gridDelta = calc.remaining(gridDelta);
	}

	var offset = calc.sum(gridDelta, calc.fraction(offsetDims, rowsDim), alignSelf === "center" ? `calc(${height} / 2)` : "0") || "0";

	return {
		verticalOffset: reduceCSSCalc(offset),
		alignByBottom
	};
}

function getHorizontalOffset(_ref10) {
	var props = _ref10.props,
	    zone = _ref10.zone,
	    grid = _ref10.grid,
	    colsDim = _ref10.colsDim,
	    colIndexes = _ref10.colIndexes,
	    width = _ref10.width;


	var justifySelf = props.get("justify-self") || "stretch";

	var offsetDims = [],
	    alignByRight = false,
	    gridDelta = getJustifyContentFallbackDelta({ zone, grid, colsDim, colIndexes });

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

	var offset = calc.sum(gridDelta, calc.fraction(offsetDims, colsDim), justifySelf === "center" ? `calc(${width} / 2)` : "0") || "0";

	return {
		horizontalOffset: reduceCSSCalc(offset),
		alignByRight
	};
}

function getHeight(_ref11) {
	var zone = _ref11.zone,
	    props = _ref11.props,
	    rowsDim = _ref11.rowsDim,
	    rowIndexes = _ref11.rowIndexes;


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
		height: reduceCSSCalc(calc.fraction(dims, rowsDim) || "100%"),
		isStretchingVertically: alignSelf === "stretch"
	};
}

function getWidth(_ref12) {
	var zone = _ref12.zone,
	    props = _ref12.props,
	    colsDim = _ref12.colsDim,
	    colIndexes = _ref12.colIndexes;


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
		width: reduceCSSCalc(calc.fraction(dims, colsDim) || "100%"),
		isStretchingHorizontally: justifySelf === "stretch"
	};
}

function getTransform(_ref13) {
	var props = _ref13.props;

	var isCenteredVertically = props.get("align-self") === "center";
	var isCenteredHorizontally = props.get("justify-self") === "center";

	if (isCenteredVertically && isCenteredHorizontally) return "translate(-50%,-50%)";
	if (isCenteredVertically) return "translateY(-50%)";
	if (isCenteredHorizontally) return "translateX(-50%)";
}

function getJustifyContentFallbackDelta(_ref14) {
	var zone = _ref14.zone,
	    grid = _ref14.grid,
	    colsDim = _ref14.colsDim,
	    colIndexes = _ref14.colIndexes;


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
	if (justifyGrid === "center") return `calc(${remainingSpace} / 2)`;
	if (justifyGrid === "space-between") return `calc(${remainingSpace} * ${index} / ${nbCols - 1})`;
	if (justifyGrid === "space-around") return `calc(${remainingSpace} * ${index * 2 + 1} / ${nbCols * 2})`;
	if (justifyGrid === "space-evenly") return `calc(${remainingSpace} * ${index + 1} / ${nbCols + 1})`;
}

function getAlignContentFallbackDelta(_ref15) {
	var zone = _ref15.zone,
	    grid = _ref15.grid,
	    rowsDim = _ref15.rowsDim,
	    rowIndexes = _ref15.rowIndexes;


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
	if (alignGrid === "center") return `calc(${remainingSpace} / 2)`;
	if (alignGrid === "space-between") return `calc(${remainingSpace} * ${index} / ${nbRows - 1})`;
	if (alignGrid === "space-around") return `calc(${remainingSpace} * ${index * 2 + 1} / ${nbRows * 2})`;
	if (alignGrid === "space-evenly") return `calc(${remainingSpace} * ${index + 1} / ${nbRows + 1})`;
}

module.exports = { getFallback, getZoneFallback, getGridFallback };