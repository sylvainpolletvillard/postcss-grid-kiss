function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.range = function (start, end) {
	return [].concat(_toConsumableArray(new Array(end - start).keys())).map(function (i) {
		return i + start;
	});
};

exports.indentMultiline = function (lines, indent) {
	return "\n" + lines.map(function (line) {
		return indent + line;
	}).join("\n");
};