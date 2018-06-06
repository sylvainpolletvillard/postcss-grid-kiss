const
	{ isFluid } = require("./dimension"),
	{ sum, remaining, fraction } = require("./calc-utils");

module.exports = function getFallback({
	zones, grid, decl, result, colIndexes, rowIndexes, colDims, rowDims
}){
	const dimensionsFallback = dims => dims.map(dim => dimensionFallback(dim, { decl, result }));
	colDims = dimensionsFallback(colDims);
	rowDims = dimensionsFallback(rowDims);

	const
		fallback = {
			grid: getGridFallback({ colDims, rowDims, rule: grid.rule, props: grid.props }),
			zones: new Map
		},

		zonesCommonRule = grid.rule.clone({
			selector: grid.rule.selector + ' > *',
			nodes: []
		});

	zonesCommonRule.append({ prop: "position", value: "absolute" });
	zonesCommonRule.append({ prop: "box-sizing", value: "border-box" });
	fallback.zones.set('*', { rule: zonesCommonRule })

	for(let zone of zones.filter(zone => zone.selector)){
		fallback.zones.set(zone, getZoneFallback({
			zone, grid, colIndexes, rowIndexes, colDims, rowDims
		}))
	}

	return fallback;
}

function dimensionFallback(dim, { decl, result }){
	if(dim === "max-content"
	|| dim === "min-content"
	|| dim.startsWith("minmax(")
	|| dim.startsWith("fit-content")){
		decl.warn(result, dim + " operator is not supported in fallback mode. Replaced by 1fr.");
		dim = "1fr";
	}
	return dim;
}

function getGridFallback({
	rowDims, colDims, rule
}){
	const grid = {
		rule: rule.clone({ nodes: [] }),
		props: new Map
	};

	const gridWidth = colDims.some(isFluid) ? "100%" : sum(...colDims);
	const gridHeight = rowDims.some(isFluid) ? "100%" : sum(...rowDims);

	grid.props.set("position", "relative");
	grid.props.set("display", "block");
	grid.props.set("width", gridWidth);
	grid.props.set("height", gridHeight);

	for (let [prop,value] of grid.props) {
		if (value != null){
			grid.rule.append({ prop, value });
		}
	}

	return grid;
}

function getZoneFallback({
	zone, rowIndexes, colIndexes, rowDims, colDims, grid
}) {

	const fallbackRule = zone.rule.clone({ nodes: [] });
	const fallbackProps = new Map;

	const {height, isStretchingVertically} = getHeight({ zone, rowDims, rowIndexes });
	const {width, isStretchingHorizontally} = getWidth({ zone, colDims, colIndexes });
	const {verticalOffset, alignByBottom} = getVerticalOffset({ zone, grid, rowDims, rowIndexes, height });
	const {horizontalOffset, alignByRight} = getHorizontalOffset({ zone, grid, colDims, colIndexes, width });

	fallbackProps.set("transform", getTransform(zone));
	fallbackProps.set(isStretchingVertically ? "height" : "max-height", height);
	fallbackProps.set(isStretchingHorizontally ? "width" : "max-width", width);
	fallbackProps.set(alignByBottom ? "bottom" : "top", verticalOffset);
	fallbackProps.set(alignByRight ? "right" : "left", horizontalOffset);

	for (let [prop,value] of fallbackProps) {
		if (value != null){
			fallbackRule.append({ prop, value })
		}
	}

	return { props: fallbackProps, rule: fallbackRule }
}

function getVerticalOffset({ zone, grid, rowDims, rowIndexes, height }){
	const alignSelf = zone.props.get("align-self") || "stretch";

	let offsetDims = [],
	    alignByBottom = false,
	    gridDelta = getAlignContentFallbackDelta({ zone, grid, rowDims, rowIndexes });

	if(alignSelf === "end") {
		alignByBottom = true;
		let bottomIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.bottom);
		for (let y = rowIndexes.length - 1; y > bottomIndex; y -= 2) {
			offsetDims.push(rowDims[Math.floor(y / 2)]);
		}
	} else {
		let topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top);
		for (let y = 0; y < topIndex; y += 2) {
			offsetDims.push(rowDims[Math.floor(y / 2)]);
		}
	}

	if(alignByBottom && gridDelta && gridDelta !== "0"){
		gridDelta = remaining(gridDelta);
	}

	let offset = sum(
		gridDelta,
		fraction(offsetDims, rowDims),
		alignSelf === "center" ? `calc(${height} / 2)` : "0"
	) || "0";

	return {
		verticalOffset: offset,
		alignByBottom
	}
}

