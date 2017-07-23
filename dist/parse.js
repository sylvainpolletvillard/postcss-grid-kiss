function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require("./utils"),
    range = _require.range;

var CORNERS_CHARS = /[+┌┐└┘╔╗╚╝]/;

function parse(decl, options) {
	var rows = getRows(decl.value),
	    cols = getCols({ rows }),
	    _getCorners = getCorners({ rows }),
	    colIndexes = _getCorners.colIndexes,
	    rowIndexes = _getCorners.rowIndexes,
	    zones = getZones({ rows, cols, colIndexes, rowIndexes, options });


	return {
		decl, rows, cols, zones, rowIndexes, colIndexes
	};
}

function getRows(str) {
	return str.match(/".*"/g).map(function (row) {
		return row.slice(1, row.length - 1);
	});
}

function getCols(_ref) {
	var rows = _ref.rows;

	var colsLength = rows.reduce(function (min, row) {
		return row.length < min ? row.length : min;
	}, Math.pow(2, 31) - 1);
	return range(0, colsLength).map(function (x) {
		return rows.map(function (row) {
			return row[x];
		}).join('');
	});
}

function getCorners(_ref2) {
	var rows = _ref2.rows;

	var colIndexes = new Set(),
	    rowIndexes = new Set();
	rows.forEach(function (row, rowIndex) {
		row.split('').forEach(function (char, colIndex) {
			if (CORNERS_CHARS.test(char)) {
				colIndexes.add(colIndex);
				rowIndexes.add(rowIndex);
			}
		});
	});

	colIndexes = Array.from(colIndexes).sort(function (a, b) {
		return a - b;
	});
	rowIndexes = Array.from(rowIndexes).sort(function (a, b) {
		return a - b;
	});

	return { colIndexes, rowIndexes };
}

function getZones(_ref3) {
	var rows = _ref3.rows,
	    cols = _ref3.cols,
	    colIndexes = _ref3.colIndexes,
	    rowIndexes = _ref3.rowIndexes,
	    options = _ref3.options;

	var zones = [];

	for (var y = 0; y < rowIndexes.length; y += 2) {
		var _loop = function _loop(x) {
			var top = rowIndexes[y],
			    left = colIndexes[x],
			    zone = { top, left };

			if (!isInZone({ zones, x: left, y: top }) && x + 1 in colIndexes && y + 1 in rowIndexes) {

				var bottom = void 0,
				    right = void 0;

				if (CORNERS_CHARS.test(rows[top][left])) {
					// a zone starts here, see how far if goes
					bottom = cols[left].slice(top + 1).search(CORNERS_CHARS) + top + 1;
					right = rows[top].slice(left + 1).search(CORNERS_CHARS) + left + 1;
				} else {
					zone.isHole = true; // no zone found, presumed as hole
					bottom = rowIndexes[y + 1];
					right = colIndexes[x + 1];
				}

				zone.bottom = bottom;
				zone.right = right;
				zone.content = rows.slice(top + 1, bottom).map(function (row) {
					return row.substring(left + 1, right);
				}).join(" ");
				zone.selector = getZoneSelector(zone, options) || null;
				zone.name = getZoneName({ zone, zones });

				zones.push(zone);
			}
		};

		for (var x = 0; x < colIndexes.length; x += 2) {
			_loop(x);
		}
	}

	return zones;
}

function getZoneSelector(zone, options) {
	return options.selectorParser(zone.content.replace(/[^\w]v[^\w]|[^\w#.:\-[\]()]/g, "").replace(/^:(\d+)$/, "*:nth-child($1)") // :2 => *:nth-child(2)
	.replace(/(^[\w-]+):(\d+)$/, "$1:nth-of-type($2)") // button:1 => button:nth-of-type(1)
	);
}

function getZoneName(_ref4) {
	var zone = _ref4.zone,
	    zones = _ref4.zones;

	if (!zone.selector) return null;

	var zoneNames = new Set(zones.map(function (z) {
		return z.name;
	})),
	    zoneSelectors = new Set(zones.map(function (z) {
		return z.selector;
	})),
	    zoneNamesBySelector = new Map([].concat(_toConsumableArray(zoneSelectors)).map(function (selector) {
		return [selector, zones.find(function (z) {
			return z.selector === selector;
		}).name];
	}));

	if (zoneNamesBySelector.has(zone.selector)) {
		return zoneNamesBySelector.get(zone.selector);
	}

	var baseName = zone.selector.replace(/(\w)([#.[])/g, "$1_") // .foo#bar.baz[qux] => .foo_bar_baz_qux]
	.replace(/[^\w]/g, ""); // .foo_bar_baz_qux] => foo_baz_baz_qux

	var aliasNum = 1,
	    name = baseName;

	while (zoneNames.has(name)) {
		name = baseName + aliasNum;
		aliasNum++;
	}

	zoneNames.add(name);
	zoneNamesBySelector.set(zone.selector, name);
	return name;
}

function isInZone(_ref5) {
	var zones = _ref5.zones,
	    x = _ref5.x,
	    y = _ref5.y;

	return zones.some(function (zone) {
		return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
	});
}

module.exports = { parse, getRows, getCols, getCorners, getZones, getZoneName, isInZone };