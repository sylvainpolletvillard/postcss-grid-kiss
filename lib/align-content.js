const { findLastIndex } = require("./utils");

module.exports = function getAlignContent({ rows }){

	const
		isSpaceRow = row => /^\s*$/.test(row),

		firstContentRowIndex = rows.findIndex(row => !isSpaceRow(row)),
		lastContentRowIndex  = findLastIndex(rows, row => !isSpaceRow(row)),

		hasContent = firstContentRowIndex >= 0 && lastContentRowIndex < rows.length,

		hasSpaceRows              = rows.some(isSpaceRow),
		hasSpaceRowsBeforeContent = isSpaceRow(rows[0]),
		hasSpaceRowsAfterContent  = isSpaceRow(rows[rows.length - 1]),

		hasSpaceRowsBetweenContent = hasContent
			&& rows.slice(firstContentRowIndex, lastContentRowIndex).some(isSpaceRow),

		hasDoubleSpaceRowsBetweenContent = hasContent
			&& rows
				.slice(firstContentRowIndex, lastContentRowIndex-1)
				.some((row, index, rows) => isSpaceRow(row) && isSpaceRow(rows[index+1]));

	if(!hasSpaceRows)
		return "stretch"
	if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasDoubleSpaceRowsBetweenContent)
		return "space-around"
	if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasSpaceRowsBetweenContent)
		return "space-evenly"
	if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent)
		return "center"
	if(hasSpaceRowsBeforeContent)
		return "end"
	if(hasSpaceRowsAfterContent)
		return "start"
	if(hasSpaceRowsBetweenContent)
		return "space-between"

}