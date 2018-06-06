const { findLastIndex } = require("./utils");

module.exports = function getJustifyContent({ cols }) {

	const
		isSpaceCol = col => /^\s*$/.test(col),
		isContentCol = col => !isSpaceCol(col),

		firstContentColIndex = cols.findIndex(isContentCol),
		lastContentColIndex = findLastIndex(cols, isContentCol),

		hasContent = firstContentColIndex >= 0 && lastContentColIndex < cols.length,

		hasSpaceCols = cols.some(isSpaceCol),
		hasSpaceColsBeforeContent = isSpaceCol(cols[0]) && isSpaceCol(cols[1]),
		hasSpaceRowsAfterContent = isSpaceCol(cols[cols.length-1]) && isSpaceCol(cols[cols.length-2]),

		hasSpaceColsBetweenContent = hasContent
		    && cols
			    .slice(firstContentColIndex, lastContentColIndex-1)
			    .some((col, index, cols) => isSpaceCol(col) && isSpaceCol(cols[index+1])),

		hasDoubleSpaceColsBetweenContent = hasContent
			&& cols
				.slice(firstContentColIndex, lastContentColIndex-3)
				.some((col, index, cols) => [0,1,2,3].every(i => isSpaceCol(cols[index+i])))


	if(!hasSpaceCols)
		return "stretch"
	if(hasDoubleSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
		return "space-around"
	if(hasSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
		return "space-evenly"
	if(hasSpaceColsBetweenContent && !hasSpaceColsBeforeContent && !hasSpaceRowsAfterContent)
		return "space-between"
	if(hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
		return "center"
	if(hasSpaceColsBeforeContent)
		return "end"
	if(hasSpaceRowsAfterContent)
		return "start"

}