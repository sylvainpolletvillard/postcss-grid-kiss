const postcss = require("postcss");

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


module.exports = function (options = {}) {
	return function (css, result) {
		css.walkDecls(function (decl) {
			if (decl.prop === 'grid-kiss') {

				const input  = parse(decl);
				const grid   = { props: new Map, rule: decl.parent };
				const zones  = [];
				const indent = decl.raws.before.match(/.*$/)[0];

				grid.props.set("display", "grid");
				grid.props.set("align-content", getAlignContent(input));
				grid.props.set("justify-content", getJustifyContent(input));
				grid.props.set("grid-template-rows", getGridRows(input));
				grid.props.set("grid-template-columns", getGridCols(input));
				grid.props.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));

				// grid properties
				for (let [prop,value] of grid.props) {
					if (value != null){
						decl.cloneAfter({ prop, value });
					}
				}

				// zone declarations
				for(let zone of input.zones.filter(zone => zone.selector != null)){
					let props = new Map;

					props.set("grid-area", zone.name);
					props.set("justify-self", getJustifySelf(zone));
					props.set("align-self", getAlignSelf(zone));

					let rule = postcss.rule({
						selector: `${grid.rule.selector} > ${zone.selector}`,
						source: decl.source
					});

					for (let [prop,value] of props) {
						if (value != null){
							rule.append({prop, value});
						}
					}

					let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;
					grid.rule.parent.insertAfter(lastRule, rule);
					zones.push({ props, rule, zone })
				}

				if(options.fallback){
					const atRule = postcss.atRule({
						name: "supports",
						params: 'not (grid-template-areas:"test")'
					});

					const fallback = getFallback({
						zones, grid, input, decl, result
					});

					atRule.append(fallback.grid.rule);
					for(let [zone, zoneFallback] of fallback.zones){
						atRule.append(zoneFallback.rule);
					}

					let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;
					grid.rule.parent.insertAfter(lastRule, atRule);
				}

				decl.remove();
			}
		})
	}
};