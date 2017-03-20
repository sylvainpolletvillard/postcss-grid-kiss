const reduce = require('reduce-css-calc');
const { isFillingRemainingSpace } = require("./dimension");

function sum(...args){
	let dims = args.filter(arg => arg && arg !== "0");
	return dims.length < 2 ? dims[0] : reduce(`calc(${dims.join(" + ")})`)
}

function remaining(dim){
	if(!dim || dim === "0") return "100%";
	return reduce(`calc(100% - ${dim})`)
}

function fraction(dims, allDims){
	if(dims.length === 0 || dims.length === allDims.length)
		return null; // use default value

	if(dims.length === 1 && !isFillingRemainingSpace(dims[0]))
		return dims[0];

	if(dims.every(dim => !isFillingRemainingSpace(dim))) // all fixed
		return sum(...dims);

	const
		fr = dims.reduce((total, dim) => isFillingRemainingSpace(dim) ? total + parseInt(dim) : total, 0),
		totalFr = allDims.reduce((total, dim) => isFillingRemainingSpace(dim) ? total + parseInt(dim) : total, 0),
		allFixedDims = allDims.filter(dim => !isFillingRemainingSpace(dim)),
		fixedDims = dims.filter(dim => !isFillingRemainingSpace(dim)),
		remainingSpace = remaining(allFixedDims.join(" - "));

	if(fixedDims.length === 0) { // all relative
		if (fr === totalFr) {
			return remainingSpace;
		}
		return reduce(`calc(${remainingSpace} * ${fr} / ${totalFr})`)
	}

	let sumFixed = fixedDims.length === 1 ? fixedDims[0] : sum(...fixedDims);
	if (fr === totalFr) {
		return sum(sumFixed, remainingSpace);
	}

	return sum(sumFixed, `calc(${remainingSpace} * ${fr} / ${totalFr})`);

}

module.exports = { sum, remaining, fraction, reduce }