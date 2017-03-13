exports.getGridAreas = function (_ref) {
	var zones = _ref.zones,
	    rowIndexes = _ref.rowIndexes,
	    colIndexes = _ref.colIndexes;


	var areaNames = [];

	var _loop = function _loop(y) {
		areaNames[y] = [];

		var _loop2 = function _loop2(_x) {
			var currentZone = zones.find(function (zone) {
				return rowIndexes[2 * y] >= zone.top && rowIndexes[2 * y + 1] <= zone.bottom && colIndexes[2 * _x] >= zone.left && colIndexes[2 * _x + 1] <= zone.right;
			});
			if (currentZone) {
				areaNames[y][_x] = currentZone.name || "...";
			} else {
				// gap
				areaNames[y][_x] = "...";
				zones.push({
					isGap: true,
					top: rowIndexes[2 * y], bottom: rowIndexes[2 * y + 1],
					left: colIndexes[2 * _x], right: colIndexes[2 * _x + 1]
				});
			}
		};

		for (var _x = 0; _x < colIndexes.length / 2; _x++) {
			_loop2(_x);
		}
	};

	for (var y = 0; y < rowIndexes.length / 2; y++) {
		_loop(y);
	}

	var longestNameLengthByCol = [];
	for (var y = 0; y < areaNames.length; y++) {
		for (var x = 0; x < areaNames[y].length; x++) {
			if (!(x in longestNameLengthByCol)) longestNameLengthByCol[x] = 0;
			var nameLength = areaNames[y][x].length;
			if (nameLength > longestNameLengthByCol[x]) {
				longestNameLengthByCol[x] = nameLength;
			}
		}
	}

	return areaNames.map(function (row) {
		return `"${row.map(function (name, x) {
			return (name + " ".repeat(longestNameLengthByCol[x])).slice(0, longestNameLengthByCol[x]);
		}).join(" ")}"`;
	});
};