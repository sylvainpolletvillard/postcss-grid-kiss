const
	optimizeRule = require("postcss-merge-grid-template/lib/optimize"),

	caniuse = require("./caniuse"),
	parse = require("./parse"),
	getAlignContent = require("./align-content"),
	getJustifyContent = require("./justify-content"),
	getAlignSelf = require("./align-self"),
	getJustifySelf = require("./justify-self"),
	getGridRows = require("./grid-template-rows"),
	getGridCols = require("./grid-template-columns"),
	getGridAreas = require("./grid-template-areas"),
	getFallback = require("./fallback");

const DEFAULTS_OPTIONS = {
	optimize: true
}

module.exports = function (options) {
	options = Object.assign({}, DEFAULTS_OPTIONS, options);

	let isFallbackNeeded = !caniuse.cssGrid(options.browsers);
	let isIEHackNeeded = !caniuse.cssSupportsApi(options.browsers);

	if ("fallback" in options) {
		isFallbackNeeded = options.fallback;
		isIEHackNeeded = options.fallback;
	}

	const gridKiss = (decl, { result, Rule, AtRule }) => {
		const
			{ rows, cols, zones, rowIndexes, colIndexes } = parse(decl, options),
			grid = { props: new Map, rule: decl.parent },
			indent = decl.raws.before.match(/.*$/)[0],
			nameMapping = new Map(),
			rowDims = getGridRows({ rows, colIndexes, rowIndexes, options }),
			colDims = getGridCols({ decl, rows, zones, colIndexes, rowIndexes, options })

		let lastRule = grid.rule;

		grid.props.set("display", "grid");
		grid.props.set("align-content", getAlignContent({ rows }));
		grid.props.set("justify-content", getJustifyContent({ cols }));
		grid.props.set("grid-template-rows", rowDims.join(" "));
		grid.props.set("grid-template-columns", colDims.join(" "));
		grid.props.set("grid-template-areas", getGridAreas({ zones, rowIndexes, colIndexes, indent }));

		// grid properties
		for (let [prop, value] of grid.props) {
			if (value) {
				decl.cloneBefore({ prop, value, raws: { before: '\n\t', after: '' } });
			}
		}

		if (options.optimize) {
			optimizeRule(grid.rule, nameMapping);
		}

		// zone declarations

		zones.filter(zone => zone.selector).forEach(zone => {
			zone.props = new Map;

			let name = zone.name;
			if (options.optimize && nameMapping.has(zone.name)) {
				name = nameMapping.get(zone.name);
			}

			zone.props.set("grid-area", name);
			zone.props.set("justify-self", getJustifySelf(zone));
			zone.props.set("align-self", getAlignSelf(zone));

			zone.rule = new Rule({
				selector: `${grid.rule.selector} > ${zone.selector}`,
				source: decl.source,
				raws: { before: '\n\n', after: '\n' }
			});

			for (let [prop, value] of zone.props) {
				if (value) {
					zone.rule.append({ prop, value, raws: { before: '\n\t', after: '' } });
				}
			}

			grid.rule.parent.insertAfter(lastRule, zone.rule);
			lastRule = zone.rule
		})

		if (isFallbackNeeded) {
			const fallback = getFallback({
				zones, grid, decl, result, options, colIndexes, rowIndexes, colDims, rowDims
			});

			const supportsRule = new AtRule({
				name: "supports",
				params: 'not (grid-template-areas:"test")'
			});

			const ieHackRule = new AtRule({
				name: "media",
				params: 'screen and (min-width:0\\0)'
			});

			supportsRule.append(fallback.grid.rule.clone({ raws: { before: '\n\t', after: '\n\t' } }));
			ieHackRule.append(fallback.grid.rule.clone({ raws: { before: '\n\t', after: '\n\t' } }));
			for (let zoneFallback of fallback.zones.values()) {
				supportsRule.append(zoneFallback.rule.clone({ raws: { before: '\n\n\t', after: '\n\t' } }));
				ieHackRule.append(zoneFallback.rule.clone({ raws: { before: '\n\n\t', after: '\n\t' } }));
			}

			if (isIEHackNeeded) {
				grid.rule.parent.insertAfter(lastRule, ieHackRule);
			}

			grid.rule.parent.insertAfter(lastRule, supportsRule);
		}

		decl.remove(); // remove grid-kiss rule in output
	}

	return {
		postcssPlugin: 'postcss-grid-kiss',
		Declaration: {
			"grid-kiss": gridKiss,
			"grid-template-kiss": gridKiss // see https://github.com/sylvainpolletvillard/postcss-grid-kiss/issues/25
		}
	}
};

module.exports.postcss = true