const {indentMultiline} = require("./utils");

module.exports = function getGridAreas({ zones, rowIndexes, colIndexes, indent }){

	const areaNames = [];

	for(let y = 0; y < rowIndexes.length/2; y++) {
		areaNames[y]=[];
		for (let x = 0; x < colIndexes.length/2; x++) {
			let currentZone = zones.find(
				zone => rowIndexes[2*y]   >= zone.top
				     && rowIndexes[2*y+1] <= zone.bottom
				     && colIndexes[2*x]   >= zone.left
				     && colIndexes[2*x+1] <= zone.right
			);

			if(currentZone){
				areaNames[y][x] = currentZone.name || "...";
			} else { // gap
				areaNames[y][x] = "...";
				zones.push({
					isGap:  true,
					top:    rowIndexes[2*y],
					bottom: rowIndexes[2*y+1],
					left:   colIndexes[2*x],
					right:  colIndexes[2*x+1]
				})
			}
		}
	}

	let longestNameLengthByCol = [];
	for(let y=0; y < areaNames.length; y++){
		for(let x=0; x < areaNames[y].length; x++){
			let nameLength = areaNames[y][x].length;
			if(nameLength > (longestNameLengthByCol[x] || 0)){
				longestNameLengthByCol[x] = nameLength;
			}
		}
	}

	return indentMultiline(areaNames.map(
		row => `"${row.map(
			(name, x) => (name + " ".repeat(longestNameLengthByCol[x])).slice(0, longestNameLengthByCol[x])
		).join(" ")}"`
	), indent);
}