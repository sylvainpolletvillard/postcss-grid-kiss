const {parseDimension} = require("./dimension");

exports.getGridCols = function(input){

	const { decl, rows, zones, colIndexes, rowIndexes } = input;
	const gridCols = new Array(Math.floor(colIndexes.length / 2)).fill("1fr"); // autofill by default

	// match border content
	for(let zone of zones) {
		for (let side of ["top", "bottom"]) {
			let
				borderContent = cleanupDimInput(rows[zone[side]].substring(zone.left, zone.right)),
				colIndexLeft  = colIndexes.indexOf(zone.left),
				colIndexRight = colIndexes.indexOf(zone.right),
				colDim        = parseDimension(borderContent, "horizontal");

			if (colDim != null) {
				if (colIndexRight === colIndexLeft + 1) {
					gridCols[Math.floor(colIndexLeft / 2)] = colDim;
				} else {
					throw decl.error(
						`You cannot specify the width of a zone occupying more than one column.`,
						{ plugin: 'postcss-mixins' }
					);
				}
			}
		}
	}

	// check the last row
	let lastRow = rows[rowIndexes.slice(-1)[0]+1];
	if(lastRow){
		for(let x=0; x<gridCols.length; x++){
			let content = cleanupDimInput(lastRow.substring(colIndexes[2*x], colIndexes[2*x+1]+1)),
			    colDim  = parseDimension(content, "horizontal");

			if (colDim != null) {
				gridCols[x] = colDim;
			}
		}

		// check horizontal gaps
		for(let x=0; x<colIndexes.length-2; x+=2){
			let left = colIndexes[x+1]+1,
			    right = colIndexes[x+2]-1;

			let gapDimensionInfo = cleanupDimInput(lastRow.substring(left, right)),
			    gapDim = parseDimension(gapDimensionInfo, "horizontal");

			if(gapDim != null){ // horizontal gap detected
				gridCols.splice(Math.floor(x/2)+1, 0, gapDim);
				colIndexes.splice(x+2, 0, left, right);
				x+=2;
			}
		}

	}

	input.colsDim = gridCols;
	return gridCols.join(" ");
}

function cleanupDimInput(input){
	return input
		.replace(/[^a-zA-Z0-9()\-+/*\s%,<>]/g, "") // remove anything that is not part of a dimension value
		.replace(/^[-+\s]+|[-+\s]+$/g, "") // remove remaining '-' '+' segments but preserve range dimensions
}