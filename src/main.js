const postcss      = require("postcss");
const browserslist = require("browserslist");
const caniuse      = require("caniuse-api");
const optimizeRule = require("postcss-merge-grid-template/dist/optimize");

const {parse}             = require("./parse");
const {indentMultiline}   = require("./utils");
const {getAlignContent}   = require("./align-content");
const {getJustifyContent} = require("./justify-content");
const {getAlignSelf}      = require("./align-self");
const {getJustifySelf}    = require("./justify-self");
const {getGridRows}       = require("./grid-template-rows");
const {getGridCols}       = require("./grid-template-columns");
const {getGridAreas}      = require("./grid-template-areas");
const {getFallback}       = require("./fallback");

const DEFAULTS_OPTIONS = {
	optimize: true
}

module.exports = function (options) {
	options = Object.assign({}, DEFAULTS_OPTIONS, options);

	const browsers = browserslist(options.browsers);
	let isFallbackNeeded = !caniuse.isSupported("css-grid", browsers);
	let isIEHackNeeded = !caniuse.isSupported("css-supports-api", browsers);

	if(options.hasOwnProperty("fallback")){
		isFallbackNeeded = options.fallback;
		isIEHackNeeded   = options.fallback;
	}

	return function (css, result) {
		css.walkDecls('grid-kiss', function (decl) {

			const input  = parse(decl);
			const grid   = { props: new Map, rule: decl.parent };
			const zones  = [];
			const indent = decl.raws.before.match(/.*$/)[0];
			const nameMapping = new Map();

			grid.props.set("display", "grid");
			grid.props.set("align-content", getAlignContent(input));
			grid.props.set("justify-content", getJustifyContent(input));
			grid.props.set("grid-template-rows", getGridRows(input));
			grid.props.set("grid-template-columns", getGridCols(input));
			grid.props.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));

			// grid properties
			for (let [prop,value] of grid.props) {
				if (value){
					decl.cloneBefore({ prop, value });
				}
			}

			if(options.optimize) {
				optimizeRule(grid.rule, nameMapping);
			}

			// zone declarations
			for(let zone of input.zones.filter(zone => zone.selector)){
				let props = new Map;
				let name = zone.name;

				if(options.optimize && nameMapping.has(zone.name)) {
					name = nameMapping.get(zone.name);
				}

				props.set("grid-area", name);
				props.set("justify-self", getJustifySelf(zone));
				props.set("align-self", getAlignSelf(zone));

				let rule = postcss.rule({
					selector: `${grid.rule.selector} > ${zone.selector}`,
					source: decl.source
				});

				for (let [prop,value] of props) {
					if (value){
						rule.append({prop, value});
					}
				}

				let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;
				grid.rule.parent.insertAfter(lastRule, rule);
				zones.push({ props, rule, zone })
			}

			if(isFallbackNeeded){
				const fallback = getFallback({
					zones, grid, input, decl, result, options
				});

				const supportsRule = postcss.atRule({
					name: "supports",
					params: 'not (grid-template-areas:"test")'
				});

				const ieHackRule = postcss.atRule({
					name: "media",
					params: 'screen and (min-width:0\\0)'
				});

				supportsRule.append(fallback.grid.rule);
				ieHackRule.append(fallback.grid.rule);
				for(let zoneFallback of fallback.zones.values()){
					supportsRule.append(zoneFallback.rule);
					ieHackRule.append(zoneFallback.rule);
				}

				let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;

				if(isIEHackNeeded){
					grid.rule.parent.insertAfter(lastRule, ieHackRule);
				}

				grid.rule.parent.insertAfter(lastRule, supportsRule);
			}

			decl.remove(); // remove grid-kiss rule in output

		})
	}
};