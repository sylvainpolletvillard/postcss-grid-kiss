const
	postcss = require('postcss'),
	gridkiss =  require('../index'),
	presets = require('./presets');

let processor;

window.onload = function() {

	const
		input  = document.querySelector("#input"),
		output = document.querySelector("#output"),
		demo   = document.querySelector("#demo"),
		html   = document.querySelector("#html"),
		optionsInputs = [...document.querySelectorAll(".options input[type='checkbox']")],
		presetSelector = document.querySelector("select.presets");

	input.addEventListener("input", update);
	html.addEventListener("input", update);

	for(let option of optionsInputs){
		option.addEventListener("change", updateOptions);
	}

	presetSelector.innerHTML = presets.map((preset, index) => `<option value=${index}>${preset.name}</option>`);
	presetSelector.addEventListener("change", () => {
		selectPreset(presets[presetSelector.value]);
		update();
	});

	if (demo.contentDocument.readyState == 'complete') {
		init();
	} else {
		demo.onload = init;
	}

	function init(){
		selectPreset(presets[0]);
		updateProcessor();
		update();
	}

	function selectPreset(preset){
		input.value = preset.css;
		html.value = preset.html;
	}

	function updateOptions(){
		const options = {};
		for(let checkbox of optionsInputs){
			options[checkbox.parentElement.textContent.trim()] = checkbox;
		}
		options["screwIE"].disabled = !options["fallback"].checked;
		options["optimizeCalc"].disabled = !options["fallback"].checked;
		updateProcessor();
	}

	function updateProcessor(){
		const options = {};
		for(let checkbox of optionsInputs){
			options[checkbox.parentElement.textContent.trim()] = checkbox.checked;
		}
		processor = postcss([ gridkiss(options) ]);
		update();
	}

	function update(){
		demo.contentDocument.body.innerHTML = html.value;
		processor.process(input.value)
			.then(result => {
				output.textContent = result.css;
				const warnings = result.warnings().map(w => `<p class='warning'>${w.toString()}</p>`)
				if(warnings && warnings.length > 0){
					output.innerHTML = warnings.join('\n') + output.innerHTML;
				}
				setTimeout(() => {
					demo.contentDocument.querySelector("#css_injected").textContent = output.textContent;
				}, 10);
			})
			.catch(error => {
				output.innerHTML = `<p class='error'>${error.stack}</p>`
			})
	}

}
