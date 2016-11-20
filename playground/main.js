var postcss = require('postcss');
var gridkiss =  require('../index');

var processor = postcss([ gridkiss ]);

window.onload = function(){

	var input = document.querySelector("#input");
	var output = document.querySelector("#output");
	var demo = document.querySelector("#demo");
	var html = document.querySelector("#html");

	input.addEventListener("input", update);
	html.addEventListener("input", update);
	if(demo.contentDocument.readyState  == 'complete'){ update(); }
	else { demo.onload = update; }

	function update(){
		demo.contentDocument.body.innerHTML = html.value;
		processor.process(input.value)
			.then(function (result) {
				output.textContent = result.css;
				var warnings = result.warnings();
				if(warnings && warnings.length > 0){
					output.innerHTML = warnings.map(function(warning){
						return `<p class='warning'>${warning.toString()}</p>`
					}).join('\n') + output.innerHTML;
				}
				setTimeout(() => {
					demo.contentDocument.querySelector("#css_injected").textContent = output.textContent;
				}, 10);
			}).catch(error => {
			output.innerHTML = `<p class='error'>${error.stack}</p>`
		})
	}

	var fallbackCheckbox = document.querySelector(".options input[type='checkbox']");
	fallbackCheckbox.addEventListener("change", function updateProcessor(){
		processor = postcss([ gridkiss({ fallback: this.checked }) ]);
		update();
	});
}