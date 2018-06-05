const { parseDimension } = require("./dimension");

exports.getGridRows = function(input){

	const
		{ rows, colIndexes, rowIndexes } = input,
	    gridRows = [];

	for(let y=0; y < rowIndexes.length; y+=2) {
		let dimension = getRowDim({
			rows, colIndexes,
			from: rowIndexes[y],
			to: rowIndexes[y + 1]
		});

		if (dimension === null){ dimension = "1fr"; }
		gridRows.push(dimension);
	}

	// check vertical gaps
	for(let y=0; y<rowIndexes.length-2; y+=2) {
		const
			top = rowIndexes[y + 1],
		    bottom = rowIndexes[y + 2],
			gapDim = getRowDim({ rows, colIndexes, from: top, to: bottom });

		if(gapDim != null){ // vertical gap detected
			gridRows.splice(Math.floor(y/2)+1, 0, gapDim);
			rowIndexes.splice(y+2, 0, top, bottom);
			y+=2;
		}
	}

	input.rowsDim = gridRows;
	return gridRows.join(" ");
};

function getRowDim({ rows, colIndexes, from, to }){
	const lastContentColIndex = colIndexes.slice(-1)[0];
	const dimInput = rows.slice(from + 1, to).map(row => row.substring(lastContentColIndex + 1)).join(" ");
	return parseDimension(dimInput, "vertical")
}