function getHorizontalOffset({ zone, grid, colDims, colIndexes, width }){
	const justifySelf = zone.props.get("justify-self") || "stretch";

	let offsetDims = [],
	    alignByRight = false,
		gridDelta = getJustifyContentFallbackDelta({ zone, grid, colDims, colIndexes });

	if(justifySelf === "end") {
		alignByRight = true;
		let rightIndex = colIndexes.findIndex(colIndex => colIndex === zone.right);
		for (let x = colIndexes.length - 1; x > rightIndex; x -= 2) {
			offsetDims.push(colDims[Math.floor(x / 2)]);
		}
	} else {
		let leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left);
		for(let x=0; x<leftIndex; x+=2){
			offsetDims.push(colDims[Math.floor(x/2)]);
		}
	}

	if(alignByRight && gridDelta && gridDelta !== "0"){
		gridDelta = remaining(gridDelta);
	}

	let offset = sum(
		gridDelta,
		fraction(offsetDims, colDims),
		justifySelf === "center" ? `calc(${width} / 2)` : "0"
	) || "0";

	return {
		horizontalOffset: offset,
		alignByRight
	}
}

function getHeight({ zone, rowDims, rowIndexes }){

	const alignSelf = zone.props.get("align-self") || "stretch";

	let dims = [],
	    topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top),
	    bottomIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.bottom);

	for(let y=topIndex; y<bottomIndex; y+=2){
		dims.push(rowDims[Math.floor(y/2)]);
	}

	return {
		height: fraction(dims, rowDims) || "100%",
		isStretchingVertically: alignSelf === "stretch"
	}
}

function getWidth({ zone, colDims, colIndexes }){

	const justifySelf = zone.props.get("justify-self") || "stretch";

	let dims = [],
	    leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left),
	    rightIndex = colIndexes.findIndex(colIndex => colIndex === zone.right);
	for(let x=leftIndex; x<rightIndex; x+=2){
		dims.push(colDims[Math.floor(x/2)]);
	}

	return {
		width: fraction(dims, colDims) || "100%",
		isStretchingHorizontally: justifySelf === "stretch"
	}
}

function getTransform(zone){
	let isCenteredVertically = zone.props.get("align-self") === "center";
	let isCenteredHorizontally = zone.props.get("justify-self") === "center";

	if(isCenteredVertically && isCenteredHorizontally)
		return "translate(-50%,-50%)"
	if(isCenteredVertically)
		return "translateY(-50%)"
	if(isCenteredHorizontally)
		return "translateX(-50%)"
}

function getJustifyContentFallbackDelta({ zone, grid, colDims, colIndexes }){

	if(colDims.some(isFluid)) return "0" // fluid zone will fit all the remaining space

	const justifyGrid = grid.props.get("justify-content") || "stretch";

	if(justifyGrid === "stretch")
		return "0"
	if(justifyGrid === "start")
		return "0"

	const remainingSpace = remaining(...colDims),
	      leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left),
	      index = Math.floor(leftIndex / 2),
	      nbCols = colDims.length;

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

function getAlignContentFallbackDelta({ zone, grid, rowDims, rowIndexes }){

	if(rowDims.some(isFluid)) return "0" // fluid zone will fit all the remaining space

	const alignGrid = grid.props.get("align-content") || "stretch";

	if(alignGrid === "stretch")
		return "0"
	if(alignGrid === "start")
		return "0"

	const remainingSpace = remaining(...rowDims),
	      topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top),
	      index = Math.floor(topIndex / 2),
	      nbRows = rowDims.length;

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