var _require = require("./dimension"),
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
						throw decl.error(`You cannot specify the width of a zone occupying more than one column.`, { plugin: 'postcss-mixins' });
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
	return input.replace(/[^a-zA-Z0-9()\-+/*\s%,<>]/g, "") // remove anything that is not part of a dimension value
	.replace(/^[-+\s]+|[-+\s]+$/g, ""); // remove remaining '-' '+' segments but preserve range dimensions
}