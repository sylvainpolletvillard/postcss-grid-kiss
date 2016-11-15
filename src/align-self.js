exports.getAlignSelf = function(zone) {

	let topIndicator = zone.content.search(/↑|\^/),
	    bottomIndicator = zone.content.search(/↓|[^\w]v[^\w]/);

	if(topIndicator >= 0 && bottomIndicator > topIndicator)
		return "stretch"
	if(bottomIndicator >= 0 && topIndicator >= bottomIndicator)
		return "center"
	if(topIndicator >= 0)
		return "start"
	if(bottomIndicator >= 0)
		return "end"

	return null;
}