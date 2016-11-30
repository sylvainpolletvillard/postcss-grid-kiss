const {range} = require("./utils");

exports.getJustifyContent = function({ cols }) {

	const
		isSpaceCol = col => /^\s*$/.test(col),

		hasSpaceCols = cols.some(isSpaceCol),

		hasSpaceColsBeforeContent = isSpaceCol(cols[0]) && isSpaceCol(cols[1]),

		hasSpaceRowsAfterContent = isSpaceCol(cols[cols.length-1]) && isSpaceCol(cols[cols.length-2]),

		firstContentColIndex = cols.findIndex(col => !isSpaceCol(col)),

		lastContentColIndex = cols.length - 1 - cols.slice().reverse().findIndex(col => !isSpaceCol(col)),

		hasContent = firstContentColIndex >= 0 && lastContentColIndex < cols.length,

	    hasSpaceColsBetweenContent = hasContent
		    && cols
			    .slice(firstContentColIndex, lastContentColIndex-1)
			    .some((col, index, cols) => isSpaceCol(col) && isSpaceCol(cols[index+1])),

		hasDoubleSpaceColsBetweenContent = hasContent
			&& cols
				.slice(firstContentColIndex, lastContentColIndex-3)
				.some((col, index, cols) => isSpaceCol(col) && range(1,4).every(i => isSpaceCol(cols[index+i])))


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