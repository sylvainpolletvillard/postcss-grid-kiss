var _require = require("./utils"),
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