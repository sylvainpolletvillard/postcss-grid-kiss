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
			zone, colIndexes, rowIndexes, colsDim, rowsDim
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

	if(rowsDim.some(isDimRelative)){
		grid.props.set("width", "100%");
	} else {
		grid.props.set("width",  `calc(${rowsDim.join(" + ")})`);
	}

	if(colsDim.some(isDimRelative)){
		grid.props.set("height", "100%");
	} else {
		grid.props.set("height",  `calc(${colsDim.join(" + ")})`);
	}

	for (let [prop,value] of grid.props) {
		if (value != null){
			grid.rule.append({ prop, value });
		}
	}

	return grid;
}

function zoneFallback({
	zone: { rule, props, zone },
	rowIndexes, colIndexes, rowsDim, colsDim
}) {

	const fallbackRule = rule.clone({ nodes: [] });
	const fallbackProps = new Map;

	fallbackProps.set("position", "absolute");
	fallbackProps.set("box-sizing", "border-box");

	setVerticalPos({
		fallbackProps, props, rowIndexes, rowsDim, zone
	})

	setHorizontalPos({
		colIndexes, colsDim, fallbackProps, props, zone
	})

	for (let [prop,value] of fallbackProps) {
		if (value != null){
			fallbackRule.append({ prop, value });
		}
	}

	return { props: fallbackProps, rule: fallbackRule };
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

function calcDim(dims, allDims){
	if(dims.length === 0 || dims.length === allDims.length)
		return null; // use default value

	if(dims.length === 1 && !isDimRelative(dims[0]))
		return dims[0];

	if(dims.every(dim => !isDimRelative(dim))) // all fixed
		return `calc(${dims.join(" + ")})`;

	const
		fr = dims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
	    totalFr = allDims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
	    allFixedDims = allDims.filter(dim => !isDimRelative(dim)),
		fixedDims = dims.filter(dim => !isDimRelative(dim)),
	    remaining = allFixedDims.length === 0 ? "100%" : `calc(100% - ${allFixedDims.join(" - ")})`;

	if(fixedDims.length === 0) { // all relative
		if (fr === totalFr) {
			return remaining;
		}
		return `calc(${remaining} * ${fr} / ${totalFr})`
	}

	let sumFixed = fixedDims.length == 1 ? fixedDims[0] : `calc(${fixedDims.join(" + ")})`;
	if (fr === totalFr) {
		return `calc(${sumFixed} + ${remaining})`;
	}
	return `calc(${sumFixed} + calc(${remaining} * ${fr} / ${totalFr}))`;

}

function isDimRelative(dim){
	return dim.endsWith("fr");
}

function setVerticalPos({
	fallbackProps, props, rowIndexes, rowsDim, zone
}){
	const alignSelf = props.get("align-self") || "stretch";
	let dims=[];

	if(alignSelf === "end"){ // align by bottom
		for(let y=rowIndexes.length-1; y>zone.bottomIndex; y-=2){
			dims.push(rowsDim[Math.floor(y/2)]);
		}
		fallbackProps.set("bottom", calcDim(dims, rowsDim) || "0");
	} else {
		for(let y=0; y<zone.topIndex; y+=2){
			dims.push(rowsDim[Math.floor(y/2)]);
		}
		fallbackProps.set("top", calcDim(dims, rowsDim) || "0");
	}

	dims = [];
	for(let y=zone.topIndex; y<zone.bottomIndex; y+=2){
		dims.push(rowsDim[Math.floor(y/2)]);
	}
	const height = calcDim(dims, rowsDim) || "100%";

	if(alignSelf === "stretch"){
		fallbackProps.set("height", height);
	} else {
		fallbackProps.set("max-height", height);
	}

	if(alignSelf === "center"){
		fallbackProps.set("transform", "translateY(-50%)");
		let top = fallbackProps.get("top"),
		    halfHeight = `calc(${height} / 2)`;
		fallbackProps.set("top", (!top || top === "0") ? halfHeight : `calc(${top} + ${halfHeight})`);
	}
}

function setHorizontalPos({
	colIndexes, colsDim, fallbackProps, props, zone
}){
	const justifySelf = props.get("justify-self") || "stretch";
	let dims = [];

	if(justifySelf === "end"){ // align by right
		for(let x=colIndexes.length-1; x>zone.rightIndex; x-=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}
		fallbackProps.set("right", calcDim(dims, colsDim) || "0");
	} else {
		for(let x=0; x<zone.leftIndex; x+=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}
		fallbackProps.set("left", calcDim(dims, colsDim) || "0");
	}

	dims = [];
	for(let x=zone.leftIndex; x<zone.rightIndex; x+=2){
		dims.push(colsDim[Math.floor(x/2)]);
	}
	const width = calcDim(dims, colsDim) || "100%";

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
		fallbackProps.set("left", (!left || left === "0") ? halfWidth : `calc(${left} + ${halfWidth})`);

		if(fallbackProps.get("transform") != null){
			fallbackProps.set("transform", "translate(-50%,-50%)");
		} else {
			fallbackProps.set("transform", "translateX(-50%)");
		}
	}
}

module.exports = { getFallback, zoneFallback, gridFallback}