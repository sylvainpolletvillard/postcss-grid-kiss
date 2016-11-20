const {parseDimension} = require("./dimension");

exports.getGridRows = function(input){

	const
		{ rows, colIndexes, rowIndexes } = input,
		lastContentColIndex = colIndexes.slice(-1)[0],
	    gridRows = [];

	for(let y=0; y<rowIndexes.length; y++){
		let rowDimensionInfo = rows
			.slice(rowIndexes[y]+1, rowIndexes[y+1])
			.map(row => row.substring(lastContentColIndex+1))
			.join(" ");

		let dimension = parseDimension(rowDimensionInfo, "vertical");
		if(dimension === null) dimension = "1fr";
		gridRows.push(dimension);
		y++;
	}

	input.rowsDim = gridRows;
	return gridRows.join(" ");
}