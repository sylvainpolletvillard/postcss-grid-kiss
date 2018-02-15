const
	reduceCSSCalc      = require('reduce-css-calc'),
	{isFluid, isFixed} = require("./dimension"),

	calc      = expr => reduceCSSCalc(`calc(${expr})`),
	sum       = (...args) => calc(args.filter(arg => !!arg).join(" + ") || "0"),
	remaining = (...dims) => calc(`100% - ${sum(...dims)}`),

	fraction  = (dims, allDims) => {
		if (dims.length === 0 || dims.length === allDims.length)
			return null; // use default value

		if (dims.every(isFixed))
			return sum(...dims);

		const
			fr             = dims.filter(isFluid).reduce((total, dim) => total + parseInt(dim), 0),
			totalFr        = allDims.filter(isFluid).reduce((total, dim) => total + parseInt(dim), 0),
			remainingSpace = remaining(...allDims.filter(isFixed)),
			remainingFr    = calc(`${remainingSpace} * ${fr} / ${totalFr}`)

		return sum(...dims.filter(isFixed), remainingFr);
	}

module.exports = { sum, remaining, fraction }