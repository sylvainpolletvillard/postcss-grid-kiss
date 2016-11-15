exports.range = function(start, end){
	return [...new Array(end - start).keys()].map(i => i + start)
}

exports.indentMultiline = function(lines, indent){
	return "\n" + lines.map(line => indent + line).join("\n");
}