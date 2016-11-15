exports.getJustifySelf = function(zone) {

	let leftIndicator = zone.content.search(/←|</),
	    rightIndicator = zone.content.search(/→|>/);

	if(leftIndicator >= 0 && rightIndicator > leftIndicator)
		return "stretch"
	if(rightIndicator >= 0 && leftIndicator > rightIndicator)
		return "center"
	if(leftIndicator >= 0)
		return "start"
	if(rightIndicator >= 0)
		return "end"

	return null;
}