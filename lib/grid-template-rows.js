const { parseDimension, cleanupDimInput } = require("./dimension");

module.exports = function getGridRows({ rows, colIndexes, rowIndexes }){

	const rowDims = [];

	for(let y=0; y < rowIndexes.length; y+=2) {
		let dimension = getRowDim({
			rows, colIndexes,
			from: rowIndexes[y],
			to: rowIndexes[y + 1]
		});

		if (dimension === null){ dimension = "1fr"; }
		rowDims.push(dimension);
	}

	// check vertical gaps
	for(let y=0; y<rowIndexes.length-2; y+=2) {
		const
			top    = rowIndexes[y+1] + 1,
		    bottom = rowIndexes[y+2] - 1,
			gapDim = getRowDim({ rows, colIndexes, from: top, to: bottom });

		if(gapDim != null){ // vertical gap detected
			rowDims.splice(Math.floor(y/2)+1, 0, gapDim);
			rowIndexes.splice(y+2, 0, top, bottom);
			y+=2;
		}
	}

	return rowDims;
}

function getRowDim({ rows, colIndexes, from, to }){
	const lastContentColIndex = colIndexes.slice(-1)[0];
	const dimInput = cleanupDimInput(
		rows.slice(from, to + 1)
			.map(row => row.substring(lastContentColIndex + 1))
			.join(" ")
	);
	return parseDimension(dimInput, "vertical")
}