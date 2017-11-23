const reduceCSSCalc = require('reduce-css-calc');
const { isFillingRemainingSpace } = require("./dimension");
const calc = require("./calc-utils");

function getFallback({
	zones, grid, decl, result, input
}){
	const { colIndexes, rowIndexes } = input;
	const colsDim = input.colsDim.map(dim => dimensionFallback(dim, { decl, result }));
	const rowsDim = input.rowsDim.map(dim => dimensionFallback(dim, { decl, result }));

	let fallback = {
		grid: getGridFallback({ colsDim, rowsDim, rule: grid.rule, props: grid.props }),
		zones: new Map
	};

	const zonesCommonRule = grid.rule.clone({
		selector: grid.rule.selector + ' > *',
		nodes: []
	});
	zonesCommonRule.append({ prop: "position", value: "absolute" });
	zonesCommonRule.append({ prop: "box-sizing", value: "border-box" });
	fallback.zones.set('*', { rule: zonesCommonRule })

	for(let zone of zones){
		fallback.zones.set(zone, getZoneFallback({
			zone, grid, colIndexes, rowIndexes, colsDim, rowsDim
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

function getGridFallback({ rowsDim, colsDim, rule }){

	const grid = {
		rule: rule.clone({ nodes: [] }),
		props: new Map
	};

	const gridWidth = colsDim.some(isFillingRemainingSpace) ? "100%" : reduceCSSCalc(calc.sum(...colsDim));
	const gridHeight = rowsDim.some(isFillingRemainingSpace) ? "100%" : reduceCSSCalc(calc.sum(...rowsDim));

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
	zone: { rule, props, zone },
	rowIndexes, colIndexes, rowsDim, colsDim, grid
}) {

	const fallbackRule = rule.clone({ nodes: [] });
	const fallbackProps = new Map;

	const {height, isStretchingVertically} = getHeight({ zone, props, rowsDim, rowIndexes });
	const {width, isStretchingHorizontally} = getWidth({ zone, props, colsDim, colIndexes });
	const {verticalOffset, alignByBottom} = getVerticalOffset({ props, zone, grid, rowsDim, rowIndexes, height });
	const {horizontalOffset, alignByRight} = getHorizontalOffset({ props, zone, grid, colsDim, colIndexes, width });

	fallbackProps.set("transform", getTransform({ props }));
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

function getVerticalOffset({
	props, zone, grid, rowsDim, rowIndexes, height
}){

	const alignSelf = props.get("align-self") || "stretch";

	let offsetDims = [],
	    alignByBottom = false,
	    gridDelta = getAlignContentFallbackDelta({ zone, grid, rowsDim, rowIndexes });

	if(alignSelf === "end") {
		alignByBottom = true;
		let bottomIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.bottom);
		for (let y = rowIndexes.length - 1; y > bottomIndex; y -= 2) {
			offsetDims.push(rowsDim[Math.floor(y / 2)]);
		}
	} else {
		let topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top);
		for (let y = 0; y < topIndex; y += 2) {
			offsetDims.push(rowsDim[Math.floor(y / 2)]);
		}
	}

	if(alignByBottom && gridDelta && gridDelta !== "0"){
		gridDelta = calc.remaining(gridDelta);
	}

	let offset = calc.sum(
		gridDelta,
		calc.fraction(offsetDims, rowsDim),
		alignSelf === "center" ? `calc(${height} / 2)` : "0"
	) || "0";


	return {
		verticalOffset: reduceCSSCalc(offset),
		alignByBottom
	}
}

function getHorizontalOffset({
	props, zone, grid, colsDim, colIndexes, width
}){

	const justifySelf = props.get("justify-self") || "stretch";

	let offsetDims = [],
	    alignByRight = false,
		gridDelta = getJustifyContentFallbackDelta({ zone, grid, colsDim, colIndexes });

	if(justifySelf === "end") {
		alignByRight = true;
		let rightIndex = colIndexes.findIndex(colIndex => colIndex === zone.right);
		for (let x = colIndexes.length - 1; x > rightIndex; x -= 2) {
			offsetDims.push(colsDim[Math.floor(x / 2)]);
		}
	} else {
		let leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left);
		for(let x=0; x<leftIndex; x+=2){
			offsetDims.push(colsDim[Math.floor(x/2)]);
		}
	}

	if(alignByRight && gridDelta && gridDelta != "0"){
		gridDelta = calc.remaining(gridDelta);
	}

	let offset = calc.sum(
		gridDelta,
		calc.fraction(offsetDims, colsDim),
		justifySelf === "center" ? `calc(${width} / 2)` : "0"
	) || "0";

	return {
		horizontalOffset: reduceCSSCalc(offset),
		alignByRight
	}
}

function getHeight({ zone, props, rowsDim, rowIndexes }){

	const alignSelf = props.get("align-self") || "stretch";

	let dims = [],
	    topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top),
	    bottomIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.bottom);

	for(let y=topIndex; y<bottomIndex; y+=2){
		dims.push(rowsDim[Math.floor(y/2)]);
	}

	return {
		height: reduceCSSCalc(calc.fraction(dims, rowsDim) || "100%"),
		isStretchingVertically: alignSelf === "stretch"
	}
}

function getWidth({ zone, props, colsDim, colIndexes }){

	const justifySelf = props.get("justify-self") || "stretch";

	let dims = [],
	    leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left),
	    rightIndex = colIndexes.findIndex(colIndex => colIndex === zone.right);
	for(let x=leftIndex; x<rightIndex; x+=2){
		dims.push(colsDim[Math.floor(x/2)]);
	}

	return {
		width: reduceCSSCalc(calc.fraction(dims, colsDim) || "100%"),
		isStretchingHorizontally: justifySelf === "stretch"
	}
}

function getTransform({ props }){
	let isCenteredVertically = props.get("align-self") === "center";
	let isCenteredHorizontally = props.get("justify-self") === "center";

	if(isCenteredVertically && isCenteredHorizontally)
		return "translate(-50%,-50%)"
	if(isCenteredVertically)
		return "translateY(-50%)"
	if(isCenteredHorizontally)
		return "translateX(-50%)"
}

function getJustifyContentFallbackDelta({ zone, grid, colsDim, colIndexes }){

	if(colsDim.some(isFillingRemainingSpace)) return "0" // fluid zone will fit all the remaining space

	const justifyGrid = grid.props.get("justify-content") || "stretch";

	if(justifyGrid === "stretch")
		return "0"
	if(justifyGrid === "start")
		return "0"

	const remainingSpace = calc.remaining(calc.sum(...colsDim)),
	      leftIndex = colIndexes.findIndex(colIndex => colIndex === zone.left),
	      index = Math.floor(leftIndex / 2),
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

function getAlignContentFallbackDelta({ zone, grid, rowsDim, rowIndexes }){

	if(rowsDim.some(isFillingRemainingSpace)) return "0" // fluid zone will fit all the remaining space

	const alignGrid = grid.props.get("align-content") || "stretch";

	if(alignGrid === "stretch")
		return "0"
	if(alignGrid === "start")
		return "0"

	const remainingSpace = calc.remaining(calc.sum(...rowsDim)),
	      topIndex = rowIndexes.findIndex(rowIndex => rowIndex === zone.top),
	      index = Math.floor(topIndex / 2),
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

module.exports = { getFallback, getZoneFallback, getGridFallback }