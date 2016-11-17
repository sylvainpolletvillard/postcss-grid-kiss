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


module.exports = function () {
	return function (css) {
		css.walkDecls(function (decl) {
			if (decl.prop === 'grid-kiss') {

				const input  = parse(decl);
				const output = new Map;
				const indent = decl.raws.before.match(/.*$/)[0];

				output.set("display", "grid");
				output.set("align-content", getAlignContent(input));
				output.set("justify-content", getJustifyContent(input));
				output.set("grid-template-rows", getGridRows(input));
				output.set("grid-template-columns", getGridCols(input));
				output.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));

				// grid properties
				for (let [prop,value] of output) {
					if (value != null){
						decl.parent.append({prop, value});
					}
				}

				// zone declarations
				for(let zone of input.zones.filter(zone => zone.selector != null)){
					let zoneRules = new Map;

					zoneRules.set("grid-area", zone.name);
					zoneRules.set("justify-self", getJustifySelf(zone));
					zoneRules.set("align-self", getAlignSelf(zone));

					let rule = postcss.rule({ selector: `${decl.parent.selector} > ${zone.selector}` });
					for (let [prop,value] of zoneRules) {
						if (value != null){
							rule.append({prop, value});
						}
					}
					decl.parent.parent.insertBefore(decl.parent, rule);
				}

				decl.remove();
			}
		})
	}
};