const {parseDimension} = require("./dimension");

exports.getGridRows = function(input){

	const
		{ rows, colIndexes, rowIndexes } = input,
	    gridRows = [];

	for(let y=0; y<rowIndexes.length; y+=2) {
		let dimension = parseDimension(getRowDimInfo({
			rows, colIndexes,
			from: rowIndexes[y] + 1,
			to: rowIndexes[y+1] - 1
		}), "vertical");

		if (dimension === null) dimension = "1fr";
		gridRows.push(dimension);
	}

	// check vertical gaps
	for(let y=0; y<rowIndexes.length-2; y+=2) {
		let top = rowIndexes[y+1]+1,
		    bottom = rowIndexes[y+2]-1,
		    gapDimension = parseDimension(getRowDimInfo({ rows, colIndexes, from: top, to: bottom }), "vertical");

		if(gapDimension != null){ // vertical gap detected
			gridRows.splice(Math.floor(y/2)+1, 0, gapDimension);
			rowIndexes.splice(y+2, 0, top, bottom);
			y+=2;
		}
	}

	input.rowsDim = gridRows;
	return gridRows.join(" ");
}

function getRowDimInfo({ rows, colIndexes, from, to }){
	const lastContentColIndex = colIndexes.slice(-1)[0];
	return rows
		.slice(from, to+1)
		.map(row => row.substring(lastContentColIndex + 1))
		.join(" ");
}