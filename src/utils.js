const
	range = (start, end) => Array(end - start).fill(0).map((_,i) => i + start),

	indentMultiline = (lines, indent) => "\n" + lines.map(line => indent + line).join("\n")

module.exports = { range, indentMultiline }