const
	findLastIndex = (arr, test) => arr.length - 1 - arr.slice().reverse().findIndex(test),

	indentMultiline = (lines, indent) => "\n" + lines.map(line => indent + line).join("\n")

module.exports = { findLastIndex, indentMultiline }