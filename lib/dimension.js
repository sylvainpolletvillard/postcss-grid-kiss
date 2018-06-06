const
	REGEX_LENGTH    = /^(\d+(?:\.\d+)?)([a-z]{1,4})$/,
	REGEX_PERCENT   = /^(\d+(?:\.\d+)?)%\s*(free|grid|view)?$/,
	REGEX_DIMENSION = /(\d+(?:\.\d+)?)%?\s*([a-z]{1,4})/,
	REGEX_CALC      = /^calc\((.*)\)$/,

	isFluid = dim => dim.endsWith("fr"),
	isFixed = dim => !isFluid(dim)

function parseDimension(str, direction){

	str = str.trim();

	// when no value is specified, row and column sizes are set as `auto`
	if(str.length === 0)
		return null;

	if(str === "auto")
		return "1fr";

	// non-negative number representing a fraction of the free space in the grid container
	if(!isNaN(str))
		return `${parseFloat(str)}fr`

	if(REGEX_LENGTH.test(str))
		return str;

	// calc() expression
	if(REGEX_CALC.test(str))
		return str;

	if(REGEX_PERCENT.test(str)){
		let [, percentage, referential] = str.match(REGEX_PERCENT);
		switch(referential){
			case "free":
				return `${percentage}fr`
			case "view":
				return `${percentage}${direction === "vertical" ? "vh" : "vw"}`
			case "grid":
			default:
				return `${percentage}%`;
		}
	}

	// `> *length*` or `< *length*`: a minimum or maximum value
	if(str.startsWith("<"))
		return `minmax(auto, ${parseDimension(str.substring(1), direction)})`

	if(str.startsWith(">"))
		return `minmax(${parseDimension(str.substring(1), direction)}, auto)`

	// a range between a minimum and a maximum or `minmax(min, max)`
	let [min, max] = str.split("-")
	if([min, max].every(dim => REGEX_DIMENSION.test(dim))){
		return `minmax(${parseDimension(min, direction)}, ${parseDimension(max, direction)})`
	}

	// a keyword representing the largest maximal content contribution of the grid items occupying the grid track
	if(str === "max" || str === "max-content")
		return "max-content"

	// a keyword representing the largest minimal content contribution of the grid items occupying the grid track
	if(str === "min" || str === "min-content")
		return "min-content"

	// a keyword representing the formula min(max-content, max(auto, *length*)),
	// which is calculated similar to auto (i.e. minmax(auto, max-content)),
	// except that the track size is clamped at argument *length* if it is greater than the auto minimum.

	if(str.startsWith("fit"))
		return str.replace(/fit (.*)$/, "fit-content($1)");

	return null;
}

function cleanupDimInput(input){
	return input
		.replace(/[^a-zA-Z0-9()\-+/*\s%,<>]/g, "") // remove anything that is not part of a dimension value
		.replace(/^[-+\s]+|[-+\s]+$/g, "") // remove remaining '-' '+' segments but preserve range dimensions
}

module.exports = { parseDimension, cleanupDimInput, isFluid, isFixed }