const { parseDimension, cleanupDimInput } = require("./dimension");

module.exports = function getGridCols({ decl, rows, zones, colIndexes, rowIndexes }){

	const colDims = new Array(Math.floor(colIndexes.length / 2)).fill("1fr"); // autofill by default

	// match border content
	for(let zone of zones) {
		for (let side of ["top", "bottom"]) {
			const
				colIndexLeft  = colIndexes.indexOf(zone.left),
				colIndexRight = colIndexes.indexOf(zone.right),
				colDim        = getColDim({ row: rows[zone[side]], from: zone.left, to: zone.right });

			if (colDim != null) {
				if (colIndexRight === colIndexLeft + 1) {
					colDims[Math.floor(colIndexLeft / 2)] = colDim;
				}
				else throw decl.error(`You cannot specify the width of a zone occupying more than one column.`);
			}
		}
	}

	// check the last row
	let lastRow = rows[rowIndexes.slice(-1)[0] + 1];
	if(lastRow){
		for(let x=0; x < colDims.length; x++){
			const
				left    = colIndexes[2*x],
				right   = colIndexes[2*x + 1],
			    colDim  = getColDim({ row: lastRow, from: left, to: right });

			if (colDim != null) {
				colDims[x] = colDim;
			}
		}

		// check horizontal gaps
		for(let x=0; x < colIndexes.length-2; x+=2){
			const
				left   = colIndexes[x + 1] + 1,
				right  = colIndexes[x + 2] - 1,
				gapDim = getColDim({ row: lastRow, from: left, to : right });

			if(gapDim != null){ // horizontal gap detected
				colDims.splice(Math.floor(x/2)+1, 0, gapDim);
				colIndexes.splice(x+2, 0, left, right);
				x+=2;
			}
		}

	}

	return colDims;
}

function getColDim({ row, from, to }){
	const dimInput = cleanupDimInput(row.substring(from, to + 1));
	return parseDimension(dimInput, "horizontal")
}