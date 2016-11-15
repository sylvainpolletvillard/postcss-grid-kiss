var postcss = require('postcss');
var gridkiss =  require('../index');

var processor = postcss([ gridkiss ]);

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
			demo.contentDocument.querySelector("#css_injected").textContent = output.textContent;
		}).catch(error => {
			output.innerHTML = `<p class='error'>${error.message}</p>`
		})
}