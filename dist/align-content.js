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