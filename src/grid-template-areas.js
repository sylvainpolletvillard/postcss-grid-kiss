exports.getGridAreas = function({ zones, rowIndexes, colIndexes }){

	const areaNames = [];

	for(let y = 0; y < rowIndexes.length/2; y++) {
		areaNames[y]=[];
		for (let x = 0; x < colIndexes.length/2; x++) {
			let currentZone = zones.find(
				zone => (rowIndexes[2*y] >= zone.top && rowIndexes[2*y+1] <= zone.bottom)
				&& (colIndexes[2*x] >= zone.left && colIndexes[2*x+1] <= zone.right)
			);
			if(currentZone){
				areaNames[y][x] = currentZone.name || "...";
			} else {
				console.log(zones);
				throw new Error(`Zone has not been found for indexes x:${2*x} y:${2*y}`)
			}
		}
	}

	let longestNameLengthByCol = [];
	for(let y=0; y < areaNames.length; y++){
		for(let x=0; x < areaNames[y].length; x++){
			if(!(x in longestNameLengthByCol)) longestNameLengthByCol[x] = 0;
			let nameLength = areaNames[y][x].length;
			if(nameLength > longestNameLengthByCol[x]){
				longestNameLengthByCol[x] = nameLength;
			}
		}
	}

	return areaNames.map(
		row => `"${row.map(
			(name, x) => (name + " ".repeat(longestNameLengthByCol[x])).slice(0, longestNameLengthByCol[x])
		).join(" ")}"`
	)

}