const {range} = require("./utils");

const CORNERS_CHARS = /[+┌┐└┘╔╗╚╝]/

function parse(str){
	const
		rows = getRows(str),
		cols = getCols({ rows }),
		{ colIndexes, rowIndexes } = getCorners({ rows }),
		zones = getZones({ rows, cols, colIndexes, rowIndexes });

	return {
		rows, cols, zones, rowIndexes, colIndexes
	};
}

function getRows(str){
	return str.match(/".*"/g).map(row => row.slice(1, row.length - 1));
}

function getCols({ rows }){
	let colsLength = rows.reduce((min, row) => row.length < min ? row.length : min, Math.pow(2,31)-1);
	return range(0, colsLength).map(x => rows.map(row => row[x]).join(''));
}

function getCorners({ rows }){
	let colIndexes = new Set,
	    rowIndexes = new Set;
	rows.forEach((row, rowIndex) => {
		row.split('').forEach((char, colIndex) => {
			if(CORNERS_CHARS.test(char)){
				colIndexes.add(colIndex);
				rowIndexes.add(rowIndex);
			}
		});
	});

	colIndexes = Array.from(colIndexes).sort((a,b)=>a-b)
	rowIndexes = Array.from(rowIndexes).sort((a,b)=>a-b)

	return { colIndexes, rowIndexes };
}

function getZones({ rows, cols, colIndexes, rowIndexes }){
	const zones = [];

	for(let y=0; y<rowIndexes.length; y++){
		for(let x=0; x<colIndexes.length; x++){
			let top = rowIndexes[y],
			    left = colIndexes[x];

			if(!isInZone({ zones, x:left, y:top }) && (x+1) in colIndexes && (y+1) in rowIndexes){
				let bottom = cols[left].slice(top+1).search(CORNERS_CHARS)+top+1,
				    right = rows[top].slice(left+1).search(CORNERS_CHARS)+left+1;

				let zone = { top, bottom, left, right };
				zone.content = rows
					.slice(top+1, bottom)
					.map(row => row.substring(left+1, right))
					.join(" ");
				zone.selector = zone.content.replace(/[^\w]v[^\w]|[^\w#.\[\]]/g, "") || null;
				zone.name = getZoneName({ zone, zones });

				zones.push(zone);
			}
		}
	}

	return zones;
}

function getZoneName({ zone, zones }){
	if(!zone.selector) return null;

	const zoneNames = new Set(zones.map(z => z.name)),
	      zoneSelectors = new Set(zones.map(z => z.selector)),
		  zoneNamesBySelector = new Map([...zoneSelectors].map(
		  	selector => [selector, zones.find(z => z.selector === selector).name]
		  ));

	if(zoneNamesBySelector.has(zone.selector)) {
		return zoneNamesBySelector.get(zone.selector)
	}

	let baseName = zone.selector
		.replace(/(\w)([#.\[])/g, "$1_") // .foo#bar.baz[qux] => .foo_bar_baz_qux]
		.replace(/[^\w]/g, ""); // .foo_bar_baz_qux] => foo_baz_baz_qux

	let aliasNum = 1,
	    name = baseName;

	while(zoneNames.has(name) ){
		name = baseName + aliasNum;
		aliasNum++;
	}

	zoneNames.add(name);
	zoneNamesBySelector.set(zone.selector, name);
	return name;
}

function isInZone({ zones, x, y }){
	return zones.some(zone => x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom);
}

module.exports = { parse, getRows, getCols, getCorners, getZones, getZoneName, isInZone };