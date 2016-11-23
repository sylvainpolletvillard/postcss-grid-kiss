const
	postcss = require('postcss'),
	gridkiss =  require('../index'),
	presets = require('./presets');

let processor = postcss([ gridkiss ]);

window.onload = function() {

	const
		input  = document.querySelector("#input"),
		output = document.querySelector("#output"),
		demo   = document.querySelector("#demo"),
		html   = document.querySelector("#html"),
		fallbackCheckbox = document.querySelector(".options input[type='checkbox']"),
		presetSelector = document.querySelector("select.presets");

	input.addEventListener("input", update);
	html.addEventListener("input", update);

	fallbackCheckbox.addEventListener("change", () => {
		updateProcessor();
		update();
	});

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

	function updateProcessor(){
		processor = postcss([ gridkiss({ fallback: fallbackCheckbox.checked }) ]);
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
