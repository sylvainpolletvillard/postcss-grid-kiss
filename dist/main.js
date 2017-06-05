var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var postcss = require("postcss");
var browserslist = require("browserslist");
var caniuse = require("caniuse-api");
var optimizeRule = require("postcss-merge-grid-template/dist/optimize");

var _require = require("./parse"),
    parse = _require.parse;

var _require2 = require("./utils"),
    indentMultiline = _require2.indentMultiline;

var _require3 = require("./align-content"),
    getAlignContent = _require3.getAlignContent;

var _require4 = require("./justify-content"),
    getJustifyContent = _require4.getJustifyContent;

var _require5 = require("./align-self"),
    getAlignSelf = _require5.getAlignSelf;

var _require6 = require("./justify-self"),
    getJustifySelf = _require6.getJustifySelf;

var _require7 = require("./grid-template-rows"),
    getGridRows = _require7.getGridRows;

var _require8 = require("./grid-template-columns"),
    getGridCols = _require8.getGridCols;

var _require9 = require("./grid-template-areas"),
    getGridAreas = _require9.getGridAreas;

var _require10 = require("./fallback"),
    getFallback = _require10.getFallback;

var DEFAULTS_OPTIONS = {
	optimize: true,
	selectorParser: function selectorParser(x) {
		return x;
	}
};

module.exports = function (options) {
	options = Object.assign({}, DEFAULTS_OPTIONS, options);

	var browsers = browserslist(options.browsers);
	var isFallbackNeeded = !caniuse.isSupported("css-grid", browsers);
	var isIEHackNeeded = !caniuse.isSupported("css-supports-api", browsers);

	if (options.hasOwnProperty("fallback")) {
		isFallbackNeeded = options.fallback;
		isIEHackNeeded = options.fallback;
	}

	return function (css, result) {
		css.walkDecls('grid-kiss', function (decl) {

			var input = parse(decl, options);
			var grid = { props: new Map(), rule: decl.parent };
			var zones = [];
			var indent = decl.raws.before.match(/.*$/)[0];
			var nameMapping = new Map();

			grid.props.set("display", "grid");
			grid.props.set("align-content", getAlignContent(input));
			grid.props.set("justify-content", getJustifyContent(input));
			grid.props.set("grid-template-rows", getGridRows(input));
			grid.props.set("grid-template-columns", getGridCols(input));
			grid.props.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));

			// grid properties
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = grid.props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _ref = _step.value;

					var _ref2 = _slicedToArray(_ref, 2);

					var prop = _ref2[0];
					var value = _ref2[1];

					if (value) {
						decl.cloneBefore({ prop, value, raws: { before: '\n\t', after: '' } });
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (options.optimize) {
				optimizeRule(grid.rule, nameMapping);
			}

			// zone declarations
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = input.zones.filter(function (zone) {
					return zone.selector;
				})[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var zone = _step2.value;

					var props = new Map();
					var name = zone.name;

					if (options.optimize && nameMapping.has(zone.name)) {
						name = nameMapping.get(zone.name);
					}

					props.set("grid-area", name);
					props.set("justify-self", getJustifySelf(zone));
					props.set("align-self", getAlignSelf(zone));

					var rule = postcss.rule({
						selector: `${grid.rule.selector} > ${zone.selector}`,
						source: decl.source,
						raws: { before: '\n\n', after: '\n' }
					});

					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = props[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _ref3 = _step4.value;

							var _ref4 = _slicedToArray(_ref3, 2);

							var _prop = _ref4[0];
							var _value = _ref4[1];

							if (_value) {
								rule.append({ prop: _prop, value: _value, raws: { before: '\n\t', after: '' } });
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					var lastRule = zones.length > 0 ? zones[zones.length - 1].rule : grid.rule;
					grid.rule.parent.insertAfter(lastRule, rule);
					zones.push({ props, rule, zone });
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			if (isFallbackNeeded) {
				var fallback = getFallback({
					zones, grid, input, decl, result, options
				});

				var supportsRule = postcss.atRule({
					name: "supports",
					params: 'not (grid-template-areas:"test")'
				});

				var ieHackRule = postcss.atRule({
					name: "media",
					params: 'screen and (min-width:0\\0)'
				});

				supportsRule.append(fallback.grid.rule.clone({ raws: { before: '\n\t', after: '\n\t' } }));
				ieHackRule.append(fallback.grid.rule.clone({ raws: { before: '\n\t', after: '\n\t' } }));
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = fallback.zones.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var zoneFallback = _step3.value;

						supportsRule.append(zoneFallback.rule.clone({ raws: { before: '\n\n\t', after: '\n\t' } }));
						ieHackRule.append(zoneFallback.rule.clone({ raws: { before: '\n\n\t', after: '\n\t' } }));
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				var lastRule = zones.length > 0 ? zones[zones.length - 1].rule : grid.rule;

				if (isIEHackNeeded) {
					grid.rule.parent.insertAfter(lastRule, ieHackRule);
				}

				grid.rule.parent.insertAfter(lastRule, supportsRule);
			}

			decl.remove(); // remove grid-kiss rule in output
		});
	};
};