const { parseDimension } = require("./dimension");

module.exports = function getGridRows({ rows, colIndexes, rowIndexes }){

	const rowDims = [];

	for(let y=0; y<rowIndexes.length; y+=2) {
		let dimension = parseDimension(getRowDimInfo({
			rows, colIndexes,
			from: rowIndexes[y] + 1,
			to: rowIndexes[y+1] - 1
		}), "vertical");

		if (dimension === null) dimension = "1fr";
		rowDims.push(dimension);
	}

	// check vertical gaps
	for(let y=0; y<rowIndexes.length-2; y+=2) {
		const
			top = rowIndexes[y+1]+1,
		    bottom = rowIndexes[y+2]-1,
			gapInput = getRowDimInfo({ rows, colIndexes, from: top, to: bottom }),
		    gapDim = parseDimension(gapInput, "vertical");

		if(gapDim != null){ // vertical gap detected
			rowDims.splice(Math.floor(y/2)+1, 0, gapDim);
			rowIndexes.splice(y+2, 0, top, bottom);
			y+=2;
		}
	}

	return rowDims;
}

function getRowDimInfo({ rows, colIndexes, from, to }){
	const lastContentColIndex = colIndexes.slice(-1)[0];
	return rows
		.slice(from, to+1)
		.map(row => row.substring(lastContentColIndex + 1))
		.join(" ");
}