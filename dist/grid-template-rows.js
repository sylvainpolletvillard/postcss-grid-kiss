var _require = require("./dimension"),
    parseDimension = _require.parseDimension;

exports.getGridRows = function (input) {
	var rows = input.rows,
	    colIndexes = input.colIndexes,
	    rowIndexes = input.rowIndexes,
	    gridRows = [];


	for (var y = 0; y < rowIndexes.length; y += 2) {
		var dimension = parseDimension(getRowDimInfo({
			rows, colIndexes,
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
		    gapDimension = parseDimension(getRowDimInfo({ rows, colIndexes, from: top, to: bottom }), "vertical");

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