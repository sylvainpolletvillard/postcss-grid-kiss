function getFallback({
	zones, grid, decl, result, input
}){

	const { colIndexes, rowIndexes } = input;
	const colsDim = input.colsDim.map(dim => dimensionFallback(dim, { decl, result }));
	const rowsDim = input.rowsDim.map(dim => dimensionFallback(dim, { decl, result }));

	let fallback = {
		grid: gridFallback({ colsDim, rowsDim, rule: grid.rule, props: grid.props }),
		zones: new Map
	};

	for(let zone of zones){
		fallback.zones.set(zone, zoneFallback({
			zone, grid, colIndexes, rowIndexes, colsDim, rowsDim
		}))
	}

	return fallback;
}

function gridFallback({ rowsDim, colsDim, rule }){

	const grid = {
		rule: rule.clone({ nodes: [] }),
		props: new Map
	};
	grid.props.set("position", "relative");
	grid.props.set("display", "block");

	const gridWidth = colsDim.some(isDimRelative) ? "100%" : calcSum(...colsDim);
	const gridHeight = rowsDim.some(isDimRelative) ? "100%" : calcSum(...rowsDim);
	grid.props.set("width", gridWidth);
	grid.props.set("height", gridHeight);

	for (let [prop,value] of grid.props) {
		if (value != null){
			grid.rule.append({ prop, value });
		}
	}

	return grid;
}

function zoneFallback({
	zone: { rule, props, zone },
	rowIndexes, colIndexes, rowsDim, colsDim, grid
}) {

	const fallbackRule = rule.clone({ nodes: [] });
	const fallbackProps = new Map;

	fallbackProps.set("position", "absolute");
	fallbackProps.set("box-sizing", "border-box");

	setVerticalPos({ fallbackProps, props, rowIndexes, rowsDim, zone, grid });
	setHorizontalPos({ colIndexes, colsDim, fallbackProps, props, zone, grid });

	for (let [prop,value] of fallbackProps) {
		if (value != null){
			fallbackRule.append({ prop, value })
		}
	}

	return { props: fallbackProps, rule: fallbackRule }
}

function dimensionFallback(dim, { decl, result }){
	if(dim.startsWith("minmax(")){
		decl.warn(result, "minmax() operator is not supported in fallback mode. Replaced by 1fr.");
		dim = "1fr";
	}
	if(dim.startsWith("fit-content")){
		decl.warn(result, "fit-content() operator is not supported in fallback mode. Replaced by 1fr.");
		dim = "1fr";
	}
	return dim;
}

function calcSum(...args){
	let dims = args.filter(arg => arg && arg !== "0");
	return dims.length < 2 ? dims[0] : `calc(${dims.join(" + ")})`
}

function calcRemaining(dim){
	if(!dim || dim == "0") return "100%";
	return `calc(100% - ${dim})`
}

function calcFraction(dims, allDims){
	if(dims.length === 0 || dims.length === allDims.length)
		return null; // use default value

	if(dims.length === 1 && !isDimRelative(dims[0]))
		return dims[0];

	if(dims.every(dim => !isDimRelative(dim))) // all fixed
		return calcSum(...dims);

	const
		fr = dims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
	    totalFr = allDims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
	    allFixedDims = allDims.filter(dim => !isDimRelative(dim)),
		fixedDims = dims.filter(dim => !isDimRelative(dim)),
	    remaining = calcRemaining(allFixedDims.join(" - "));

	if(fixedDims.length === 0) { // all relative
		if (fr === totalFr) {
			return remaining;
		}
		return `calc(${remaining} * ${fr} / ${totalFr})`
	}

	let sumFixed = fixedDims.length == 1 ? fixedDims[0] : calcSum(...fixedDims);
	if (fr === totalFr) {
		return calcSum(sumFixed, remaining);
	}
	return calcSum(sumFixed, `calc(${remaining} * ${fr} / ${totalFr})`);

}

function isDimRelative(dim){
	return dim.endsWith("fr");
}

function setVerticalPos({
	fallbackProps, props, rowIndexes, rowsDim, zone, grid
}){
	const alignSelf = props.get("align-self") || "stretch";

	let gridDelta = getAlignContentFallbackDelta({ zone, grid, rowsDim });
	let dims = [];

	if(alignSelf === "end"){ // align by bottom
		for(let y=rowIndexes.length-1; y>zone.bottomIndex; y-=2){
			dims.push(rowsDim[Math.floor(y/2)]);
		}
		if(gridDelta && gridDelta != "0") gridDelta = calcRemaining(gridDelta);
		let position = calcSum(gridDelta, calcFraction(dims, rowsDim)) || "0";
		fallbackProps.set("bottom", position);
	} else {
		for(let y=0; y<zone.topIndex; y+=2){
			dims.push(rowsDim[Math.floor(y/2)]);
		}
		let position = calcSum(gridDelta, calcFraction(dims, rowsDim)) || "0";
		fallbackProps.set("top", position);
	}

	dims = [];
	for(let y=zone.topIndex; y<zone.bottomIndex; y+=2){
		dims.push(rowsDim[Math.floor(y/2)]);
	}
	const height = calcFraction(dims, rowsDim) || "100%";

	if(alignSelf === "stretch"){
		fallbackProps.set("height", height);
	} else {
		fallbackProps.set("max-height", height);
	}

	if(alignSelf === "center"){
		fallbackProps.set("transform", "translateY(-50%)");
		let top = fallbackProps.get("top"),
		    halfHeight = `calc(${height} / 2)`;
		fallbackProps.set("top", (!top || top === "0") ? halfHeight : calcSum(top, halfHeight));
	}
}

function setHorizontalPos({
	colIndexes, colsDim, fallbackProps, props, zone, grid
}){
	const justifySelf = props.get("justify-self") || "stretch";

	let gridDelta = getJustifyContentFallbackDelta({ zone, grid, colsDim });
	let dims = [];

	if(justifySelf === "end"){ // align by right
		for(let x=colIndexes.length-1; x>zone.rightIndex; x-=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}
		if(gridDelta && gridDelta != "0") gridDelta = calcRemaining(gridDelta);
		let position = calcSum(gridDelta, calcFraction(dims, colsDim)) || "0";
		fallbackProps.set("right", position);
	} else {
		for(let x=0; x<zone.leftIndex; x+=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}
		let position = calcSum(gridDelta, calcFraction(dims, colsDim)) || "0";
		fallbackProps.set("left", position);
	}

	dims = [];
	for(let x=zone.leftIndex; x<zone.rightIndex; x+=2){
		dims.push(colsDim[Math.floor(x/2)]);
	}
	const width = calcFraction(dims, colsDim) || "100%";

	if(justifySelf === "stretch"){
		fallbackProps.set("width", width);
	} else {
		fallbackProps.set("max-width", width);
	}

	if(justifySelf === "center"){
		dims = [];
		for(let x=zone.leftIndex; x<zone.rightIndex; x+=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}

		let left = fallbackProps.get("left"),
		    halfWidth = `calc(${width} / 2)`;
		fallbackProps.set("left", (!left || left === "0") ? halfWidth : calcSum(left, halfWidth));

		if(fallbackProps.get("transform") != null){
			fallbackProps.set("transform", "translate(-50%,-50%)");
		} else {
			fallbackProps.set("transform", "translateX(-50%)");
		}
	}
}

function getJustifyContentFallbackDelta({ zone, grid, colsDim }){

	if(colsDim.some(isDimRelative)) return "0" // fluid zone will fit all the remaining space

	const justifyGrid = grid.props.get("justify-content") || "stretch";

	if(justifyGrid === "stretch")
		return "0"
	if(justifyGrid === "start")
		return "0"

	const remainingSpace = calcRemaining(calcSum(...colsDim)),
	      index = Math.floor(zone.leftIndex / 2),
	      nbCols = colsDim.length;

	if(justifyGrid === "end")
		return remainingSpace;
	if(justifyGrid === "center")
		return `calc(${remainingSpace} / 2)`
	if(justifyGrid === "space-between")
		return `calc(${remainingSpace} * ${index} / ${nbCols - 1})`
	if(justifyGrid === "space-around")
		return `calc(${remainingSpace} * ${(index * 2) + 1} / ${nbCols * 2})`
	if(justifyGrid === "space-evenly")
		return `calc(${remainingSpace} * ${index + 1} / ${nbCols + 1})`
}

function getAlignContentFallbackDelta({ zone, grid, rowsDim }){

	if(rowsDim.some(isDimRelative)) return "0" // fluid zone will fit all the remaining space

	const alignGrid = grid.props.get("align-content") || "stretch";

	if(alignGrid === "stretch")
		return "0"
	if(alignGrid === "start")
		return "0"

	const remainingSpace = calcRemaining(calcSum(...rowsDim)),
	      index = Math.floor(zone.topIndex / 2),
	      nbRows = rowsDim.length;

	if(alignGrid === "end")
		return remainingSpace
	if(alignGrid === "center")
		return `calc(${remainingSpace} / 2)`
	if(alignGrid === "space-between")
		return `calc(${remainingSpace} * ${index} / ${nbRows - 1})`
	if(alignGrid === "space-around")
		return `calc(${remainingSpace} * ${(index * 2) + 1} / ${nbRows * 2})`
	if(alignGrid === "space-evenly")
		return `calc(${remainingSpace} * ${index + 1} / ${nbRows + 1})`

}

module.exports = { getFallback, zoneFallback, gridFallback }