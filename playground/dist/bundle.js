/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const
		postcss = __webpack_require__(1),
		gridkiss =  __webpack_require__(54),
		presets = __webpack_require__(67);
	
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
	
		fallbackCheckbox.addEventListener("change", function updateProcessor(){
			processor = postcss([ gridkiss({ fallback: this.checked }) ]);
			update();
		});
	
		presetSelector.innerHTML = presets.map((preset, index) => `<option value=${index}>${preset.name}</option>`);
		presetSelector.addEventListener("change", () => selectPreset(presets[presetSelector.value]))
	
		if (demo.contentDocument.readyState == 'complete') {
			init();
		} else {
			demo.onload = init;
		}
	
	
		function init(){
			selectPreset(presets[0]);
		}
	
		function selectPreset(preset){
			input.textContent = preset.css;
			html.textContent = preset.html;
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _declaration = __webpack_require__(2);
	
	var _declaration2 = _interopRequireDefault(_declaration);
	
	var _processor = __webpack_require__(40);
	
	var _processor2 = _interopRequireDefault(_processor);
	
	var _stringify = __webpack_require__(39);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _comment = __webpack_require__(47);
	
	var _comment2 = _interopRequireDefault(_comment);
	
	var _atRule = __webpack_require__(48);
	
	var _atRule2 = _interopRequireDefault(_atRule);
	
	var _vendor = __webpack_require__(53);
	
	var _vendor2 = _interopRequireDefault(_vendor);
	
	var _parse = __webpack_require__(45);
	
	var _parse2 = _interopRequireDefault(_parse);
	
	var _list = __webpack_require__(51);
	
	var _list2 = _interopRequireDefault(_list);
	
	var _rule = __webpack_require__(50);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _root = __webpack_require__(52);
	
	var _root2 = _interopRequireDefault(_root);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Create a new {@link Processor} instance that will apply `plugins`
	 * as CSS processors.
	 *
	 * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
	 *        plugins. See {@link Processor#use} for plugin format.
	 *
	 * @return {Processor} Processor to process multiple CSS
	 *
	 * @example
	 * import postcss from 'postcss';
	 *
	 * postcss(plugins).process(css, { from, to }).then(result => {
	 *   console.log(result.css);
	 * });
	 *
	 * @namespace postcss
	 */
	function postcss() {
	  for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
	    plugins[_key] = arguments[_key];
	  }
	
	  if (plugins.length === 1 && Array.isArray(plugins[0])) {
	    plugins = plugins[0];
	  }
	  return new _processor2.default(plugins);
	}
	
	/**
	 * Creates a PostCSS plugin with a standard API.
	 *
	 * The newly-wrapped function will provide both the name and PostCSS
	 * version of the plugin.
	 *
	 * ```js
	 *  const processor = postcss([replace]);
	 *  processor.plugins[0].postcssPlugin  //=> 'postcss-replace'
	 *  processor.plugins[0].postcssVersion //=> '5.1.0'
	 * ```
	 *
	 * The plugin function receives 2 arguments: {@link Root}
	 * and {@link Result} instance. The function should mutate the provided
	 * `Root` node. Alternatively, you can create a new `Root` node
	 * and override the `result.root` property.
	 *
	 * ```js
	 * const cleaner = postcss.plugin('postcss-cleaner', () => {
	 *   return (root, result) => {
	 *     result.root = postcss.root();
	 *   };
	 * });
	 * ```
	 *
	 * As a convenience, plugins also expose a `process` method so that you can use
	 * them as standalone tools.
	 *
	 * ```js
	 * cleaner.process(css, options);
	 * // This is equivalent to:
	 * postcss([ cleaner(options) ]).process(css);
	 * ```
	 *
	 * Asynchronous plugins should return a `Promise` instance.
	 *
	 * ```js
	 * postcss.plugin('postcss-import', () => {
	 *   return (root, result) => {
	 *     return new Promise( (resolve, reject) => {
	 *       fs.readFile('base.css', (base) => {
	 *         root.prepend(base);
	 *         resolve();
	 *       });
	 *     });
	 *   };
	 * });
	 * ```
	 *
	 * Add warnings using the {@link Node#warn} method.
	 * Send data to other plugins using the {@link Result#messages} array.
	 *
	 * ```js
	 * postcss.plugin('postcss-caniuse-test', () => {
	 *   return (root, result) => {
	 *     css.walkDecls(decl => {
	 *       if ( !caniuse.support(decl.prop) ) {
	 *         decl.warn(result, 'Some browsers do not support ' + decl.prop);
	 *       }
	 *     });
	 *   };
	 * });
	 * ```
	 *
	 * @param {string} name          - PostCSS plugin name. Same as in `name`
	 *                                 property in `package.json`. It will be saved
	 *                                 in `plugin.postcssPlugin` property.
	 * @param {function} initializer - will receive plugin options
	 *                                 and should return {@link pluginFunction}
	 *
	 * @return {Plugin} PostCSS plugin
	 */
	postcss.plugin = function plugin(name, initializer) {
	  var creator = function creator() {
	    var transformer = initializer.apply(undefined, arguments);
	    transformer.postcssPlugin = name;
	    transformer.postcssVersion = new _processor2.default().version;
	    return transformer;
	  };
	
	  var cache = void 0;
	  Object.defineProperty(creator, 'postcss', {
	    get: function get() {
	      if (!cache) cache = creator();
	      return cache;
	    }
	  });
	
	  creator.process = function (root, opts) {
	    return postcss([creator(opts)]).process(root, opts);
	  };
	
	  return creator;
	};
	
	/**
	 * Default function to convert a node tree into a CSS string.
	 *
	 * @param {Node} node       - start node for stringifing. Usually {@link Root}.
	 * @param {builder} builder - function to concatenate CSS from node’s parts
	 *                            or generate string and source map
	 *
	 * @return {void}
	 *
	 * @function
	 */
	postcss.stringify = _stringify2.default;
	
	/**
	 * Parses source css and returns a new {@link Root} node,
	 * which contains the source CSS nodes.
	 *
	 * @param {string|toString} css   - string with input CSS or any object
	 *                                  with toString() method, like a Buffer
	 * @param {processOptions} [opts] - options with only `from` and `map` keys
	 *
	 * @return {Root} PostCSS AST
	 *
	 * @example
	 * // Simple CSS concatenation with source map support
	 * const root1 = postcss.parse(css1, { from: file1 });
	 * const root2 = postcss.parse(css2, { from: file2 });
	 * root1.append(root2).toResult().css;
	 *
	 * @function
	 */
	postcss.parse = _parse2.default;
	
	/**
	 * @member {vendor} - Contains the {@link vendor} module.
	 *
	 * @example
	 * postcss.vendor.unprefixed('-moz-tab') //=> ['tab']
	 */
	postcss.vendor = _vendor2.default;
	
	/**
	 * @member {list} - Contains the {@link list} module.
	 *
	 * @example
	 * postcss.list.space('5px calc(10% + 5px)') //=> ['5px', 'calc(10% + 5px)']
	 */
	postcss.list = _list2.default;
	
	/**
	 * Creates a new {@link Comment} node.
	 *
	 * @param {object} [defaults] - properties for the new node.
	 *
	 * @return {Comment} new Comment node
	 *
	 * @example
	 * postcss.comment({ text: 'test' })
	 */
	postcss.comment = function (defaults) {
	  return new _comment2.default(defaults);
	};
	
	/**
	 * Creates a new {@link AtRule} node.
	 *
	 * @param {object} [defaults] - properties for the new node.
	 *
	 * @return {AtRule} new AtRule node
	 *
	 * @example
	 * postcss.atRule({ name: 'charset' }).toString() //=> "@charset"
	 */
	postcss.atRule = function (defaults) {
	  return new _atRule2.default(defaults);
	};
	
	/**
	 * Creates a new {@link Declaration} node.
	 *
	 * @param {object} [defaults] - properties for the new node.
	 *
	 * @return {Declaration} new Declaration node
	 *
	 * @example
	 * postcss.decl({ prop: 'color', value: 'red' }).toString() //=> "color: red"
	 */
	postcss.decl = function (defaults) {
	  return new _declaration2.default(defaults);
	};
	
	/**
	 * Creates a new {@link Rule} node.
	 *
	 * @param {object} [defaults] - properties for the new node.
	 *
	 * @return {AtRule} new Rule node
	 *
	 * @example
	 * postcss.rule({ selector: 'a' }).toString() //=> "a {\n}"
	 */
	postcss.rule = function (defaults) {
	  return new _rule2.default(defaults);
	};
	
	/**
	 * Creates a new {@link Root} node.
	 *
	 * @param {object} [defaults] - properties for the new node.
	 *
	 * @return {Root} new Root node
	 *
	 * @example
	 * postcss.root({ after: '\n' }).toString() //=> "\n"
	 */
	postcss.root = function (defaults) {
	  return new _root2.default(defaults);
	};
	
	exports.default = postcss;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3Rjc3MuZXM2Il0sIm5hbWVzIjpbInBvc3Rjc3MiLCJwbHVnaW5zIiwibGVuZ3RoIiwiQXJyYXkiLCJpc0FycmF5IiwicGx1Z2luIiwibmFtZSIsImluaXRpYWxpemVyIiwiY3JlYXRvciIsInRyYW5zZm9ybWVyIiwicG9zdGNzc1BsdWdpbiIsInBvc3Rjc3NWZXJzaW9uIiwidmVyc2lvbiIsImNhY2hlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJwcm9jZXNzIiwicm9vdCIsIm9wdHMiLCJzdHJpbmdpZnkiLCJwYXJzZSIsInZlbmRvciIsImxpc3QiLCJjb21tZW50IiwiZGVmYXVsdHMiLCJhdFJ1bGUiLCJkZWNsIiwicnVsZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVNBLE9BQVQsR0FBNkI7QUFBQSxvQ0FBVEMsT0FBUztBQUFUQSxXQUFTO0FBQUE7O0FBQ3pCLE1BQUtBLFFBQVFDLE1BQVIsS0FBbUIsQ0FBbkIsSUFBd0JDLE1BQU1DLE9BQU4sQ0FBY0gsUUFBUSxDQUFSLENBQWQsQ0FBN0IsRUFBeUQ7QUFDckRBLGNBQVVBLFFBQVEsQ0FBUixDQUFWO0FBQ0g7QUFDRCxTQUFPLHdCQUFjQSxPQUFkLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0VBRCxRQUFRSyxNQUFSLEdBQWlCLFNBQVNBLE1BQVQsQ0FBZ0JDLElBQWhCLEVBQXNCQyxXQUF0QixFQUFtQztBQUNoRCxNQUFJQyxVQUFVLFNBQVZBLE9BQVUsR0FBbUI7QUFDN0IsUUFBSUMsY0FBY0YsdUNBQWxCO0FBQ0FFLGdCQUFZQyxhQUFaLEdBQTZCSixJQUE3QjtBQUNBRyxnQkFBWUUsY0FBWixHQUE4Qix5QkFBRCxDQUFrQkMsT0FBL0M7QUFDQSxXQUFPSCxXQUFQO0FBQ0gsR0FMRDs7QUFPQSxNQUFJSSxjQUFKO0FBQ0FDLFNBQU9DLGNBQVAsQ0FBc0JQLE9BQXRCLEVBQStCLFNBQS9CLEVBQTBDO0FBQ3RDUSxPQURzQyxpQkFDaEM7QUFDRixVQUFLLENBQUNILEtBQU4sRUFBY0EsUUFBUUwsU0FBUjtBQUNkLGFBQU9LLEtBQVA7QUFDSDtBQUpxQyxHQUExQzs7QUFPQUwsVUFBUVMsT0FBUixHQUFrQixVQUFVQyxJQUFWLEVBQWdCQyxJQUFoQixFQUFzQjtBQUNwQyxXQUFPbkIsUUFBUSxDQUFFUSxRQUFRVyxJQUFSLENBQUYsQ0FBUixFQUEyQkYsT0FBM0IsQ0FBbUNDLElBQW5DLEVBQXlDQyxJQUF6QyxDQUFQO0FBQ0gsR0FGRDs7QUFJQSxTQUFPWCxPQUFQO0FBQ0gsQ0FyQkQ7O0FBdUJBOzs7Ozs7Ozs7OztBQVdBUixRQUFRb0IsU0FBUjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBcEIsUUFBUXFCLEtBQVI7O0FBRUE7Ozs7OztBQU1BckIsUUFBUXNCLE1BQVI7O0FBRUE7Ozs7OztBQU1BdEIsUUFBUXVCLElBQVI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQXZCLFFBQVF3QixPQUFSLEdBQWtCO0FBQUEsU0FBWSxzQkFBWUMsUUFBWixDQUFaO0FBQUEsQ0FBbEI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQXpCLFFBQVEwQixNQUFSLEdBQWlCO0FBQUEsU0FBWSxxQkFBV0QsUUFBWCxDQUFaO0FBQUEsQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQXpCLFFBQVEyQixJQUFSLEdBQWU7QUFBQSxTQUFZLDBCQUFnQkYsUUFBaEIsQ0FBWjtBQUFBLENBQWY7O0FBRUE7Ozs7Ozs7Ozs7QUFVQXpCLFFBQVE0QixJQUFSLEdBQWU7QUFBQSxTQUFZLG1CQUFTSCxRQUFULENBQVo7QUFBQSxDQUFmOztBQUVBOzs7Ozs7Ozs7O0FBVUF6QixRQUFRa0IsSUFBUixHQUFlO0FBQUEsU0FBWSxtQkFBU08sUUFBVCxDQUFaO0FBQUEsQ0FBZjs7a0JBRWV6QixPIiwiZmlsZSI6InBvc3Rjc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5pbXBvcnQgUHJvY2Vzc29yICAgZnJvbSAnLi9wcm9jZXNzb3InO1xuaW1wb3J0IHN0cmluZ2lmeSAgIGZyb20gJy4vc3RyaW5naWZ5JztcbmltcG9ydCBDb21tZW50ICAgICBmcm9tICcuL2NvbW1lbnQnO1xuaW1wb3J0IEF0UnVsZSAgICAgIGZyb20gJy4vYXQtcnVsZSc7XG5pbXBvcnQgdmVuZG9yICAgICAgZnJvbSAnLi92ZW5kb3InO1xuaW1wb3J0IHBhcnNlICAgICAgIGZyb20gJy4vcGFyc2UnO1xuaW1wb3J0IGxpc3QgICAgICAgIGZyb20gJy4vbGlzdCc7XG5pbXBvcnQgUnVsZSAgICAgICAgZnJvbSAnLi9ydWxlJztcbmltcG9ydCBSb290ICAgICAgICBmcm9tICcuL3Jvb3QnO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyB7QGxpbmsgUHJvY2Vzc29yfSBpbnN0YW5jZSB0aGF0IHdpbGwgYXBwbHkgYHBsdWdpbnNgXG4gKiBhcyBDU1MgcHJvY2Vzc29ycy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxQbHVnaW58cGx1Z2luRnVuY3Rpb24+fFByb2Nlc3Nvcn0gcGx1Z2lucyAtIFBvc3RDU1NcbiAqICAgICAgICBwbHVnaW5zLiBTZWUge0BsaW5rIFByb2Nlc3NvciN1c2V9IGZvciBwbHVnaW4gZm9ybWF0LlxuICpcbiAqIEByZXR1cm4ge1Byb2Nlc3Nvcn0gUHJvY2Vzc29yIHRvIHByb2Nlc3MgbXVsdGlwbGUgQ1NTXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBwb3N0Y3NzIGZyb20gJ3Bvc3Rjc3MnO1xuICpcbiAqIHBvc3Rjc3MocGx1Z2lucykucHJvY2Vzcyhjc3MsIHsgZnJvbSwgdG8gfSkudGhlbihyZXN1bHQgPT4ge1xuICogICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAqIH0pO1xuICpcbiAqIEBuYW1lc3BhY2UgcG9zdGNzc1xuICovXG5mdW5jdGlvbiBwb3N0Y3NzKC4uLnBsdWdpbnMpIHtcbiAgICBpZiAoIHBsdWdpbnMubGVuZ3RoID09PSAxICYmIEFycmF5LmlzQXJyYXkocGx1Z2luc1swXSkgKSB7XG4gICAgICAgIHBsdWdpbnMgPSBwbHVnaW5zWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb2Nlc3NvcihwbHVnaW5zKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgUG9zdENTUyBwbHVnaW4gd2l0aCBhIHN0YW5kYXJkIEFQSS5cbiAqXG4gKiBUaGUgbmV3bHktd3JhcHBlZCBmdW5jdGlvbiB3aWxsIHByb3ZpZGUgYm90aCB0aGUgbmFtZSBhbmQgUG9zdENTU1xuICogdmVyc2lvbiBvZiB0aGUgcGx1Z2luLlxuICpcbiAqIGBgYGpzXG4gKiAgY29uc3QgcHJvY2Vzc29yID0gcG9zdGNzcyhbcmVwbGFjZV0pO1xuICogIHByb2Nlc3Nvci5wbHVnaW5zWzBdLnBvc3Rjc3NQbHVnaW4gIC8vPT4gJ3Bvc3Rjc3MtcmVwbGFjZSdcbiAqICBwcm9jZXNzb3IucGx1Z2luc1swXS5wb3N0Y3NzVmVyc2lvbiAvLz0+ICc1LjEuMCdcbiAqIGBgYFxuICpcbiAqIFRoZSBwbHVnaW4gZnVuY3Rpb24gcmVjZWl2ZXMgMiBhcmd1bWVudHM6IHtAbGluayBSb290fVxuICogYW5kIHtAbGluayBSZXN1bHR9IGluc3RhbmNlLiBUaGUgZnVuY3Rpb24gc2hvdWxkIG11dGF0ZSB0aGUgcHJvdmlkZWRcbiAqIGBSb290YCBub2RlLiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGNyZWF0ZSBhIG5ldyBgUm9vdGAgbm9kZVxuICogYW5kIG92ZXJyaWRlIHRoZSBgcmVzdWx0LnJvb3RgIHByb3BlcnR5LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBjbGVhbmVyID0gcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtY2xlYW5lcicsICgpID0+IHtcbiAqICAgcmV0dXJuIChyb290LCByZXN1bHQpID0+IHtcbiAqICAgICByZXN1bHQucm9vdCA9IHBvc3Rjc3Mucm9vdCgpO1xuICogICB9O1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBBcyBhIGNvbnZlbmllbmNlLCBwbHVnaW5zIGFsc28gZXhwb3NlIGEgYHByb2Nlc3NgIG1ldGhvZCBzbyB0aGF0IHlvdSBjYW4gdXNlXG4gKiB0aGVtIGFzIHN0YW5kYWxvbmUgdG9vbHMuXG4gKlxuICogYGBganNcbiAqIGNsZWFuZXIucHJvY2Vzcyhjc3MsIG9wdGlvbnMpO1xuICogLy8gVGhpcyBpcyBlcXVpdmFsZW50IHRvOlxuICogcG9zdGNzcyhbIGNsZWFuZXIob3B0aW9ucykgXSkucHJvY2Vzcyhjc3MpO1xuICogYGBgXG4gKlxuICogQXN5bmNocm9ub3VzIHBsdWdpbnMgc2hvdWxkIHJldHVybiBhIGBQcm9taXNlYCBpbnN0YW5jZS5cbiAqXG4gKiBgYGBqc1xuICogcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtaW1wb3J0JywgKCkgPT4ge1xuICogICByZXR1cm4gKHJvb3QsIHJlc3VsdCkgPT4ge1xuICogICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICogICAgICAgZnMucmVhZEZpbGUoJ2Jhc2UuY3NzJywgKGJhc2UpID0+IHtcbiAqICAgICAgICAgcm9vdC5wcmVwZW5kKGJhc2UpO1xuICogICAgICAgICByZXNvbHZlKCk7XG4gKiAgICAgICB9KTtcbiAqICAgICB9KTtcbiAqICAgfTtcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQWRkIHdhcm5pbmdzIHVzaW5nIHRoZSB7QGxpbmsgTm9kZSN3YXJufSBtZXRob2QuXG4gKiBTZW5kIGRhdGEgdG8gb3RoZXIgcGx1Z2lucyB1c2luZyB0aGUge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30gYXJyYXkuXG4gKlxuICogYGBganNcbiAqIHBvc3Rjc3MucGx1Z2luKCdwb3N0Y3NzLWNhbml1c2UtdGVzdCcsICgpID0+IHtcbiAqICAgcmV0dXJuIChyb290LCByZXN1bHQpID0+IHtcbiAqICAgICBjc3Mud2Fsa0RlY2xzKGRlY2wgPT4ge1xuICogICAgICAgaWYgKCAhY2FuaXVzZS5zdXBwb3J0KGRlY2wucHJvcCkgKSB7XG4gKiAgICAgICAgIGRlY2wud2FybihyZXN1bHQsICdTb21lIGJyb3dzZXJzIGRvIG5vdCBzdXBwb3J0ICcgKyBkZWNsLnByb3ApO1xuICogICAgICAgfVxuICogICAgIH0pO1xuICogICB9O1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgICAgICAtIFBvc3RDU1MgcGx1Z2luIG5hbWUuIFNhbWUgYXMgaW4gYG5hbWVgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5IGluIGBwYWNrYWdlLmpzb25gLiBJdCB3aWxsIGJlIHNhdmVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIGBwbHVnaW4ucG9zdGNzc1BsdWdpbmAgcHJvcGVydHkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBpbml0aWFsaXplciAtIHdpbGwgcmVjZWl2ZSBwbHVnaW4gb3B0aW9uc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgc2hvdWxkIHJldHVybiB7QGxpbmsgcGx1Z2luRnVuY3Rpb259XG4gKlxuICogQHJldHVybiB7UGx1Z2lufSBQb3N0Q1NTIHBsdWdpblxuICovXG5wb3N0Y3NzLnBsdWdpbiA9IGZ1bmN0aW9uIHBsdWdpbihuYW1lLCBpbml0aWFsaXplcikge1xuICAgIGxldCBjcmVhdG9yID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgbGV0IHRyYW5zZm9ybWVyID0gaW5pdGlhbGl6ZXIoLi4uYXJncyk7XG4gICAgICAgIHRyYW5zZm9ybWVyLnBvc3Rjc3NQbHVnaW4gID0gbmFtZTtcbiAgICAgICAgdHJhbnNmb3JtZXIucG9zdGNzc1ZlcnNpb24gPSAobmV3IFByb2Nlc3NvcigpKS52ZXJzaW9uO1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gICAgfTtcblxuICAgIGxldCBjYWNoZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRvciwgJ3Bvc3Rjc3MnLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIGlmICggIWNhY2hlICkgY2FjaGUgPSBjcmVhdG9yKCk7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNyZWF0b3IucHJvY2VzcyA9IGZ1bmN0aW9uIChyb290LCBvcHRzKSB7XG4gICAgICAgIHJldHVybiBwb3N0Y3NzKFsgY3JlYXRvcihvcHRzKSBdKS5wcm9jZXNzKHJvb3QsIG9wdHMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gY3JlYXRvcjtcbn07XG5cbi8qKlxuICogRGVmYXVsdCBmdW5jdGlvbiB0byBjb252ZXJ0IGEgbm9kZSB0cmVlIGludG8gYSBDU1Mgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgICAgICAtIHN0YXJ0IG5vZGUgZm9yIHN0cmluZ2lmaW5nLiBVc3VhbGx5IHtAbGluayBSb290fS5cbiAqIEBwYXJhbSB7YnVpbGRlcn0gYnVpbGRlciAtIGZ1bmN0aW9uIHRvIGNvbmNhdGVuYXRlIENTUyBmcm9tIG5vZGXigJlzIHBhcnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBnZW5lcmF0ZSBzdHJpbmcgYW5kIHNvdXJjZSBtYXBcbiAqXG4gKiBAcmV0dXJuIHt2b2lkfVxuICpcbiAqIEBmdW5jdGlvblxuICovXG5wb3N0Y3NzLnN0cmluZ2lmeSA9IHN0cmluZ2lmeTtcblxuLyoqXG4gKiBQYXJzZXMgc291cmNlIGNzcyBhbmQgcmV0dXJucyBhIG5ldyB7QGxpbmsgUm9vdH0gbm9kZSxcbiAqIHdoaWNoIGNvbnRhaW5zIHRoZSBzb3VyY2UgQ1NTIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHRvU3RyaW5nfSBjc3MgICAtIHN0cmluZyB3aXRoIGlucHV0IENTUyBvciBhbnkgb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRvU3RyaW5nKCkgbWV0aG9kLCBsaWtlIGEgQnVmZmVyXG4gKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBbb3B0c10gLSBvcHRpb25zIHdpdGggb25seSBgZnJvbWAgYW5kIGBtYXBgIGtleXNcbiAqXG4gKiBAcmV0dXJuIHtSb290fSBQb3N0Q1NTIEFTVFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTaW1wbGUgQ1NTIGNvbmNhdGVuYXRpb24gd2l0aCBzb3VyY2UgbWFwIHN1cHBvcnRcbiAqIGNvbnN0IHJvb3QxID0gcG9zdGNzcy5wYXJzZShjc3MxLCB7IGZyb206IGZpbGUxIH0pO1xuICogY29uc3Qgcm9vdDIgPSBwb3N0Y3NzLnBhcnNlKGNzczIsIHsgZnJvbTogZmlsZTIgfSk7XG4gKiByb290MS5hcHBlbmQocm9vdDIpLnRvUmVzdWx0KCkuY3NzO1xuICpcbiAqIEBmdW5jdGlvblxuICovXG5wb3N0Y3NzLnBhcnNlID0gcGFyc2U7XG5cbi8qKlxuICogQG1lbWJlciB7dmVuZG9yfSAtIENvbnRhaW5zIHRoZSB7QGxpbmsgdmVuZG9yfSBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MudmVuZG9yLnVucHJlZml4ZWQoJy1tb3otdGFiJykgLy89PiBbJ3RhYiddXG4gKi9cbnBvc3Rjc3MudmVuZG9yID0gdmVuZG9yO1xuXG4vKipcbiAqIEBtZW1iZXIge2xpc3R9IC0gQ29udGFpbnMgdGhlIHtAbGluayBsaXN0fSBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MubGlzdC5zcGFjZSgnNXB4IGNhbGMoMTAlICsgNXB4KScpIC8vPT4gWyc1cHgnLCAnY2FsYygxMCUgKyA1cHgpJ11cbiAqL1xucG9zdGNzcy5saXN0ID0gbGlzdDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHtAbGluayBDb21tZW50fSBub2RlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVmYXVsdHNdIC0gcHJvcGVydGllcyBmb3IgdGhlIG5ldyBub2RlLlxuICpcbiAqIEByZXR1cm4ge0NvbW1lbnR9IG5ldyBDb21tZW50IG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5jb21tZW50KHsgdGV4dDogJ3Rlc3QnIH0pXG4gKi9cbnBvc3Rjc3MuY29tbWVudCA9IGRlZmF1bHRzID0+IG5ldyBDb21tZW50KGRlZmF1bHRzKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHtAbGluayBBdFJ1bGV9IG5vZGUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IFtkZWZhdWx0c10gLSBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IG5vZGUuXG4gKlxuICogQHJldHVybiB7QXRSdWxlfSBuZXcgQXRSdWxlIG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5hdFJ1bGUoeyBuYW1lOiAnY2hhcnNldCcgfSkudG9TdHJpbmcoKSAvLz0+IFwiQGNoYXJzZXRcIlxuICovXG5wb3N0Y3NzLmF0UnVsZSA9IGRlZmF1bHRzID0+IG5ldyBBdFJ1bGUoZGVmYXVsdHMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIERlY2xhcmF0aW9ufSBub2RlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBbZGVmYXVsdHNdIC0gcHJvcGVydGllcyBmb3IgdGhlIG5ldyBub2RlLlxuICpcbiAqIEByZXR1cm4ge0RlY2xhcmF0aW9ufSBuZXcgRGVjbGFyYXRpb24gbm9kZVxuICpcbiAqIEBleGFtcGxlXG4gKiBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ3JlZCcgfSkudG9TdHJpbmcoKSAvLz0+IFwiY29sb3I6IHJlZFwiXG4gKi9cbnBvc3Rjc3MuZGVjbCA9IGRlZmF1bHRzID0+IG5ldyBEZWNsYXJhdGlvbihkZWZhdWx0cyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB7QGxpbmsgUnVsZX0gbm9kZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gW2RlZmF1bHRzXSAtIHByb3BlcnRpZXMgZm9yIHRoZSBuZXcgbm9kZS5cbiAqXG4gKiBAcmV0dXJuIHtBdFJ1bGV9IG5ldyBSdWxlIG5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogcG9zdGNzcy5ydWxlKHsgc2VsZWN0b3I6ICdhJyB9KS50b1N0cmluZygpIC8vPT4gXCJhIHtcXG59XCJcbiAqL1xucG9zdGNzcy5ydWxlID0gZGVmYXVsdHMgPT4gbmV3IFJ1bGUoZGVmYXVsdHMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIFJvb3R9IG5vZGUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IFtkZWZhdWx0c10gLSBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IG5vZGUuXG4gKlxuICogQHJldHVybiB7Um9vdH0gbmV3IFJvb3Qgbm9kZVxuICpcbiAqIEBleGFtcGxlXG4gKiBwb3N0Y3NzLnJvb3QoeyBhZnRlcjogJ1xcbicgfSkudG9TdHJpbmcoKSAvLz0+IFwiXFxuXCJcbiAqL1xucG9zdGNzcy5yb290ID0gZGVmYXVsdHMgPT4gbmV3IFJvb3QoZGVmYXVsdHMpO1xuXG5leHBvcnQgZGVmYXVsdCBwb3N0Y3NzO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	var _node = __webpack_require__(4);
	
	var _node2 = _interopRequireDefault(_node);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a CSS declaration.
	 *
	 * @extends Node
	 *
	 * @example
	 * const root = postcss.parse('a { color: black }');
	 * const decl = root.first.first;
	 * decl.type       //=> 'decl'
	 * decl.toString() //=> ' color: black'
	 */
	var Declaration = function (_Node) {
	    _inherits(Declaration, _Node);
	
	    function Declaration(defaults) {
	        _classCallCheck(this, Declaration);
	
	        var _this = _possibleConstructorReturn(this, _Node.call(this, defaults));
	
	        _this.type = 'decl';
	        return _this;
	    }
	
	    _createClass(Declaration, [{
	        key: '_value',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#_value was deprecated. Use Node#raws.value');
	            return this.raws.value;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#_value was deprecated. Use Node#raws.value');
	            this.raws.value = val;
	        }
	    }, {
	        key: '_important',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#_important was deprecated. Use Node#raws.important');
	            return this.raws.important;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#_important was deprecated. Use Node#raws.important');
	            this.raws.important = val;
	        }
	
	        /**
	         * @memberof Declaration#
	         * @member {string} prop - the declaration’s property name
	         *
	         * @example
	         * const root = postcss.parse('a { color: black }');
	         * const decl = root.first.first;
	         * decl.prop //=> 'color'
	         */
	
	        /**
	         * @memberof Declaration#
	         * @member {string} value - the declaration’s value
	         *
	         * @example
	         * const root = postcss.parse('a { color: black }');
	         * const decl = root.first.first;
	         * decl.value //=> 'black'
	         */
	
	        /**
	         * @memberof Declaration#
	         * @member {boolean} important - `true` if the declaration
	         *                               has an !important annotation.
	         *
	         * @example
	         * const root = postcss.parse('a { color: black !important; color: red }');
	         * root.first.first.important //=> true
	         * root.first.last.important  //=> undefined
	         */
	
	        /**
	         * @memberof Declaration#
	         * @member {object} raws - Information to generate byte-to-byte equal
	         *                         node string as it was in the origin input.
	         *
	         * Every parser saves its own properties,
	         * but the default CSS parser uses:
	         *
	         * * `before`: the space symbols before the node. It also stores `*`
	         *   and `_` symbols before the declaration (IE hack).
	         * * `between`: the symbols between the property and value
	         *   for declarations, selector and `{` for rules, or last parameter
	         *   and `{` for at-rules.
	         * * `important`: the content of the important statement,
	         *   if it is not just `!important`.
	         *
	         * PostCSS cleans declaration from comments and extra spaces,
	         * but it stores origin content in raws properties.
	         * As such, if you don’t change a declaration’s value,
	         * PostCSS will use the raw value with comments.
	         *
	         * @example
	         * const root = postcss.parse('a {\n  color:black\n}')
	         * root.first.first.raws //=> { before: '\n  ', between: ':' }
	         */
	
	    }]);
	
	    return Declaration;
	}(_node2.default);
	
	exports.default = Declaration;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY2xhcmF0aW9uLmVzNiJdLCJuYW1lcyI6WyJEZWNsYXJhdGlvbiIsImRlZmF1bHRzIiwidHlwZSIsInJhd3MiLCJ2YWx1ZSIsInZhbCIsImltcG9ydGFudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7O0lBV01BLFc7OztBQUVGLHlCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQUEscURBQ2xCLGlCQUFNQSxRQUFOLENBRGtCOztBQUVsQixjQUFLQyxJQUFMLEdBQVksTUFBWjtBQUZrQjtBQUdyQjs7Ozs0QkFFWTtBQUNULG9DQUFTLGlEQUFUO0FBQ0EsbUJBQU8sS0FBS0MsSUFBTCxDQUFVQyxLQUFqQjtBQUNILFM7MEJBRVVDLEcsRUFBSztBQUNaLG9DQUFTLGlEQUFUO0FBQ0EsaUJBQUtGLElBQUwsQ0FBVUMsS0FBVixHQUFrQkMsR0FBbEI7QUFDSDs7OzRCQUVnQjtBQUNiLG9DQUFTLHlEQUFUO0FBQ0EsbUJBQU8sS0FBS0YsSUFBTCxDQUFVRyxTQUFqQjtBQUNILFM7MEJBRWNELEcsRUFBSztBQUNoQixvQ0FBUyx5REFBVDtBQUNBLGlCQUFLRixJQUFMLENBQVVHLFNBQVYsR0FBc0JELEdBQXRCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQTRCV0wsVyIsImZpbGUiOiJkZWNsYXJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB3YXJuT25jZSBmcm9tICcuL3dhcm4tb25jZSc7XG5pbXBvcnQgTm9kZSAgICAgZnJvbSAnLi9ub2RlJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ1NTIGRlY2xhcmF0aW9uLlxuICpcbiAqIEBleHRlbmRzIE5vZGVcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2EgeyBjb2xvcjogYmxhY2sgfScpO1xuICogY29uc3QgZGVjbCA9IHJvb3QuZmlyc3QuZmlyc3Q7XG4gKiBkZWNsLnR5cGUgICAgICAgLy89PiAnZGVjbCdcbiAqIGRlY2wudG9TdHJpbmcoKSAvLz0+ICcgY29sb3I6IGJsYWNrJ1xuICovXG5jbGFzcyBEZWNsYXJhdGlvbiBleHRlbmRzIE5vZGUge1xuXG4gICAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICAgICAgc3VwZXIoZGVmYXVsdHMpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZGVjbCc7XG4gICAgfVxuXG4gICAgZ2V0IF92YWx1ZSgpIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjX3ZhbHVlIHdhcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLnZhbHVlJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJhd3MudmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IF92YWx1ZSh2YWwpIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjX3ZhbHVlIHdhcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLnZhbHVlJyk7XG4gICAgICAgIHRoaXMucmF3cy52YWx1ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBnZXQgX2ltcG9ydGFudCgpIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjX2ltcG9ydGFudCB3YXMgZGVwcmVjYXRlZC4gVXNlIE5vZGUjcmF3cy5pbXBvcnRhbnQnKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5pbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgc2V0IF9pbXBvcnRhbnQodmFsKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI19pbXBvcnRhbnQgd2FzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuaW1wb3J0YW50Jyk7XG4gICAgICAgIHRoaXMucmF3cy5pbXBvcnRhbnQgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIERlY2xhcmF0aW9uI1xuICAgICAqIEBtZW1iZXIge3N0cmluZ30gcHJvcCAtIHRoZSBkZWNsYXJhdGlvbuKAmXMgcHJvcGVydHkgbmFtZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYSB7IGNvbG9yOiBibGFjayB9Jyk7XG4gICAgICogY29uc3QgZGVjbCA9IHJvb3QuZmlyc3QuZmlyc3Q7XG4gICAgICogZGVjbC5wcm9wIC8vPT4gJ2NvbG9yJ1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIERlY2xhcmF0aW9uI1xuICAgICAqIEBtZW1iZXIge3N0cmluZ30gdmFsdWUgLSB0aGUgZGVjbGFyYXRpb27igJlzIHZhbHVlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhIHsgY29sb3I6IGJsYWNrIH0nKTtcbiAgICAgKiBjb25zdCBkZWNsID0gcm9vdC5maXJzdC5maXJzdDtcbiAgICAgKiBkZWNsLnZhbHVlIC8vPT4gJ2JsYWNrJ1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIERlY2xhcmF0aW9uI1xuICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IGltcG9ydGFudCAtIGB0cnVlYCBpZiB0aGUgZGVjbGFyYXRpb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXMgYW4gIWltcG9ydGFudCBhbm5vdGF0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYSB7IGNvbG9yOiBibGFjayAhaW1wb3J0YW50OyBjb2xvcjogcmVkIH0nKTtcbiAgICAgKiByb290LmZpcnN0LmZpcnN0LmltcG9ydGFudCAvLz0+IHRydWVcbiAgICAgKiByb290LmZpcnN0Lmxhc3QuaW1wb3J0YW50ICAvLz0+IHVuZGVmaW5lZFxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIERlY2xhcmF0aW9uI1xuICAgICAqIEBtZW1iZXIge29iamVjdH0gcmF3cyAtIEluZm9ybWF0aW9uIHRvIGdlbmVyYXRlIGJ5dGUtdG8tYnl0ZSBlcXVhbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgc3RyaW5nIGFzIGl0IHdhcyBpbiB0aGUgb3JpZ2luIGlucHV0LlxuICAgICAqXG4gICAgICogRXZlcnkgcGFyc2VyIHNhdmVzIGl0cyBvd24gcHJvcGVydGllcyxcbiAgICAgKiBidXQgdGhlIGRlZmF1bHQgQ1NTIHBhcnNlciB1c2VzOlxuICAgICAqXG4gICAgICogKiBgYmVmb3JlYDogdGhlIHNwYWNlIHN5bWJvbHMgYmVmb3JlIHRoZSBub2RlLiBJdCBhbHNvIHN0b3JlcyBgKmBcbiAgICAgKiAgIGFuZCBgX2Agc3ltYm9scyBiZWZvcmUgdGhlIGRlY2xhcmF0aW9uIChJRSBoYWNrKS5cbiAgICAgKiAqIGBiZXR3ZWVuYDogdGhlIHN5bWJvbHMgYmV0d2VlbiB0aGUgcHJvcGVydHkgYW5kIHZhbHVlXG4gICAgICogICBmb3IgZGVjbGFyYXRpb25zLCBzZWxlY3RvciBhbmQgYHtgIGZvciBydWxlcywgb3IgbGFzdCBwYXJhbWV0ZXJcbiAgICAgKiAgIGFuZCBge2AgZm9yIGF0LXJ1bGVzLlxuICAgICAqICogYGltcG9ydGFudGA6IHRoZSBjb250ZW50IG9mIHRoZSBpbXBvcnRhbnQgc3RhdGVtZW50LFxuICAgICAqICAgaWYgaXQgaXMgbm90IGp1c3QgYCFpbXBvcnRhbnRgLlxuICAgICAqXG4gICAgICogUG9zdENTUyBjbGVhbnMgZGVjbGFyYXRpb24gZnJvbSBjb21tZW50cyBhbmQgZXh0cmEgc3BhY2VzLFxuICAgICAqIGJ1dCBpdCBzdG9yZXMgb3JpZ2luIGNvbnRlbnQgaW4gcmF3cyBwcm9wZXJ0aWVzLlxuICAgICAqIEFzIHN1Y2gsIGlmIHlvdSBkb27igJl0IGNoYW5nZSBhIGRlY2xhcmF0aW9u4oCZcyB2YWx1ZSxcbiAgICAgKiBQb3N0Q1NTIHdpbGwgdXNlIHRoZSByYXcgdmFsdWUgd2l0aCBjb21tZW50cy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2Ege1xcbiAgY29sb3I6YmxhY2tcXG59JylcbiAgICAgKiByb290LmZpcnN0LmZpcnN0LnJhd3MgLy89PiB7IGJlZm9yZTogJ1xcbiAgJywgYmV0d2VlbjogJzonIH1cbiAgICAgKi9cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWNsYXJhdGlvbjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = warnOnce;
	var printed = {};
	
	function warnOnce(message) {
	    if (printed[message]) return;
	    printed[message] = true;
	
	    if (typeof console !== 'undefined' && console.warn) console.warn(message);
	}
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhcm4tb25jZS5lczYiXSwibmFtZXMiOlsid2Fybk9uY2UiLCJwcmludGVkIiwibWVzc2FnZSIsImNvbnNvbGUiLCJ3YXJuIl0sIm1hcHBpbmdzIjoiOzs7a0JBRXdCQSxRO0FBRnhCLElBQUlDLFVBQVUsRUFBZDs7QUFFZSxTQUFTRCxRQUFULENBQWtCRSxPQUFsQixFQUEyQjtBQUN0QyxRQUFLRCxRQUFRQyxPQUFSLENBQUwsRUFBd0I7QUFDeEJELFlBQVFDLE9BQVIsSUFBbUIsSUFBbkI7O0FBRUEsUUFBSyxPQUFPQyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDQSxRQUFRQyxJQUEvQyxFQUFzREQsUUFBUUMsSUFBUixDQUFhRixPQUFiO0FBQ3pEIiwiZmlsZSI6Indhcm4tb25jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwcmludGVkID0geyB9O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3YXJuT25jZShtZXNzYWdlKSB7XG4gICAgaWYgKCBwcmludGVkW21lc3NhZ2VdICkgcmV0dXJuO1xuICAgIHByaW50ZWRbbWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgaWYgKCB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuICkgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _cssSyntaxError = __webpack_require__(5);
	
	var _cssSyntaxError2 = _interopRequireDefault(_cssSyntaxError);
	
	var _stringifier = __webpack_require__(38);
	
	var _stringifier2 = _interopRequireDefault(_stringifier);
	
	var _stringify = __webpack_require__(39);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var cloneNode = function cloneNode(obj, parent) {
	    var cloned = new obj.constructor();
	
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        var value = obj[i];
	        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	        if (i === 'parent' && type === 'object') {
	            if (parent) cloned[i] = parent;
	        } else if (i === 'source') {
	            cloned[i] = value;
	        } else if (value instanceof Array) {
	            cloned[i] = value.map(function (j) {
	                return cloneNode(j, cloned);
	            });
	        } else if (i !== 'before' && i !== 'after' && i !== 'between' && i !== 'semicolon') {
	            if (type === 'object' && value !== null) value = cloneNode(value);
	            cloned[i] = value;
	        }
	    }
	
	    return cloned;
	};
	
	/**
	 * All node classes inherit the following common methods.
	 *
	 * @abstract
	 */
	
	var Node = function () {
	
	    /**
	     * @param {object} [defaults] - value for node properties
	     */
	    function Node() {
	        var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        _classCallCheck(this, Node);
	
	        this.raws = {};
	        for (var name in defaults) {
	            this[name] = defaults[name];
	        }
	    }
	
	    /**
	     * Returns a CssSyntaxError instance containing the original position
	     * of the node in the source, showing line and column numbers and also
	     * a small excerpt to facilitate debugging.
	     *
	     * If present, an input source map will be used to get the original position
	     * of the source, even from a previous compilation step
	     * (e.g., from Sass compilation).
	     *
	     * This method produces very useful error messages.
	     *
	     * @param {string} message     - error description
	     * @param {object} [opts]      - options
	     * @param {string} opts.plugin - plugin name that created this error.
	     *                               PostCSS will set it automatically.
	     * @param {string} opts.word   - a word inside a node’s string that should
	     *                               be highlighted as the source of the error
	     * @param {number} opts.index  - an index inside a node’s string that should
	     *                               be highlighted as the source of the error
	     *
	     * @return {CssSyntaxError} error object to throw it
	     *
	     * @example
	     * if ( !variables[name] ) {
	     *   throw decl.error('Unknown variable ' + name, { word: name });
	     *   // CssSyntaxError: postcss-vars:a.sass:4:3: Unknown variable $black
	     *   //   color: $black
	     *   // a
	     *   //          ^
	     *   //   background: white
	     * }
	     */
	
	
	    Node.prototype.error = function error(message) {
	        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        if (this.source) {
	            var pos = this.positionBy(opts);
	            return this.source.input.error(message, pos.line, pos.column, opts);
	        } else {
	            return new _cssSyntaxError2.default(message);
	        }
	    };
	
	    /**
	     * This method is provided as a convenience wrapper for {@link Result#warn}.
	     *
	     * @param {Result} result      - the {@link Result} instance
	     *                               that will receive the warning
	     * @param {string} text        - warning message
	     * @param {object} [opts]      - options
	     * @param {string} opts.plugin - plugin name that created this warning.
	     *                               PostCSS will set it automatically.
	     * @param {string} opts.word   - a word inside a node’s string that should
	     *                               be highlighted as the source of the warning
	     * @param {number} opts.index  - an index inside a node’s string that should
	     *                               be highlighted as the source of the warning
	     *
	     * @return {Warning} created warning object
	     *
	     * @example
	     * const plugin = postcss.plugin('postcss-deprecated', () => {
	     *   return (root, result) => {
	     *     root.walkDecls('bad', decl => {
	     *       decl.warn(result, 'Deprecated property bad');
	     *     });
	     *   };
	     * });
	     */
	
	
	    Node.prototype.warn = function warn(result, text, opts) {
	        var data = { node: this };
	        for (var i in opts) {
	            data[i] = opts[i];
	        }return result.warn(text, data);
	    };
	
	    /**
	     * Removes the node from its parent and cleans the parent properties
	     * from the node and its children.
	     *
	     * @example
	     * if ( decl.prop.match(/^-webkit-/) ) {
	     *   decl.remove();
	     * }
	     *
	     * @return {Node} node to make calls chain
	     */
	
	
	    Node.prototype.remove = function remove() {
	        if (this.parent) {
	            this.parent.removeChild(this);
	        }
	        this.parent = undefined;
	        return this;
	    };
	
	    /**
	     * Returns a CSS string representing the node.
	     *
	     * @param {stringifier|syntax} [stringifier] - a syntax to use
	     *                                             in string generation
	     *
	     * @return {string} CSS string of this node
	     *
	     * @example
	     * postcss.rule({ selector: 'a' }).toString() //=> "a {}"
	     */
	
	
	    Node.prototype.toString = function toString() {
	        var stringifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _stringify2.default;
	
	        if (stringifier.stringify) stringifier = stringifier.stringify;
	        var result = '';
	        stringifier(this, function (i) {
	            result += i;
	        });
	        return result;
	    };
	
	    /**
	     * Returns a clone of the node.
	     *
	     * The resulting cloned node and its (cloned) children will have
	     * a clean parent and code style properties.
	     *
	     * @param {object} [overrides] - new properties to override in the clone.
	     *
	     * @example
	     * const cloned = decl.clone({ prop: '-moz-' + decl.prop });
	     * cloned.raws.before  //=> undefined
	     * cloned.parent       //=> undefined
	     * cloned.toString()   //=> -moz-transform: scale(0)
	     *
	     * @return {Node} clone of the node
	     */
	
	
	    Node.prototype.clone = function clone() {
	        var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var cloned = cloneNode(this);
	        for (var name in overrides) {
	            cloned[name] = overrides[name];
	        }
	        return cloned;
	    };
	
	    /**
	     * Shortcut to clone the node and insert the resulting cloned node
	     * before the current node.
	     *
	     * @param {object} [overrides] - new properties to override in the clone.
	     *
	     * @example
	     * decl.cloneBefore({ prop: '-moz-' + decl.prop });
	     *
	     * @return {Node} - new node
	     */
	
	
	    Node.prototype.cloneBefore = function cloneBefore() {
	        var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var cloned = this.clone(overrides);
	        this.parent.insertBefore(this, cloned);
	        return cloned;
	    };
	
	    /**
	     * Shortcut to clone the node and insert the resulting cloned node
	     * after the current node.
	     *
	     * @param {object} [overrides] - new properties to override in the clone.
	     *
	     * @return {Node} - new node
	     */
	
	
	    Node.prototype.cloneAfter = function cloneAfter() {
	        var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var cloned = this.clone(overrides);
	        this.parent.insertAfter(this, cloned);
	        return cloned;
	    };
	
	    /**
	     * Inserts node(s) before the current node and removes the current node.
	     *
	     * @param {...Node} nodes - node(s) to replace current one
	     *
	     * @example
	     * if ( atrule.name == 'mixin' ) {
	     *   atrule.replaceWith(mixinRules[atrule.params]);
	     * }
	     *
	     * @return {Node} current node to methods chain
	     */
	
	
	    Node.prototype.replaceWith = function replaceWith() {
	        if (this.parent) {
	            for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
	                nodes[_key] = arguments[_key];
	            }
	
	            for (var _iterator = nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                var _ref;
	
	                if (_isArray) {
	                    if (_i >= _iterator.length) break;
	                    _ref = _iterator[_i++];
	                } else {
	                    _i = _iterator.next();
	                    if (_i.done) break;
	                    _ref = _i.value;
	                }
	
	                var node = _ref;
	
	                this.parent.insertBefore(this, node);
	            }
	
	            this.remove();
	        }
	
	        return this;
	    };
	
	    /**
	     * Removes the node from its current parent and inserts it
	     * at the end of `newParent`.
	     *
	     * This will clean the `before` and `after` code {@link Node#raws} data
	     * from the node and replace them with the indentation style of `newParent`.
	     * It will also clean the `between` property
	     * if `newParent` is in another {@link Root}.
	     *
	     * @param {Container} newParent - container node where the current node
	     *                                will be moved
	     *
	     * @example
	     * atrule.moveTo(atrule.root());
	     *
	     * @return {Node} current node to methods chain
	     */
	
	
	    Node.prototype.moveTo = function moveTo(newParent) {
	        this.cleanRaws(this.root() === newParent.root());
	        this.remove();
	        newParent.append(this);
	        return this;
	    };
	
	    /**
	     * Removes the node from its current parent and inserts it into
	     * a new parent before `otherNode`.
	     *
	     * This will also clean the node’s code style properties just as it would
	     * in {@link Node#moveTo}.
	     *
	     * @param {Node} otherNode - node that will be before current node
	     *
	     * @return {Node} current node to methods chain
	     */
	
	
	    Node.prototype.moveBefore = function moveBefore(otherNode) {
	        this.cleanRaws(this.root() === otherNode.root());
	        this.remove();
	        otherNode.parent.insertBefore(otherNode, this);
	        return this;
	    };
	
	    /**
	     * Removes the node from its current parent and inserts it into
	     * a new parent after `otherNode`.
	     *
	     * This will also clean the node’s code style properties just as it would
	     * in {@link Node#moveTo}.
	     *
	     * @param {Node} otherNode - node that will be after current node
	     *
	     * @return {Node} current node to methods chain
	     */
	
	
	    Node.prototype.moveAfter = function moveAfter(otherNode) {
	        this.cleanRaws(this.root() === otherNode.root());
	        this.remove();
	        otherNode.parent.insertAfter(otherNode, this);
	        return this;
	    };
	
	    /**
	     * Returns the next child of the node’s parent.
	     * Returns `undefined` if the current node is the last child.
	     *
	     * @return {Node|undefined} next node
	     *
	     * @example
	     * if ( comment.text === 'delete next' ) {
	     *   const next = comment.next();
	     *   if ( next ) {
	     *     next.remove();
	     *   }
	     * }
	     */
	
	
	    Node.prototype.next = function next() {
	        var index = this.parent.index(this);
	        return this.parent.nodes[index + 1];
	    };
	
	    /**
	     * Returns the previous child of the node’s parent.
	     * Returns `undefined` if the current node is the first child.
	     *
	     * @return {Node|undefined} previous node
	     *
	     * @example
	     * const annotation = decl.prev();
	     * if ( annotation.type == 'comment' ) {
	     *  readAnnotation(annotation.text);
	     * }
	     */
	
	
	    Node.prototype.prev = function prev() {
	        var index = this.parent.index(this);
	        return this.parent.nodes[index - 1];
	    };
	
	    Node.prototype.toJSON = function toJSON() {
	        var fixed = {};
	
	        for (var name in this) {
	            if (!this.hasOwnProperty(name)) continue;
	            if (name === 'parent') continue;
	            var value = this[name];
	
	            if (value instanceof Array) {
	                fixed[name] = value.map(function (i) {
	                    if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && i.toJSON) {
	                        return i.toJSON();
	                    } else {
	                        return i;
	                    }
	                });
	            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.toJSON) {
	                fixed[name] = value.toJSON();
	            } else {
	                fixed[name] = value;
	            }
	        }
	
	        return fixed;
	    };
	
	    /**
	     * Returns a {@link Node#raws} value. If the node is missing
	     * the code style property (because the node was manually built or cloned),
	     * PostCSS will try to autodetect the code style property by looking
	     * at other nodes in the tree.
	     *
	     * @param {string} prop          - name of code style property
	     * @param {string} [defaultType] - name of default value, it can be missed
	     *                                 if the value is the same as prop
	     *
	     * @example
	     * const root = postcss.parse('a { background: white }');
	     * root.nodes[0].append({ prop: 'color', value: 'black' });
	     * root.nodes[0].nodes[1].raws.before   //=> undefined
	     * root.nodes[0].nodes[1].raw('before') //=> ' '
	     *
	     * @return {string} code style value
	     */
	
	
	    Node.prototype.raw = function raw(prop, defaultType) {
	        var str = new _stringifier2.default();
	        return str.raw(this, prop, defaultType);
	    };
	
	    /**
	     * Finds the Root instance of the node’s tree.
	     *
	     * @example
	     * root.nodes[0].nodes[0].root() === root
	     *
	     * @return {Root} root parent
	     */
	
	
	    Node.prototype.root = function root() {
	        var result = this;
	        while (result.parent) {
	            result = result.parent;
	        }return result;
	    };
	
	    Node.prototype.cleanRaws = function cleanRaws(keepBetween) {
	        delete this.raws.before;
	        delete this.raws.after;
	        if (!keepBetween) delete this.raws.between;
	    };
	
	    Node.prototype.positionInside = function positionInside(index) {
	        var string = this.toString();
	        var column = this.source.start.column;
	        var line = this.source.start.line;
	
	        for (var i = 0; i < index; i++) {
	            if (string[i] === '\n') {
	                column = 1;
	                line += 1;
	            } else {
	                column += 1;
	            }
	        }
	
	        return { line: line, column: column };
	    };
	
	    Node.prototype.positionBy = function positionBy(opts) {
	        var pos = this.source.start;
	        if (opts.index) {
	            pos = this.positionInside(opts.index);
	        } else if (opts.word) {
	            var index = this.toString().indexOf(opts.word);
	            if (index !== -1) pos = this.positionInside(index);
	        }
	        return pos;
	    };
	
	    Node.prototype.removeSelf = function removeSelf() {
	        (0, _warnOnce2.default)('Node#removeSelf is deprecated. Use Node#remove.');
	        return this.remove();
	    };
	
	    Node.prototype.replace = function replace(nodes) {
	        (0, _warnOnce2.default)('Node#replace is deprecated. Use Node#replaceWith');
	        return this.replaceWith(nodes);
	    };
	
	    Node.prototype.style = function style(own, detect) {
	        (0, _warnOnce2.default)('Node#style() is deprecated. Use Node#raw()');
	        return this.raw(own, detect);
	    };
	
	    Node.prototype.cleanStyles = function cleanStyles(keepBetween) {
	        (0, _warnOnce2.default)('Node#cleanStyles() is deprecated. Use Node#cleanRaws()');
	        return this.cleanRaws(keepBetween);
	    };
	
	    _createClass(Node, [{
	        key: 'before',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#before is deprecated. Use Node#raws.before');
	            return this.raws.before;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#before is deprecated. Use Node#raws.before');
	            this.raws.before = val;
	        }
	    }, {
	        key: 'between',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#between is deprecated. Use Node#raws.between');
	            return this.raws.between;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#between is deprecated. Use Node#raws.between');
	            this.raws.between = val;
	        }
	
	        /**
	         * @memberof Node#
	         * @member {string} type - String representing the node’s type.
	         *                         Possible values are `root`, `atrule`, `rule`,
	         *                         `decl`, or `comment`.
	         *
	         * @example
	         * postcss.decl({ prop: 'color', value: 'black' }).type //=> 'decl'
	         */
	
	        /**
	         * @memberof Node#
	         * @member {Container} parent - the node’s parent node.
	         *
	         * @example
	         * root.nodes[0].parent == root;
	         */
	
	        /**
	         * @memberof Node#
	         * @member {source} source - the input source of the node
	         *
	         * The property is used in source map generation.
	         *
	         * If you create a node manually (e.g., with `postcss.decl()`),
	         * that node will not have a `source` property and will be absent
	         * from the source map. For this reason, the plugin developer should
	         * consider cloning nodes to create new ones (in which case the new node’s
	         * source will reference the original, cloned node) or setting
	         * the `source` property manually.
	         *
	         * ```js
	         * // Bad
	         * const prefixed = postcss.decl({
	         *   prop: '-moz-' + decl.prop,
	         *   value: decl.value
	         * });
	         *
	         * // Good
	         * const prefixed = decl.clone({ prop: '-moz-' + decl.prop });
	         * ```
	         *
	         * ```js
	         * if ( atrule.name == 'add-link' ) {
	         *   const rule = postcss.rule({ selector: 'a', source: atrule.source });
	         *   atrule.parent.insertBefore(atrule, rule);
	         * }
	         * ```
	         *
	         * @example
	         * decl.source.input.from //=> '/home/ai/a.sass'
	         * decl.source.start      //=> { line: 10, column: 2 }
	         * decl.source.end        //=> { line: 10, column: 12 }
	         */
	
	        /**
	         * @memberof Node#
	         * @member {object} raws - Information to generate byte-to-byte equal
	         *                         node string as it was in the origin input.
	         *
	         * Every parser saves its own properties,
	         * but the default CSS parser uses:
	         *
	         * * `before`: the space symbols before the node. It also stores `*`
	         *   and `_` symbols before the declaration (IE hack).
	         * * `after`: the space symbols after the last child of the node
	         *   to the end of the node.
	         * * `between`: the symbols between the property and value
	         *   for declarations, selector and `{` for rules, or last parameter
	         *   and `{` for at-rules.
	         * * `semicolon`: contains true if the last child has
	         *   an (optional) semicolon.
	         * * `afterName`: the space between the at-rule name and its parameters.
	         * * `left`: the space symbols between `/*` and the comment’s text.
	         * * `right`: the space symbols between the comment’s text
	         *   and <code>*&#47;</code>.
	         * * `important`: the content of the important statement,
	         *   if it is not just `!important`.
	         *
	         * PostCSS cleans selectors, declaration values and at-rule parameters
	         * from comments and extra spaces, but it stores origin content in raws
	         * properties. As such, if you don’t change a declaration’s value,
	         * PostCSS will use the raw value with comments.
	         *
	         * @example
	         * const root = postcss.parse('a {\n  color:black\n}')
	         * root.first.first.raws //=> { before: '\n  ', between: ':' }
	         */
	
	    }]);
	
	    return Node;
	}();
	
	exports.default = Node;
	
	/**
	 * @typedef {object} position
	 * @property {number} line   - source line in file
	 * @property {number} column - source column in file
	 */
	
	/**
	 * @typedef {object} source
	 * @property {Input} input    - {@link Input} with input file
	 * @property {position} start - The starting position of the node’s source
	 * @property {position} end   - The ending position of the node’s source
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUuZXM2Il0sIm5hbWVzIjpbImNsb25lTm9kZSIsIm9iaiIsInBhcmVudCIsImNsb25lZCIsImNvbnN0cnVjdG9yIiwiaSIsImhhc093blByb3BlcnR5IiwidmFsdWUiLCJ0eXBlIiwiQXJyYXkiLCJtYXAiLCJqIiwiTm9kZSIsImRlZmF1bHRzIiwicmF3cyIsIm5hbWUiLCJlcnJvciIsIm1lc3NhZ2UiLCJvcHRzIiwic291cmNlIiwicG9zIiwicG9zaXRpb25CeSIsImlucHV0IiwibGluZSIsImNvbHVtbiIsIndhcm4iLCJyZXN1bHQiLCJ0ZXh0IiwiZGF0YSIsIm5vZGUiLCJyZW1vdmUiLCJyZW1vdmVDaGlsZCIsInVuZGVmaW5lZCIsInRvU3RyaW5nIiwic3RyaW5naWZpZXIiLCJzdHJpbmdpZnkiLCJjbG9uZSIsIm92ZXJyaWRlcyIsImNsb25lQmVmb3JlIiwiaW5zZXJ0QmVmb3JlIiwiY2xvbmVBZnRlciIsImluc2VydEFmdGVyIiwicmVwbGFjZVdpdGgiLCJub2RlcyIsIm1vdmVUbyIsIm5ld1BhcmVudCIsImNsZWFuUmF3cyIsInJvb3QiLCJhcHBlbmQiLCJtb3ZlQmVmb3JlIiwib3RoZXJOb2RlIiwibW92ZUFmdGVyIiwibmV4dCIsImluZGV4IiwicHJldiIsInRvSlNPTiIsImZpeGVkIiwicmF3IiwicHJvcCIsImRlZmF1bHRUeXBlIiwic3RyIiwia2VlcEJldHdlZW4iLCJiZWZvcmUiLCJhZnRlciIsImJldHdlZW4iLCJwb3NpdGlvbkluc2lkZSIsInN0cmluZyIsInN0YXJ0Iiwid29yZCIsImluZGV4T2YiLCJyZW1vdmVTZWxmIiwicmVwbGFjZSIsInN0eWxlIiwib3duIiwiZGV0ZWN0IiwiY2xlYW5TdHlsZXMiLCJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBSUEsWUFBWSxTQUFaQSxTQUFZLENBQVVDLEdBQVYsRUFBZUMsTUFBZixFQUF1QjtBQUNuQyxR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cnJvciBmcm9tICcuL2Nzcy1zeW50YXgtZXJyb3InO1xuaW1wb3J0IFN0cmluZ2lmaWVyICAgIGZyb20gJy4vc3RyaW5naWZpZXInO1xuaW1wb3J0IHN0cmluZ2lmeSAgICAgIGZyb20gJy4vc3RyaW5naWZ5JztcbmltcG9ydCB3YXJuT25jZSAgICAgICBmcm9tICcuL3dhcm4tb25jZSc7XG5cbmxldCBjbG9uZU5vZGUgPSBmdW5jdGlvbiAob2JqLCBwYXJlbnQpIHtcbiAgICBsZXQgY2xvbmVkID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpO1xuXG4gICAgZm9yICggbGV0IGkgaW4gb2JqICkge1xuICAgICAgICBpZiAoICFvYmouaGFzT3duUHJvcGVydHkoaSkgKSBjb250aW51ZTtcbiAgICAgICAgbGV0IHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBsZXQgdHlwZSAgPSB0eXBlb2YgdmFsdWU7XG5cbiAgICAgICAgaWYgKCBpID09PSAncGFyZW50JyAmJiB0eXBlID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIGNsb25lZFtpXSA9IHBhcmVudDtcbiAgICAgICAgfSBlbHNlIGlmICggaSA9PT0gJ3NvdXJjZScgKSB7XG4gICAgICAgICAgICBjbG9uZWRbaV0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggdmFsdWUgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgICAgIGNsb25lZFtpXSA9IHZhbHVlLm1hcCggaiA9PiBjbG9uZU5vZGUoaiwgY2xvbmVkKSApO1xuICAgICAgICB9IGVsc2UgaWYgKCBpICE9PSAnYmVmb3JlJyAgJiYgaSAhPT0gJ2FmdGVyJyAmJlxuICAgICAgICAgICAgICAgICAgICBpICE9PSAnYmV0d2VlbicgJiYgaSAhPT0gJ3NlbWljb2xvbicgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICkgdmFsdWUgPSBjbG9uZU5vZGUodmFsdWUpO1xuICAgICAgICAgICAgY2xvbmVkW2ldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2xvbmVkO1xufTtcblxuLyoqXG4gKiBBbGwgbm9kZSBjbGFzc2VzIGluaGVyaXQgdGhlIGZvbGxvd2luZyBjb21tb24gbWV0aG9kcy5cbiAqXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgTm9kZSB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2RlZmF1bHRzXSAtIHZhbHVlIGZvciBub2RlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkZWZhdWx0cyA9IHsgfSkge1xuICAgICAgICB0aGlzLnJhd3MgPSB7IH07XG4gICAgICAgIGZvciAoIGxldCBuYW1lIGluIGRlZmF1bHRzICkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IGRlZmF1bHRzW25hbWVdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIENzc1N5bnRheEVycm9yIGluc3RhbmNlIGNvbnRhaW5pbmcgdGhlIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICogb2YgdGhlIG5vZGUgaW4gdGhlIHNvdXJjZSwgc2hvd2luZyBsaW5lIGFuZCBjb2x1bW4gbnVtYmVycyBhbmQgYWxzb1xuICAgICAqIGEgc21hbGwgZXhjZXJwdCB0byBmYWNpbGl0YXRlIGRlYnVnZ2luZy5cbiAgICAgKlxuICAgICAqIElmIHByZXNlbnQsIGFuIGlucHV0IHNvdXJjZSBtYXAgd2lsbCBiZSB1c2VkIHRvIGdldCB0aGUgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgKiBvZiB0aGUgc291cmNlLCBldmVuIGZyb20gYSBwcmV2aW91cyBjb21waWxhdGlvbiBzdGVwXG4gICAgICogKGUuZy4sIGZyb20gU2FzcyBjb21waWxhdGlvbikuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBwcm9kdWNlcyB2ZXJ5IHVzZWZ1bCBlcnJvciBtZXNzYWdlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlICAgICAtIGVycm9yIGRlc2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRzXSAgICAgIC0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLnBsdWdpbiAtIHBsdWdpbiBuYW1lIHRoYXQgY3JlYXRlZCB0aGlzIGVycm9yLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBvc3RDU1Mgd2lsbCBzZXQgaXQgYXV0b21hdGljYWxseS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy53b3JkICAgLSBhIHdvcmQgaW5zaWRlIGEgbm9kZeKAmXMgc3RyaW5nIHRoYXQgc2hvdWxkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgaGlnaGxpZ2h0ZWQgYXMgdGhlIHNvdXJjZSBvZiB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3B0cy5pbmRleCAgLSBhbiBpbmRleCBpbnNpZGUgYSBub2Rl4oCZcyBzdHJpbmcgdGhhdCBzaG91bGRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBoaWdobGlnaHRlZCBhcyB0aGUgc291cmNlIG9mIHRoZSBlcnJvclxuICAgICAqXG4gICAgICogQHJldHVybiB7Q3NzU3ludGF4RXJyb3J9IGVycm9yIG9iamVjdCB0byB0aHJvdyBpdFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBpZiAoICF2YXJpYWJsZXNbbmFtZV0gKSB7XG4gICAgICogICB0aHJvdyBkZWNsLmVycm9yKCdVbmtub3duIHZhcmlhYmxlICcgKyBuYW1lLCB7IHdvcmQ6IG5hbWUgfSk7XG4gICAgICogICAvLyBDc3NTeW50YXhFcnJvcjogcG9zdGNzcy12YXJzOmEuc2Fzczo0OjM6IFVua25vd24gdmFyaWFibGUgJGJsYWNrXG4gICAgICogICAvLyAgIGNvbG9yOiAkYmxhY2tcbiAgICAgKiAgIC8vIGFcbiAgICAgKiAgIC8vICAgICAgICAgIF5cbiAgICAgKiAgIC8vICAgYmFja2dyb3VuZDogd2hpdGVcbiAgICAgKiB9XG4gICAgICovXG4gICAgZXJyb3IobWVzc2FnZSwgb3B0cyA9IHsgfSkge1xuICAgICAgICBpZiAoIHRoaXMuc291cmNlICkge1xuICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMucG9zaXRpb25CeShvcHRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5pbnB1dC5lcnJvcihtZXNzYWdlLCBwb3MubGluZSwgcG9zLmNvbHVtbiwgb3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENzc1N5bnRheEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgcHJvdmlkZWQgYXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIGZvciB7QGxpbmsgUmVzdWx0I3dhcm59LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZXN1bHR9IHJlc3VsdCAgICAgIC0gdGhlIHtAbGluayBSZXN1bHR9IGluc3RhbmNlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCB3aWxsIHJlY2VpdmUgdGhlIHdhcm5pbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAgICAgICAgLSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdHNdICAgICAgLSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMucGx1Z2luIC0gcGx1Z2luIG5hbWUgdGhhdCBjcmVhdGVkIHRoaXMgd2FybmluZy5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQb3N0Q1NTIHdpbGwgc2V0IGl0IGF1dG9tYXRpY2FsbHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMud29yZCAgIC0gYSB3b3JkIGluc2lkZSBhIG5vZGXigJlzIHN0cmluZyB0aGF0IHNob3VsZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlIGhpZ2hsaWdodGVkIGFzIHRoZSBzb3VyY2Ugb2YgdGhlIHdhcm5pbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3B0cy5pbmRleCAgLSBhbiBpbmRleCBpbnNpZGUgYSBub2Rl4oCZcyBzdHJpbmcgdGhhdCBzaG91bGRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBoaWdobGlnaHRlZCBhcyB0aGUgc291cmNlIG9mIHRoZSB3YXJuaW5nXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtXYXJuaW5nfSBjcmVhdGVkIHdhcm5pbmcgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHBsdWdpbiA9IHBvc3Rjc3MucGx1Z2luKCdwb3N0Y3NzLWRlcHJlY2F0ZWQnLCAoKSA9PiB7XG4gICAgICogICByZXR1cm4gKHJvb3QsIHJlc3VsdCkgPT4ge1xuICAgICAqICAgICByb290LndhbGtEZWNscygnYmFkJywgZGVjbCA9PiB7XG4gICAgICogICAgICAgZGVjbC53YXJuKHJlc3VsdCwgJ0RlcHJlY2F0ZWQgcHJvcGVydHkgYmFkJyk7XG4gICAgICogICAgIH0pO1xuICAgICAqICAgfTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YXJuKHJlc3VsdCwgdGV4dCwgb3B0cykge1xuICAgICAgICBsZXQgZGF0YSA9IHsgbm9kZTogdGhpcyB9O1xuICAgICAgICBmb3IgKCBsZXQgaSBpbiBvcHRzICkgZGF0YVtpXSA9IG9wdHNbaV07XG4gICAgICAgIHJldHVybiByZXN1bHQud2Fybih0ZXh0LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gaXRzIHBhcmVudCBhbmQgY2xlYW5zIHRoZSBwYXJlbnQgcHJvcGVydGllc1xuICAgICAqIGZyb20gdGhlIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogaWYgKCBkZWNsLnByb3AubWF0Y2goL14td2Via2l0LS8pICkge1xuICAgICAqICAgZGVjbC5yZW1vdmUoKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSBub2RlIHRvIG1ha2UgY2FsbHMgY2hhaW5cbiAgICAgKi9cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIGlmICggdGhpcy5wYXJlbnQgKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIENTUyBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmdpZmllcnxzeW50YXh9IFtzdHJpbmdpZmllcl0gLSBhIHN5bnRheCB0byB1c2VcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHN0cmluZyBnZW5lcmF0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IENTUyBzdHJpbmcgb2YgdGhpcyBub2RlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MucnVsZSh7IHNlbGVjdG9yOiAnYScgfSkudG9TdHJpbmcoKSAvLz0+IFwiYSB7fVwiXG4gICAgICovXG4gICAgdG9TdHJpbmcoc3RyaW5naWZpZXIgPSBzdHJpbmdpZnkpIHtcbiAgICAgICAgaWYgKCBzdHJpbmdpZmllci5zdHJpbmdpZnkgKSBzdHJpbmdpZmllciA9IHN0cmluZ2lmaWVyLnN0cmluZ2lmeTtcbiAgICAgICAgbGV0IHJlc3VsdCAgPSAnJztcbiAgICAgICAgc3RyaW5naWZpZXIodGhpcywgaSA9PiB7XG4gICAgICAgICAgICByZXN1bHQgKz0gaTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGNsb25lIG9mIHRoZSBub2RlLlxuICAgICAqXG4gICAgICogVGhlIHJlc3VsdGluZyBjbG9uZWQgbm9kZSBhbmQgaXRzIChjbG9uZWQpIGNoaWxkcmVuIHdpbGwgaGF2ZVxuICAgICAqIGEgY2xlYW4gcGFyZW50IGFuZCBjb2RlIHN0eWxlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW292ZXJyaWRlc10gLSBuZXcgcHJvcGVydGllcyB0byBvdmVycmlkZSBpbiB0aGUgY2xvbmUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IGNsb25lZCA9IGRlY2wuY2xvbmUoeyBwcm9wOiAnLW1vei0nICsgZGVjbC5wcm9wIH0pO1xuICAgICAqIGNsb25lZC5yYXdzLmJlZm9yZSAgLy89PiB1bmRlZmluZWRcbiAgICAgKiBjbG9uZWQucGFyZW50ICAgICAgIC8vPT4gdW5kZWZpbmVkXG4gICAgICogY2xvbmVkLnRvU3RyaW5nKCkgICAvLz0+IC1tb3otdHJhbnNmb3JtOiBzY2FsZSgwKVxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gY2xvbmUgb2YgdGhlIG5vZGVcbiAgICAgKi9cbiAgICBjbG9uZShvdmVycmlkZXMgPSB7IH0pIHtcbiAgICAgICAgbGV0IGNsb25lZCA9IGNsb25lTm9kZSh0aGlzKTtcbiAgICAgICAgZm9yICggbGV0IG5hbWUgaW4gb3ZlcnJpZGVzICkge1xuICAgICAgICAgICAgY2xvbmVkW25hbWVdID0gb3ZlcnJpZGVzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvcnRjdXQgdG8gY2xvbmUgdGhlIG5vZGUgYW5kIGluc2VydCB0aGUgcmVzdWx0aW5nIGNsb25lZCBub2RlXG4gICAgICogYmVmb3JlIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW292ZXJyaWRlc10gLSBuZXcgcHJvcGVydGllcyB0byBvdmVycmlkZSBpbiB0aGUgY2xvbmUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRlY2wuY2xvbmVCZWZvcmUoeyBwcm9wOiAnLW1vei0nICsgZGVjbC5wcm9wIH0pO1xuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gLSBuZXcgbm9kZVxuICAgICAqL1xuICAgIGNsb25lQmVmb3JlKG92ZXJyaWRlcyA9IHsgfSkge1xuICAgICAgICBsZXQgY2xvbmVkID0gdGhpcy5jbG9uZShvdmVycmlkZXMpO1xuICAgICAgICB0aGlzLnBhcmVudC5pbnNlcnRCZWZvcmUodGhpcywgY2xvbmVkKTtcbiAgICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG9ydGN1dCB0byBjbG9uZSB0aGUgbm9kZSBhbmQgaW5zZXJ0IHRoZSByZXN1bHRpbmcgY2xvbmVkIG5vZGVcbiAgICAgKiBhZnRlciB0aGUgY3VycmVudCBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvdmVycmlkZXNdIC0gbmV3IHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgaW4gdGhlIGNsb25lLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gLSBuZXcgbm9kZVxuICAgICAqL1xuICAgIGNsb25lQWZ0ZXIob3ZlcnJpZGVzID0geyB9KSB7XG4gICAgICAgIGxldCBjbG9uZWQgPSB0aGlzLmNsb25lKG92ZXJyaWRlcyk7XG4gICAgICAgIHRoaXMucGFyZW50Lmluc2VydEFmdGVyKHRoaXMsIGNsb25lZCk7XG4gICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBub2RlKHMpIGJlZm9yZSB0aGUgY3VycmVudCBub2RlIGFuZCByZW1vdmVzIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gey4uLk5vZGV9IG5vZGVzIC0gbm9kZShzKSB0byByZXBsYWNlIGN1cnJlbnQgb25lXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGlmICggYXRydWxlLm5hbWUgPT0gJ21peGluJyApIHtcbiAgICAgKiAgIGF0cnVsZS5yZXBsYWNlV2l0aChtaXhpblJ1bGVzW2F0cnVsZS5wYXJhbXNdKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSBjdXJyZW50IG5vZGUgdG8gbWV0aG9kcyBjaGFpblxuICAgICAqL1xuICAgIHJlcGxhY2VXaXRoKC4uLm5vZGVzKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSBpdHMgY3VycmVudCBwYXJlbnQgYW5kIGluc2VydHMgaXRcbiAgICAgKiBhdCB0aGUgZW5kIG9mIGBuZXdQYXJlbnRgLlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIGNsZWFuIHRoZSBgYmVmb3JlYCBhbmQgYGFmdGVyYCBjb2RlIHtAbGluayBOb2RlI3Jhd3N9IGRhdGFcbiAgICAgKiBmcm9tIHRoZSBub2RlIGFuZCByZXBsYWNlIHRoZW0gd2l0aCB0aGUgaW5kZW50YXRpb24gc3R5bGUgb2YgYG5ld1BhcmVudGAuXG4gICAgICogSXQgd2lsbCBhbHNvIGNsZWFuIHRoZSBgYmV0d2VlbmAgcHJvcGVydHlcbiAgICAgKiBpZiBgbmV3UGFyZW50YCBpcyBpbiBhbm90aGVyIHtAbGluayBSb290fS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyfSBuZXdQYXJlbnQgLSBjb250YWluZXIgbm9kZSB3aGVyZSB0aGUgY3VycmVudCBub2RlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbGwgYmUgbW92ZWRcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYXRydWxlLm1vdmVUbyhhdHJ1bGUucm9vdCgpKTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IGN1cnJlbnQgbm9kZSB0byBtZXRob2RzIGNoYWluXG4gICAgICovXG4gICAgbW92ZVRvKG5ld1BhcmVudCkge1xuICAgICAgICB0aGlzLmNsZWFuUmF3cyh0aGlzLnJvb3QoKSA9PT0gbmV3UGFyZW50LnJvb3QoKSk7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIG5ld1BhcmVudC5hcHBlbmQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSBpdHMgY3VycmVudCBwYXJlbnQgYW5kIGluc2VydHMgaXQgaW50b1xuICAgICAqIGEgbmV3IHBhcmVudCBiZWZvcmUgYG90aGVyTm9kZWAuXG4gICAgICpcbiAgICAgKiBUaGlzIHdpbGwgYWxzbyBjbGVhbiB0aGUgbm9kZeKAmXMgY29kZSBzdHlsZSBwcm9wZXJ0aWVzIGp1c3QgYXMgaXQgd291bGRcbiAgICAgKiBpbiB7QGxpbmsgTm9kZSNtb3ZlVG99LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOb2RlfSBvdGhlck5vZGUgLSBub2RlIHRoYXQgd2lsbCBiZSBiZWZvcmUgY3VycmVudCBub2RlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSBjdXJyZW50IG5vZGUgdG8gbWV0aG9kcyBjaGFpblxuICAgICAqL1xuICAgIG1vdmVCZWZvcmUob3RoZXJOb2RlKSB7XG4gICAgICAgIHRoaXMuY2xlYW5SYXdzKHRoaXMucm9vdCgpID09PSBvdGhlck5vZGUucm9vdCgpKTtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgb3RoZXJOb2RlLnBhcmVudC5pbnNlcnRCZWZvcmUob3RoZXJOb2RlLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIGl0cyBjdXJyZW50IHBhcmVudCBhbmQgaW5zZXJ0cyBpdCBpbnRvXG4gICAgICogYSBuZXcgcGFyZW50IGFmdGVyIGBvdGhlck5vZGVgLlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIGFsc28gY2xlYW4gdGhlIG5vZGXigJlzIGNvZGUgc3R5bGUgcHJvcGVydGllcyBqdXN0IGFzIGl0IHdvdWxkXG4gICAgICogaW4ge0BsaW5rIE5vZGUjbW92ZVRvfS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gb3RoZXJOb2RlIC0gbm9kZSB0aGF0IHdpbGwgYmUgYWZ0ZXIgY3VycmVudCBub2RlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSBjdXJyZW50IG5vZGUgdG8gbWV0aG9kcyBjaGFpblxuICAgICAqL1xuICAgIG1vdmVBZnRlcihvdGhlck5vZGUpIHtcbiAgICAgICAgdGhpcy5jbGVhblJhd3ModGhpcy5yb290KCkgPT09IG90aGVyTm9kZS5yb290KCkpO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBvdGhlck5vZGUucGFyZW50Lmluc2VydEFmdGVyKG90aGVyTm9kZSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG5leHQgY2hpbGQgb2YgdGhlIG5vZGXigJlzIHBhcmVudC5cbiAgICAgKiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZSBjdXJyZW50IG5vZGUgaXMgdGhlIGxhc3QgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfHVuZGVmaW5lZH0gbmV4dCBub2RlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGlmICggY29tbWVudC50ZXh0ID09PSAnZGVsZXRlIG5leHQnICkge1xuICAgICAqICAgY29uc3QgbmV4dCA9IGNvbW1lbnQubmV4dCgpO1xuICAgICAqICAgaWYgKCBuZXh0ICkge1xuICAgICAqICAgICBuZXh0LnJlbW92ZSgpO1xuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBuZXh0KCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnBhcmVudC5pbmRleCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm5vZGVzW2luZGV4ICsgMV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcHJldmlvdXMgY2hpbGQgb2YgdGhlIG5vZGXigJlzIHBhcmVudC5cbiAgICAgKiBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZSBjdXJyZW50IG5vZGUgaXMgdGhlIGZpcnN0IGNoaWxkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZXx1bmRlZmluZWR9IHByZXZpb3VzIG5vZGVcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgYW5ub3RhdGlvbiA9IGRlY2wucHJldigpO1xuICAgICAqIGlmICggYW5ub3RhdGlvbi50eXBlID09ICdjb21tZW50JyApIHtcbiAgICAgKiAgcmVhZEFubm90YXRpb24oYW5ub3RhdGlvbi50ZXh0KTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgcHJldigpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuaW5kZXgodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5ub2Rlc1tpbmRleCAtIDFdO1xuICAgIH1cblxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgbGV0IGZpeGVkID0geyB9O1xuXG4gICAgICAgIGZvciAoIGxldCBuYW1lIGluIHRoaXMgKSB7XG4gICAgICAgICAgICBpZiAoICF0aGlzLmhhc093blByb3BlcnR5KG5hbWUpICkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoIG5hbWUgPT09ICdwYXJlbnQnICkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW25hbWVdO1xuXG4gICAgICAgICAgICBpZiAoIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgICAgICAgICAgZml4ZWRbbmFtZV0gPSB2YWx1ZS5tYXAoIGkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBpID09PSAnb2JqZWN0JyAmJiBpLnRvSlNPTiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpLnRvSlNPTigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUudG9KU09OICkge1xuICAgICAgICAgICAgICAgIGZpeGVkW25hbWVdID0gdmFsdWUudG9KU09OKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpeGVkW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZml4ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHtAbGluayBOb2RlI3Jhd3N9IHZhbHVlLiBJZiB0aGUgbm9kZSBpcyBtaXNzaW5nXG4gICAgICogdGhlIGNvZGUgc3R5bGUgcHJvcGVydHkgKGJlY2F1c2UgdGhlIG5vZGUgd2FzIG1hbnVhbGx5IGJ1aWx0IG9yIGNsb25lZCksXG4gICAgICogUG9zdENTUyB3aWxsIHRyeSB0byBhdXRvZGV0ZWN0IHRoZSBjb2RlIHN0eWxlIHByb3BlcnR5IGJ5IGxvb2tpbmdcbiAgICAgKiBhdCBvdGhlciBub2RlcyBpbiB0aGUgdHJlZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wICAgICAgICAgIC0gbmFtZSBvZiBjb2RlIHN0eWxlIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtkZWZhdWx0VHlwZV0gLSBuYW1lIG9mIGRlZmF1bHQgdmFsdWUsIGl0IGNhbiBiZSBtaXNzZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIHRoZSB2YWx1ZSBpcyB0aGUgc2FtZSBhcyBwcm9wXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhIHsgYmFja2dyb3VuZDogd2hpdGUgfScpO1xuICAgICAqIHJvb3Qubm9kZXNbMF0uYXBwZW5kKHsgcHJvcDogJ2NvbG9yJywgdmFsdWU6ICdibGFjaycgfSk7XG4gICAgICogcm9vdC5ub2Rlc1swXS5ub2Rlc1sxXS5yYXdzLmJlZm9yZSAgIC8vPT4gdW5kZWZpbmVkXG4gICAgICogcm9vdC5ub2Rlc1swXS5ub2Rlc1sxXS5yYXcoJ2JlZm9yZScpIC8vPT4gJyAnXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGNvZGUgc3R5bGUgdmFsdWVcbiAgICAgKi9cbiAgICByYXcocHJvcCwgZGVmYXVsdFR5cGUpIHtcbiAgICAgICAgbGV0IHN0ciA9IG5ldyBTdHJpbmdpZmllcigpO1xuICAgICAgICByZXR1cm4gc3RyLnJhdyh0aGlzLCBwcm9wLCBkZWZhdWx0VHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIFJvb3QgaW5zdGFuY2Ugb2YgdGhlIG5vZGXigJlzIHRyZWUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Qubm9kZXNbMF0ubm9kZXNbMF0ucm9vdCgpID09PSByb290XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtSb290fSByb290IHBhcmVudFxuICAgICAqL1xuICAgIHJvb3QoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzO1xuICAgICAgICB3aGlsZSAoIHJlc3VsdC5wYXJlbnQgKSByZXN1bHQgPSByZXN1bHQucGFyZW50O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNsZWFuUmF3cyhrZWVwQmV0d2Vlbikge1xuICAgICAgICBkZWxldGUgdGhpcy5yYXdzLmJlZm9yZTtcbiAgICAgICAgZGVsZXRlIHRoaXMucmF3cy5hZnRlcjtcbiAgICAgICAgaWYgKCAha2VlcEJldHdlZW4gKSBkZWxldGUgdGhpcy5yYXdzLmJldHdlZW47XG4gICAgfVxuXG4gICAgcG9zaXRpb25JbnNpZGUoaW5kZXgpIHtcbiAgICAgICAgbGV0IHN0cmluZyA9IHRoaXMudG9TdHJpbmcoKTtcbiAgICAgICAgbGV0IGNvbHVtbiA9IHRoaXMuc291cmNlLnN0YXJ0LmNvbHVtbjtcbiAgICAgICAgbGV0IGxpbmUgICA9IHRoaXMuc291cmNlLnN0YXJ0LmxpbmU7XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKyApIHtcbiAgICAgICAgICAgIGlmICggc3RyaW5nW2ldID09PSAnXFxuJyApIHtcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSAxO1xuICAgICAgICAgICAgICAgIGxpbmUgICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbHVtbiArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgbGluZSwgY29sdW1uIH07XG4gICAgfVxuXG4gICAgcG9zaXRpb25CeShvcHRzKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLnNvdXJjZS5zdGFydDtcbiAgICAgICAgaWYgKCBvcHRzLmluZGV4ICkge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5wb3NpdGlvbkluc2lkZShvcHRzLmluZGV4KTtcbiAgICAgICAgfSBlbHNlIGlmICggb3B0cy53b3JkICkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy50b1N0cmluZygpLmluZGV4T2Yob3B0cy53b3JkKTtcbiAgICAgICAgICAgIGlmICggaW5kZXggIT09IC0xICkgcG9zID0gdGhpcy5wb3NpdGlvbkluc2lkZShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG5cbiAgICByZW1vdmVTZWxmKCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNyZW1vdmVTZWxmIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3JlbW92ZS4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShub2Rlcykge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNyZXBsYWNlIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3JlcGxhY2VXaXRoJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VXaXRoKG5vZGVzKTtcbiAgICB9XG5cbiAgICBzdHlsZShvd24sIGRldGVjdCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNzdHlsZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3JhdygpJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJhdyhvd24sIGRldGVjdCk7XG4gICAgfVxuXG4gICAgY2xlYW5TdHlsZXMoa2VlcEJldHdlZW4pIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjY2xlYW5TdHlsZXMoKSBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNjbGVhblJhd3MoKScpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbGVhblJhd3Moa2VlcEJldHdlZW4pO1xuICAgIH1cblxuICAgIGdldCBiZWZvcmUoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI2JlZm9yZSBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLmJlZm9yZScpO1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdzLmJlZm9yZTtcbiAgICB9XG5cbiAgICBzZXQgYmVmb3JlKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNiZWZvcmUgaXMgZGVwcmVjYXRlZC4gVXNlIE5vZGUjcmF3cy5iZWZvcmUnKTtcbiAgICAgICAgdGhpcy5yYXdzLmJlZm9yZSA9IHZhbDtcbiAgICB9XG5cbiAgICBnZXQgYmV0d2VlbigpIHtcbiAgICAgICAgd2Fybk9uY2UoJ05vZGUjYmV0d2VlbiBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLmJldHdlZW4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5iZXR3ZWVuO1xuICAgIH1cblxuICAgIHNldCBiZXR3ZWVuKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNiZXR3ZWVuIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuYmV0d2VlbicpO1xuICAgICAgICB0aGlzLnJhd3MuYmV0d2VlbiA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgTm9kZSNcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHR5cGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBub2Rl4oCZcyB0eXBlLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIFBvc3NpYmxlIHZhbHVlcyBhcmUgYHJvb3RgLCBgYXRydWxlYCwgYHJ1bGVgLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIGBkZWNsYCwgb3IgYGNvbW1lbnRgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KS50eXBlIC8vPT4gJ2RlY2wnXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgTm9kZSNcbiAgICAgKiBAbWVtYmVyIHtDb250YWluZXJ9IHBhcmVudCAtIHRoZSBub2Rl4oCZcyBwYXJlbnQgbm9kZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC5ub2Rlc1swXS5wYXJlbnQgPT0gcm9vdDtcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBOb2RlI1xuICAgICAqIEBtZW1iZXIge3NvdXJjZX0gc291cmNlIC0gdGhlIGlucHV0IHNvdXJjZSBvZiB0aGUgbm9kZVxuICAgICAqXG4gICAgICogVGhlIHByb3BlcnR5IGlzIHVzZWQgaW4gc291cmNlIG1hcCBnZW5lcmF0aW9uLlxuICAgICAqXG4gICAgICogSWYgeW91IGNyZWF0ZSBhIG5vZGUgbWFudWFsbHkgKGUuZy4sIHdpdGggYHBvc3Rjc3MuZGVjbCgpYCksXG4gICAgICogdGhhdCBub2RlIHdpbGwgbm90IGhhdmUgYSBgc291cmNlYCBwcm9wZXJ0eSBhbmQgd2lsbCBiZSBhYnNlbnRcbiAgICAgKiBmcm9tIHRoZSBzb3VyY2UgbWFwLiBGb3IgdGhpcyByZWFzb24sIHRoZSBwbHVnaW4gZGV2ZWxvcGVyIHNob3VsZFxuICAgICAqIGNvbnNpZGVyIGNsb25pbmcgbm9kZXMgdG8gY3JlYXRlIG5ldyBvbmVzIChpbiB3aGljaCBjYXNlIHRoZSBuZXcgbm9kZeKAmXNcbiAgICAgKiBzb3VyY2Ugd2lsbCByZWZlcmVuY2UgdGhlIG9yaWdpbmFsLCBjbG9uZWQgbm9kZSkgb3Igc2V0dGluZ1xuICAgICAqIHRoZSBgc291cmNlYCBwcm9wZXJ0eSBtYW51YWxseS5cbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogLy8gQmFkXG4gICAgICogY29uc3QgcHJlZml4ZWQgPSBwb3N0Y3NzLmRlY2woe1xuICAgICAqICAgcHJvcDogJy1tb3otJyArIGRlY2wucHJvcCxcbiAgICAgKiAgIHZhbHVlOiBkZWNsLnZhbHVlXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBHb29kXG4gICAgICogY29uc3QgcHJlZml4ZWQgPSBkZWNsLmNsb25lKHsgcHJvcDogJy1tb3otJyArIGRlY2wucHJvcCB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogaWYgKCBhdHJ1bGUubmFtZSA9PSAnYWRkLWxpbmsnICkge1xuICAgICAqICAgY29uc3QgcnVsZSA9IHBvc3Rjc3MucnVsZSh7IHNlbGVjdG9yOiAnYScsIHNvdXJjZTogYXRydWxlLnNvdXJjZSB9KTtcbiAgICAgKiAgIGF0cnVsZS5wYXJlbnQuaW5zZXJ0QmVmb3JlKGF0cnVsZSwgcnVsZSk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBkZWNsLnNvdXJjZS5pbnB1dC5mcm9tIC8vPT4gJy9ob21lL2FpL2Euc2FzcydcbiAgICAgKiBkZWNsLnNvdXJjZS5zdGFydCAgICAgIC8vPT4geyBsaW5lOiAxMCwgY29sdW1uOiAyIH1cbiAgICAgKiBkZWNsLnNvdXJjZS5lbmQgICAgICAgIC8vPT4geyBsaW5lOiAxMCwgY29sdW1uOiAxMiB9XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgTm9kZSNcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IHJhd3MgLSBJbmZvcm1hdGlvbiB0byBnZW5lcmF0ZSBieXRlLXRvLWJ5dGUgZXF1YWxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlIHN0cmluZyBhcyBpdCB3YXMgaW4gdGhlIG9yaWdpbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIEV2ZXJ5IHBhcnNlciBzYXZlcyBpdHMgb3duIHByb3BlcnRpZXMsXG4gICAgICogYnV0IHRoZSBkZWZhdWx0IENTUyBwYXJzZXIgdXNlczpcbiAgICAgKlxuICAgICAqICogYGJlZm9yZWA6IHRoZSBzcGFjZSBzeW1ib2xzIGJlZm9yZSB0aGUgbm9kZS4gSXQgYWxzbyBzdG9yZXMgYCpgXG4gICAgICogICBhbmQgYF9gIHN5bWJvbHMgYmVmb3JlIHRoZSBkZWNsYXJhdGlvbiAoSUUgaGFjaykuXG4gICAgICogKiBgYWZ0ZXJgOiB0aGUgc3BhY2Ugc3ltYm9scyBhZnRlciB0aGUgbGFzdCBjaGlsZCBvZiB0aGUgbm9kZVxuICAgICAqICAgdG8gdGhlIGVuZCBvZiB0aGUgbm9kZS5cbiAgICAgKiAqIGBiZXR3ZWVuYDogdGhlIHN5bWJvbHMgYmV0d2VlbiB0aGUgcHJvcGVydHkgYW5kIHZhbHVlXG4gICAgICogICBmb3IgZGVjbGFyYXRpb25zLCBzZWxlY3RvciBhbmQgYHtgIGZvciBydWxlcywgb3IgbGFzdCBwYXJhbWV0ZXJcbiAgICAgKiAgIGFuZCBge2AgZm9yIGF0LXJ1bGVzLlxuICAgICAqICogYHNlbWljb2xvbmA6IGNvbnRhaW5zIHRydWUgaWYgdGhlIGxhc3QgY2hpbGQgaGFzXG4gICAgICogICBhbiAob3B0aW9uYWwpIHNlbWljb2xvbi5cbiAgICAgKiAqIGBhZnRlck5hbWVgOiB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgYXQtcnVsZSBuYW1lIGFuZCBpdHMgcGFyYW1ldGVycy5cbiAgICAgKiAqIGBsZWZ0YDogdGhlIHNwYWNlIHN5bWJvbHMgYmV0d2VlbiBgLypgIGFuZCB0aGUgY29tbWVudOKAmXMgdGV4dC5cbiAgICAgKiAqIGByaWdodGA6IHRoZSBzcGFjZSBzeW1ib2xzIGJldHdlZW4gdGhlIGNvbW1lbnTigJlzIHRleHRcbiAgICAgKiAgIGFuZCA8Y29kZT4qJiM0Nzs8L2NvZGU+LlxuICAgICAqICogYGltcG9ydGFudGA6IHRoZSBjb250ZW50IG9mIHRoZSBpbXBvcnRhbnQgc3RhdGVtZW50LFxuICAgICAqICAgaWYgaXQgaXMgbm90IGp1c3QgYCFpbXBvcnRhbnRgLlxuICAgICAqXG4gICAgICogUG9zdENTUyBjbGVhbnMgc2VsZWN0b3JzLCBkZWNsYXJhdGlvbiB2YWx1ZXMgYW5kIGF0LXJ1bGUgcGFyYW1ldGVyc1xuICAgICAqIGZyb20gY29tbWVudHMgYW5kIGV4dHJhIHNwYWNlcywgYnV0IGl0IHN0b3JlcyBvcmlnaW4gY29udGVudCBpbiByYXdzXG4gICAgICogcHJvcGVydGllcy4gQXMgc3VjaCwgaWYgeW91IGRvbuKAmXQgY2hhbmdlIGEgZGVjbGFyYXRpb27igJlzIHZhbHVlLFxuICAgICAqIFBvc3RDU1Mgd2lsbCB1c2UgdGhlIHJhdyB2YWx1ZSB3aXRoIGNvbW1lbnRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYSB7XFxuICBjb2xvcjpibGFja1xcbn0nKVxuICAgICAqIHJvb3QuZmlyc3QuZmlyc3QucmF3cyAvLz0+IHsgYmVmb3JlOiAnXFxuICAnLCBiZXR3ZWVuOiAnOicgfVxuICAgICAqL1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGU7XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gcG9zaXRpb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsaW5lICAgLSBzb3VyY2UgbGluZSBpbiBmaWxlXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29sdW1uIC0gc291cmNlIGNvbHVtbiBpbiBmaWxlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBzb3VyY2VcbiAqIEBwcm9wZXJ0eSB7SW5wdXR9IGlucHV0ICAgIC0ge0BsaW5rIElucHV0fSB3aXRoIGlucHV0IGZpbGVcbiAqIEBwcm9wZXJ0eSB7cG9zaXRpb259IHN0YXJ0IC0gVGhlIHN0YXJ0aW5nIHBvc2l0aW9uIG9mIHRoZSBub2Rl4oCZcyBzb3VyY2VcbiAqIEBwcm9wZXJ0eSB7cG9zaXRpb259IGVuZCAgIC0gVGhlIGVuZGluZyBwb3NpdGlvbiBvZiB0aGUgbm9kZeKAmXMgc291cmNlXG4gKi9cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _supportsColor = __webpack_require__(6);
	
	var _supportsColor2 = _interopRequireDefault(_supportsColor);
	
	var _chalk = __webpack_require__(7);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _terminalHighlight = __webpack_require__(16);
	
	var _terminalHighlight2 = _interopRequireDefault(_terminalHighlight);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * The CSS parser throws this error for broken CSS.
	 *
	 * Custom parsers can throw this error for broken custom syntax using
	 * the {@link Node#error} method.
	 *
	 * PostCSS will use the input source map to detect the original error location.
	 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
	 * PostCSS will show the original position in the Sass file.
	 *
	 * If you need the position in the PostCSS input
	 * (e.g., to debug the previous compiler), use `error.input.file`.
	 *
	 * @example
	 * // Catching and checking syntax error
	 * try {
	 *   postcss.parse('a{')
	 * } catch (error) {
	 *   if ( error.name === 'CssSyntaxError' ) {
	 *     error //=> CssSyntaxError
	 *   }
	 * }
	 *
	 * @example
	 * // Raising error from plugin
	 * throw node.error('Unknown variable', { plugin: 'postcss-vars' });
	 */
	var CssSyntaxError = function () {
	
	    /**
	     * @param {string} message  - error message
	     * @param {number} [line]   - source line of the error
	     * @param {number} [column] - source column of the error
	     * @param {string} [source] - source code of the broken file
	     * @param {string} [file]   - absolute path to the broken file
	     * @param {string} [plugin] - PostCSS plugin name, if error came from plugin
	     */
	    function CssSyntaxError(message, line, column, source, file, plugin) {
	        _classCallCheck(this, CssSyntaxError);
	
	        /**
	         * @member {string} - Always equal to `'CssSyntaxError'`. You should
	         *                    always check error type
	         *                    by `error.name === 'CssSyntaxError'` instead of
	         *                    `error instanceof CssSyntaxError`, because
	         *                    npm could have several PostCSS versions.
	         *
	         * @example
	         * if ( error.name === 'CssSyntaxError' ) {
	         *   error //=> CssSyntaxError
	         * }
	         */
	        this.name = 'CssSyntaxError';
	        /**
	         * @member {string} - Error message.
	         *
	         * @example
	         * error.message //=> 'Unclosed block'
	         */
	        this.reason = message;
	
	        if (file) {
	            /**
	             * @member {string} - Absolute path to the broken file.
	             *
	             * @example
	             * error.file       //=> 'a.sass'
	             * error.input.file //=> 'a.css'
	             */
	            this.file = file;
	        }
	        if (source) {
	            /**
	             * @member {string} - Source code of the broken file.
	             *
	             * @example
	             * error.source       //=> 'a { b {} }'
	             * error.input.column //=> 'a b { }'
	             */
	            this.source = source;
	        }
	        if (plugin) {
	            /**
	             * @member {string} - Plugin name, if error came from plugin.
	             *
	             * @example
	             * error.plugin //=> 'postcss-vars'
	             */
	            this.plugin = plugin;
	        }
	        if (typeof line !== 'undefined' && typeof column !== 'undefined') {
	            /**
	             * @member {number} - Source line of the error.
	             *
	             * @example
	             * error.line       //=> 2
	             * error.input.line //=> 4
	             */
	            this.line = line;
	            /**
	             * @member {number} - Source column of the error.
	             *
	             * @example
	             * error.column       //=> 1
	             * error.input.column //=> 4
	             */
	            this.column = column;
	        }
	
	        this.setMessage();
	
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, CssSyntaxError);
	        }
	    }
	
	    CssSyntaxError.prototype.setMessage = function setMessage() {
	        /**
	         * @member {string} - Full error text in the GNU error format
	         *                    with plugin, file, line and column.
	         *
	         * @example
	         * error.message //=> 'a.css:1:1: Unclosed block'
	         */
	        this.message = this.plugin ? this.plugin + ': ' : '';
	        this.message += this.file ? this.file : '<css input>';
	        if (typeof this.line !== 'undefined') {
	            this.message += ':' + this.line + ':' + this.column;
	        }
	        this.message += ': ' + this.reason;
	    };
	
	    /**
	     * Returns a few lines of CSS source that caused the error.
	     *
	     * If the CSS has an input source map without `sourceContent`,
	     * this method will return an empty string.
	     *
	     * @param {boolean} [color] whether arrow will be colored red by terminal
	     *                          color codes. By default, PostCSS will detect
	     *                          color support by `process.stdout.isTTY`
	     *                          and `process.env.NODE_DISABLE_COLORS`.
	     *
	     * @example
	     * error.showSourceCode() //=> "  4 | }
	     *                        //      5 | a {
	     *                        //    > 6 |   bad
	     *                        //        |   ^
	     *                        //      7 | }
	     *                        //      8 | b {"
	     *
	     * @return {string} few lines of CSS source that caused the error
	     */
	
	
	    CssSyntaxError.prototype.showSourceCode = function showSourceCode(color) {
	        var _this = this;
	
	        if (!this.source) return '';
	
	        var css = this.source;
	        if (typeof color === 'undefined') color = _supportsColor2.default;
	        if (color) css = (0, _terminalHighlight2.default)(css);
	
	        var lines = css.split(/\r?\n/);
	        var start = Math.max(this.line - 3, 0);
	        var end = Math.min(this.line + 2, lines.length);
	
	        var maxWidth = String(end).length;
	        var colors = new _chalk2.default.constructor({ enabled: true });
	
	        function mark(text) {
	            if (color) {
	                return colors.red.bold(text);
	            } else {
	                return text;
	            }
	        }
	        function aside(text) {
	            if (color) {
	                return colors.gray(text);
	            } else {
	                return text;
	            }
	        }
	
	        return lines.slice(start, end).map(function (line, index) {
	            var number = start + 1 + index;
	            var gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | ';
	            if (number === _this.line) {
	                var spacing = aside(gutter.replace(/\d/g, ' ')) + line.slice(0, _this.column - 1).replace(/[^\t]/g, ' ');
	                return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^');
	            } else {
	                return ' ' + aside(gutter) + line;
	            }
	        }).join('\n');
	    };
	
	    /**
	     * Returns error position, message and source code of the broken part.
	     *
	     * @example
	     * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
	     *                  //    > 1 | a {
	     *                  //        | ^"
	     *
	     * @return {string} error position, message and source code
	     */
	
	
	    CssSyntaxError.prototype.toString = function toString() {
	        var code = this.showSourceCode();
	        if (code) {
	            code = '\n\n' + code + '\n';
	        }
	        return this.name + ': ' + this.message + code;
	    };
	
	    _createClass(CssSyntaxError, [{
	        key: 'generated',
	        get: function get() {
	            (0, _warnOnce2.default)('CssSyntaxError#generated is depreacted. Use input instead.');
	            return this.input;
	        }
	
	        /**
	         * @memberof CssSyntaxError#
	         * @member {Input} input - Input object with PostCSS internal information
	         *                         about input file. If input has source map
	         *                         from previous tool, PostCSS will use origin
	         *                         (for example, Sass) source. You can use this
	         *                         object to get PostCSS input source.
	         *
	         * @example
	         * error.input.file //=> 'a.css'
	         * error.file       //=> 'a.sass'
	         */
	
	    }]);
	
	    return CssSyntaxError;
	}();
	
	exports.default = CssSyntaxError;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNzcy1zeW50YXgtZXJyb3IuZXM2Il0sIm5hbWVzIjpbIkNzc1N5bnRheEVycm9yIiwibWVzc2FnZSIsImxpbmUiLCJjb2x1bW4iLCJzb3VyY2UiLCJmaWxlIiwicGx1Z2luIiwibmFtZSIsInJlYXNvbiIsInNldE1lc3NhZ2UiLCJFcnJvciIsImNhcHR1cmVTdGFja1RyYWNlIiwic2hvd1NvdXJjZUNvZGUiLCJjb2xvciIsImNzcyIsImxpbmVzIiwic3BsaXQiLCJzdGFydCIsIk1hdGgiLCJtYXgiLCJlbmQiLCJtaW4iLCJsZW5ndGgiLCJtYXhXaWR0aCIsIlN0cmluZyIsImNvbG9ycyIsImNvbnN0cnVjdG9yIiwiZW5hYmxlZCIsIm1hcmsiLCJ0ZXh0IiwicmVkIiwiYm9sZCIsImFzaWRlIiwiZ3JheSIsInNsaWNlIiwibWFwIiwiaW5kZXgiLCJudW1iZXIiLCJndXR0ZXIiLCJzcGFjaW5nIiwicmVwbGFjZSIsImpvaW4iLCJ0b1N0cmluZyIsImNvZGUiLCJpbnB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTUEsYzs7QUFFRjs7Ozs7Ozs7QUFRQSw0QkFBWUMsT0FBWixFQUFxQkMsSUFBckIsRUFBMkJDLE1BQTNCLEVBQW1DQyxNQUFuQyxFQUEyQ0MsSUFBM0MsRUFBaURDLE1BQWpELEVBQXlEO0FBQUE7O0FBQ3JEOzs7Ozs7Ozs7Ozs7QUFZQSxhQUFLQyxJQUFMLEdBQWMsZ0JBQWQ7QUFDQTs7Ozs7O0FBTUEsYUFBS0MsTUFBTCxHQUFjUCxPQUFkOztBQUVBLFlBQUtJLElBQUwsRUFBWTtBQUNSOzs7Ozs7O0FBT0EsaUJBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNIO0FBQ0QsWUFBS0QsTUFBTCxFQUFjO0FBQ1Y7Ozs7Ozs7QUFPQSxpQkFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0g7QUFDRCxZQUFLRSxNQUFMLEVBQWM7QUFDVjs7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TCxHQUFjLENBQTVCLEVBQStCcUMsT0FBL0IsQ0FBdUMsUUFBdkMsRUFBaUQsR0FBakQsQ0FGSjtBQUdBLHVCQUFPWixLQUFLLEdBQUwsSUFBWUksTUFBTU0sTUFBTixDQUFaLEdBQTRCcEMsSUFBNUIsR0FBbUMsS0FBbkMsR0FDQXFDLE9BREEsR0FDVVgsS0FBSyxHQUFMLENBRGpCO0FBRUgsYUFORCxNQU1PO0FBQ0gsdUJBQU8sTUFBTUksTUFBTU0sTUFBTixDQUFOLEdBQXNCcEMsSUFBN0I7QUFDSDtBQUNKLFNBWk0sRUFZSnVDLElBWkksQ0FZQyxJQVpELENBQVA7QUFhSCxLOztBQUVEOzs7Ozs7Ozs7Ozs7NkJBVUFDLFEsdUJBQVc7QUFDUCxZQUFJQyxPQUFPLEtBQUsvQixjQUFMLEVBQVg7QUFDQSxZQUFLK0IsSUFBTCxFQUFZO0FBQ1JBLG1CQUFPLFNBQVNBLElBQVQsR0FBZ0IsSUFBdkI7QUFDSDtBQUNELGVBQU8sS0FBS3BDLElBQUwsR0FBWSxJQUFaLEdBQW1CLEtBQUtOLE9BQXhCLEdBQWtDMEMsSUFBekM7QUFDSCxLOzs7OzRCQUVlO0FBQ1osb0NBQVMsNERBQVQ7QUFDQSxtQkFBTyxLQUFLQyxLQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFlVzVDLGMiLCJmaWxlIjoiY3NzLXN5bnRheC1lcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdXBwb3J0c0NvbG9yIGZyb20gJ3N1cHBvcnRzLWNvbG9yJztcbmltcG9ydCBjaGFsayAgICAgICAgIGZyb20gJ2NoYWxrJztcblxuaW1wb3J0IHRlcm1pbmFsSGlnaGxpZ2h0IGZyb20gJy4vdGVybWluYWwtaGlnaGxpZ2h0JztcbmltcG9ydCB3YXJuT25jZSAgICAgICAgICBmcm9tICcuL3dhcm4tb25jZSc7XG5cbi8qKlxuICogVGhlIENTUyBwYXJzZXIgdGhyb3dzIHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBDU1MuXG4gKlxuICogQ3VzdG9tIHBhcnNlcnMgY2FuIHRocm93IHRoaXMgZXJyb3IgZm9yIGJyb2tlbiBjdXN0b20gc3ludGF4IHVzaW5nXG4gKiB0aGUge0BsaW5rIE5vZGUjZXJyb3J9IG1ldGhvZC5cbiAqXG4gKiBQb3N0Q1NTIHdpbGwgdXNlIHRoZSBpbnB1dCBzb3VyY2UgbWFwIHRvIGRldGVjdCB0aGUgb3JpZ2luYWwgZXJyb3IgbG9jYXRpb24uXG4gKiBJZiB5b3Ugd3JvdGUgYSBTYXNzIGZpbGUsIGNvbXBpbGVkIGl0IHRvIENTUyBhbmQgdGhlbiBwYXJzZWQgaXQgd2l0aCBQb3N0Q1NTLFxuICogUG9zdENTUyB3aWxsIHNob3cgdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIHRoZSBTYXNzIGZpbGUuXG4gKlxuICogSWYgeW91IG5lZWQgdGhlIHBvc2l0aW9uIGluIHRoZSBQb3N0Q1NTIGlucHV0XG4gKiAoZS5nLiwgdG8gZGVidWcgdGhlIHByZXZpb3VzIGNvbXBpbGVyKSwgdXNlIGBlcnJvci5pbnB1dC5maWxlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2F0Y2hpbmcgYW5kIGNoZWNraW5nIHN5bnRheCBlcnJvclxuICogdHJ5IHtcbiAqICAgcG9zdGNzcy5wYXJzZSgnYXsnKVxuICogfSBjYXRjaCAoZXJyb3IpIHtcbiAqICAgaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICogICAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAqICAgfVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSYWlzaW5nIGVycm9yIGZyb20gcGx1Z2luXG4gKiB0aHJvdyBub2RlLmVycm9yKCdVbmtub3duIHZhcmlhYmxlJywgeyBwbHVnaW46ICdwb3N0Y3NzLXZhcnMnIH0pO1xuICovXG5jbGFzcyBDc3NTeW50YXhFcnJvciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAgLSBlcnJvciBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtsaW5lXSAgIC0gc291cmNlIGxpbmUgb2YgdGhlIGVycm9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtjb2x1bW5dIC0gc291cmNlIGNvbHVtbiBvZiB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NvdXJjZV0gLSBzb3VyY2UgY29kZSBvZiB0aGUgYnJva2VuIGZpbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2ZpbGVdICAgLSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBicm9rZW4gZmlsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcGx1Z2luXSAtIFBvc3RDU1MgcGx1Z2luIG5hbWUsIGlmIGVycm9yIGNhbWUgZnJvbSBwbHVnaW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBsaW5lLCBjb2x1bW4sIHNvdXJjZSwgZmlsZSwgcGx1Z2luKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQWx3YXlzIGVxdWFsIHRvIGAnQ3NzU3ludGF4RXJyb3InYC4gWW91IHNob3VsZFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgYWx3YXlzIGNoZWNrIGVycm9yIHR5cGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGJ5IGBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InYCBpbnN0ZWFkIG9mXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBgZXJyb3IgaW5zdGFuY2VvZiBDc3NTeW50YXhFcnJvcmAsIGJlY2F1c2VcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIG5wbSBjb3VsZCBoYXZlIHNldmVyYWwgUG9zdENTUyB2ZXJzaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCBlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICkge1xuICAgICAgICAgKiAgIGVycm9yIC8vPT4gQ3NzU3ludGF4RXJyb3JcbiAgICAgICAgICogfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lICAgPSAnQ3NzU3ludGF4RXJyb3InO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEVycm9yIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGVycm9yLm1lc3NhZ2UgLy89PiAnVW5jbG9zZWQgYmxvY2snXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlYXNvbiA9IG1lc3NhZ2U7XG5cbiAgICAgICAgaWYgKCBmaWxlICkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQWJzb2x1dGUgcGF0aCB0byB0aGUgYnJva2VuIGZpbGUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmZpbGUgICAgICAgLy89PiAnYS5zYXNzJ1xuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuZmlsZSAvLz0+ICdhLmNzcydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHNvdXJjZSApIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIFNvdXJjZSBjb2RlIG9mIHRoZSBicm9rZW4gZmlsZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3Iuc291cmNlICAgICAgIC8vPT4gJ2EgeyBiIHt9IH0nXG4gICAgICAgICAgICAgKiBlcnJvci5pbnB1dC5jb2x1bW4gLy89PiAnYSBiIHsgfSdcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBwbHVnaW4gKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBQbHVnaW4gbmFtZSwgaWYgZXJyb3IgY2FtZSBmcm9tIHBsdWdpbi5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3IucGx1Z2luIC8vPT4gJ3Bvc3Rjc3MtdmFycydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgbGluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbHVtbiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBTb3VyY2UgbGluZSBvZiB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIGVycm9yLmxpbmUgICAgICAgLy89PiAyXG4gICAgICAgICAgICAgKiBlcnJvci5pbnB1dC5saW5lIC8vPT4gNFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmxpbmUgICA9IGxpbmU7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gLSBTb3VyY2UgY29sdW1uIG9mIHRoZSBlcnJvci5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogZXJyb3IuY29sdW1uICAgICAgIC8vPT4gMVxuICAgICAgICAgICAgICogZXJyb3IuaW5wdXQuY29sdW1uIC8vPT4gNFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TWVzc2FnZSgpO1xuXG4gICAgICAgIGlmICggRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDc3NTeW50YXhFcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNZXNzYWdlKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIEZ1bGwgZXJyb3IgdGV4dCBpbiB0aGUgR05VIGVycm9yIGZvcm1hdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgd2l0aCBwbHVnaW4sIGZpbGUsIGxpbmUgYW5kIGNvbHVtbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogZXJyb3IubWVzc2FnZSAvLz0+ICdhLmNzczoxOjE6IFVuY2xvc2VkIGJsb2NrJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tZXNzYWdlICA9IHRoaXMucGx1Z2luID8gdGhpcy5wbHVnaW4gKyAnOiAnIDogJyc7XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUgOiAnPGNzcyBpbnB1dD4nO1xuICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLmxpbmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlICs9ICc6JyArIHRoaXMubGluZSArICc6JyArIHRoaXMuY29sdW1uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSAnOiAnICsgdGhpcy5yZWFzb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZldyBsaW5lcyBvZiBDU1Mgc291cmNlIHRoYXQgY2F1c2VkIHRoZSBlcnJvci5cbiAgICAgKlxuICAgICAqIElmIHRoZSBDU1MgaGFzIGFuIGlucHV0IHNvdXJjZSBtYXAgd2l0aG91dCBgc291cmNlQ29udGVudGAsXG4gICAgICogdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY29sb3JdIHdoZXRoZXIgYXJyb3cgd2lsbCBiZSBjb2xvcmVkIHJlZCBieSB0ZXJtaW5hbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciBjb2Rlcy4gQnkgZGVmYXVsdCwgUG9zdENTUyB3aWxsIGRldGVjdFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciBzdXBwb3J0IGJ5IGBwcm9jZXNzLnN0ZG91dC5pc1RUWWBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGBwcm9jZXNzLmVudi5OT0RFX0RJU0FCTEVfQ09MT1JTYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXJyb3Iuc2hvd1NvdXJjZUNvZGUoKSAvLz0+IFwiICA0IHwgfVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICA1IHwgYSB7XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAvLyAgICA+IDYgfCAgIGJhZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgIHwgICBeXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIDcgfCB9XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgIDggfCBiIHtcIlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBmZXcgbGluZXMgb2YgQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgZXJyb3JcbiAgICAgKi9cbiAgICBzaG93U291cmNlQ29kZShjb2xvcikge1xuICAgICAgICBpZiAoICF0aGlzLnNvdXJjZSApIHJldHVybiAnJztcblxuICAgICAgICBsZXQgY3NzID0gdGhpcy5zb3VyY2U7XG4gICAgICAgIGlmICggdHlwZW9mIGNvbG9yID09PSAndW5kZWZpbmVkJyApIGNvbG9yID0gc3VwcG9ydHNDb2xvcjtcbiAgICAgICAgaWYgKCBjb2xvciApIGNzcyA9IHRlcm1pbmFsSGlnaGxpZ2h0KGNzcyk7XG5cbiAgICAgICAgbGV0IGxpbmVzID0gY3NzLnNwbGl0KC9cXHI/XFxuLyk7XG4gICAgICAgIGxldCBzdGFydCA9IE1hdGgubWF4KHRoaXMubGluZSAtIDMsIDApO1xuICAgICAgICBsZXQgZW5kICAgPSBNYXRoLm1pbih0aGlzLmxpbmUgKyAyLCBsaW5lcy5sZW5ndGgpO1xuXG4gICAgICAgIGxldCBtYXhXaWR0aCA9IFN0cmluZyhlbmQpLmxlbmd0aDtcbiAgICAgICAgbGV0IGNvbG9ycyA9IG5ldyBjaGFsay5jb25zdHJ1Y3Rvcih7IGVuYWJsZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFyayh0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIGNvbG9yICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcnMucmVkLmJvbGQodGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFzaWRlKHRleHQpIHtcbiAgICAgICAgICAgIGlmICggY29sb3IgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9ycy5ncmF5KHRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoIChsaW5lLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IG51bWJlciA9IHN0YXJ0ICsgMSArIGluZGV4O1xuICAgICAgICAgICAgbGV0IGd1dHRlciA9ICcgJyArICgnICcgKyBudW1iZXIpLnNsaWNlKC1tYXhXaWR0aCkgKyAnIHwgJztcbiAgICAgICAgICAgIGlmICggbnVtYmVyID09PSB0aGlzLmxpbmUgKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNwYWNpbmcgPVxuICAgICAgICAgICAgICAgICAgICBhc2lkZShndXR0ZXIucmVwbGFjZSgvXFxkL2csICcgJykpICtcbiAgICAgICAgICAgICAgICAgICAgbGluZS5zbGljZSgwLCB0aGlzLmNvbHVtbiAtIDEpLnJlcGxhY2UoL1teXFx0XS9nLCAnICcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrKCc+JykgKyBhc2lkZShndXR0ZXIpICsgbGluZSArICdcXG4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgIHNwYWNpbmcgKyBtYXJrKCdeJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAnICcgKyBhc2lkZShndXR0ZXIpICsgbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBlcnJvciBwb3NpdGlvbiwgbWVzc2FnZSBhbmQgc291cmNlIGNvZGUgb2YgdGhlIGJyb2tlbiBwYXJ0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBlcnJvci50b1N0cmluZygpIC8vPT4gXCJDc3NTeW50YXhFcnJvcjogYXBwLmNzczoxOjE6IFVuY2xvc2VkIGJsb2NrXG4gICAgICogICAgICAgICAgICAgICAgICAvLyAgICA+IDEgfCBhIHtcbiAgICAgKiAgICAgICAgICAgICAgICAgIC8vICAgICAgICB8IF5cIlxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBlcnJvciBwb3NpdGlvbiwgbWVzc2FnZSBhbmQgc291cmNlIGNvZGVcbiAgICAgKi9cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IGNvZGUgPSB0aGlzLnNob3dTb3VyY2VDb2RlKCk7XG4gICAgICAgIGlmICggY29kZSApIHtcbiAgICAgICAgICAgIGNvZGUgPSAnXFxuXFxuJyArIGNvZGUgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgJzogJyArIHRoaXMubWVzc2FnZSArIGNvZGU7XG4gICAgfVxuXG4gICAgZ2V0IGdlbmVyYXRlZCgpIHtcbiAgICAgICAgd2Fybk9uY2UoJ0Nzc1N5bnRheEVycm9yI2dlbmVyYXRlZCBpcyBkZXByZWFjdGVkLiBVc2UgaW5wdXQgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIENzc1N5bnRheEVycm9yI1xuICAgICAqIEBtZW1iZXIge0lucHV0fSBpbnB1dCAtIElucHV0IG9iamVjdCB3aXRoIFBvc3RDU1MgaW50ZXJuYWwgaW5mb3JtYXRpb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBhYm91dCBpbnB1dCBmaWxlLiBJZiBpbnB1dCBoYXMgc291cmNlIG1hcFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gcHJldmlvdXMgdG9vbCwgUG9zdENTUyB3aWxsIHVzZSBvcmlnaW5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAoZm9yIGV4YW1wbGUsIFNhc3MpIHNvdXJjZS4gWW91IGNhbiB1c2UgdGhpc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCB0byBnZXQgUG9zdENTUyBpbnB1dCBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGVycm9yLmlucHV0LmZpbGUgLy89PiAnYS5jc3MnXG4gICAgICogZXJyb3IuZmlsZSAgICAgICAvLz0+ICdhLnNhc3MnXG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3NzU3ludGF4RXJyb3I7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	module.exports = false;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var escapeStringRegexp = __webpack_require__(9);
	var ansiStyles = __webpack_require__(10);
	var stripAnsi = __webpack_require__(12);
	var hasAnsi = __webpack_require__(14);
	var supportsColor = __webpack_require__(15);
	var defineProps = Object.defineProperties;
	var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);
	
	function Chalk(options) {
		// detect mode if not set manually
		this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
	}
	
	// use bright blue on Windows as the normal blue color is illegible
	if (isSimpleWindowsTerm) {
		ansiStyles.blue.open = '\u001b[94m';
	}
	
	var styles = (function () {
		var ret = {};
	
		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
	
			ret[key] = {
				get: function () {
					return build.call(this, this._styles.concat(key));
				}
			};
		});
	
		return ret;
	})();
	
	var proto = defineProps(function chalk() {}, styles);
	
	function build(_styles) {
		var builder = function () {
			return applyStyle.apply(builder, arguments);
		};
	
		builder._styles = _styles;
		builder.enabled = this.enabled;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		/* eslint-disable no-proto */
		builder.__proto__ = proto;
	
		return builder;
	}
	
	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);
	
		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}
	
		if (!this.enabled || !str) {
			return str;
		}
	
		var nestedStyles = this._styles;
		var i = nestedStyles.length;
	
		// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
		// see https://github.com/chalk/chalk/issues/58
		// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
		var originalDim = ansiStyles.dim.open;
		if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
			ansiStyles.dim.open = '';
		}
	
		while (i--) {
			var code = ansiStyles[nestedStyles[i]];
	
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}
	
		// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
		ansiStyles.dim.open = originalDim;
	
		return str;
	}
	
	function init() {
		var ret = {};
	
		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function () {
					return build.call(this, [name]);
				}
			};
		});
	
		return ret;
	}
	
	defineProps(Chalk.prototype, init());
	
	module.exports = new Chalk();
	module.exports.styles = ansiStyles;
	module.exports.hasColor = hasAnsi;
	module.exports.stripColor = stripAnsi;
	module.exports.supportsColor = supportsColor;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
	
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	function assembleStyles () {
		var styles = {
			modifiers: {
				reset: [0, 0],
				bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			colors: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],
				gray: [90, 39]
			},
			bgColors: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49]
			}
		};
	
		// fix humans
		styles.colors.grey = styles.colors.gray;
	
		Object.keys(styles).forEach(function (groupName) {
			var group = styles[groupName];
	
			Object.keys(group).forEach(function (styleName) {
				var style = group[styleName];
	
				styles[styleName] = group[styleName] = {
					open: '\u001b[' + style[0] + 'm',
					close: '\u001b[' + style[1] + 'm'
				};
			});
	
			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		});
	
		return styles;
	}
	
	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(13)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(13);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var argv = process.argv;
	
	var terminator = argv.indexOf('--');
	var hasFlag = function (flag) {
		flag = '--' + flag;
		var pos = argv.indexOf(flag);
		return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
	};
	
	module.exports = (function () {
		if ('FORCE_COLOR' in process.env) {
			return true;
		}
	
		if (hasFlag('no-color') ||
			hasFlag('no-colors') ||
			hasFlag('color=false')) {
			return false;
		}
	
		if (hasFlag('color') ||
			hasFlag('colors') ||
			hasFlag('color=true') ||
			hasFlag('color=always')) {
			return true;
		}
	
		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}
	
		if (process.platform === 'win32') {
			return true;
		}
	
		if ('COLORTERM' in process.env) {
			return true;
		}
	
		if (process.env.TERM === 'dumb') {
			return false;
		}
	
		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}
	
		return false;
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _chalk = __webpack_require__(7);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _tokenize = __webpack_require__(17);
	
	var _tokenize2 = _interopRequireDefault(_tokenize);
	
	var _input = __webpack_require__(18);
	
	var _input2 = _interopRequireDefault(_input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var colors = new _chalk2.default.constructor({ enabled: true });
	
	var HIGHLIGHT_THEME = {
	    'brackets': colors.cyan,
	    'at-word': colors.cyan,
	    'call': colors.cyan,
	    'comment': colors.gray,
	    'string': colors.green,
	    'class': colors.yellow,
	    'hash': colors.magenta,
	    '(': colors.cyan,
	    ')': colors.cyan,
	    '{': colors.yellow,
	    '}': colors.yellow,
	    '[': colors.yellow,
	    ']': colors.yellow,
	    ':': colors.yellow,
	    ';': colors.yellow
	};
	
	function getTokenType(_ref, index, tokens) {
	    var type = _ref[0];
	    var value = _ref[1];
	
	    if (type === 'word') {
	        if (value[0] === '.') {
	            return 'class';
	        }
	        if (value[0] === '#') {
	            return 'hash';
	        }
	    }
	
	    var nextToken = tokens[index + 1];
	    if (nextToken && (nextToken[0] === 'brackets' || nextToken[0] === '(')) {
	        return 'call';
	    }
	
	    return type;
	}
	
	function terminalHighlight(css) {
	    var tokens = (0, _tokenize2.default)(new _input2.default(css), { ignoreErrors: true });
	    return tokens.map(function (token, index) {
	        var color = HIGHLIGHT_THEME[getTokenType(token, index, tokens)];
	        if (color) {
	            return token[1].split(/\r?\n/).map(function (i) {
	                return color(i);
	            }).join('\n');
	        } else {
	            return token[1];
	        }
	    }).join('');
	}
	
	exports.default = terminalHighlight;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlcm1pbmFsLWhpZ2hsaWdodC5lczYiXSwibmFtZXMiOlsiY29sb3JzIiwiY29uc3RydWN0b3IiLCJlbmFibGVkIiwiSElHSExJR0hUX1RIRU1FIiwiY3lhbiIsImdyYXkiLCJncmVlbiIsInllbGxvdyIsIm1hZ2VudGEiLCJnZXRUb2tlblR5cGUiLCJpbmRleCIsInRva2VucyIsInR5cGUiLCJ2YWx1ZSIsIm5leHRUb2tlbiIsInRlcm1pbmFsSGlnaGxpZ2h0IiwiY3NzIiwiaWdub3JlRXJyb3JzIiwibWFwIiwidG9rZW4iLCJjb2xvciIsInNwbGl0IiwiaSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUlBLFNBQVMsSUFBSSxnQkFBTUMsV0FBVixDQUFzQixFQUFFQyxTQUFTLElBQVgsRUFBdEIsQ0FBYjs7QUFFQSxJQUFNQyxrQkFBa0I7QUFDcEIsZ0JBQVlILE9BQU9JLElBREM7QUFFcEIsZUFBWUosT0FBT0ksSUFGQztBQUdwQixZQUFZSixPQUFPSSxJQUhDO0FBSXBCLGVBQVlKLE9BQU9LLElBSkM7QUFLcEIsY0FBWUwsT0FBT00sS0FMQztBQU1wQixhQUFZTixPQUFPTyxNQU5DO0FBT3BCLFlBQVlQLE9BQU9RLE9BUEM7QUFRcEIsU0FBWVIsT0FBT0ksSUFSQztBQVNwQixTQUFZSixPQUFPSSxJQVRDO0FBVXBCLFNBQVlKLE9BQU9PLE1BVkM7QUFXcEIsU0FBWVAsT0FBT08sTUFYQztBQVlwQixTQUFZUCxPQUFPTyxNQVpDO0FBYXBCLFNBQVlQLE9BQU9PLE1BYkM7QUFjcEIsU0FBWVAsT0FBT08sTUFkQztBQWVwQixTQUFZUCxPQUFPTztBQWZDLENBQXhCOztBQWtCQSxTQUFTRSxZQUFULE9BQXFDQyxLQUFyQyxFQUE0Q0MsTUFBNUMsRUFBb0Q7QUFBQSxRQUE3QkMsSUFBNkI7QUFBQSxRQUF2QkMsS0FBdUI7O0FBQ2hELFFBQUlELFNBQVMsTUFBYixFQUFxQjtBQUNqQixZQUFJQyxNQUFNLENBQU4sTUFBYSxHQUFqQixFQUFzQjtBQUNsQixtQkFBTyxPQUFQO0FBQ0g7QUFDRCxZQUFJQSxNQUFNLENBQU4sTUFBYSxHQUFqQixFQUFzQjtBQUNsQixtQkFBTyxNQUFQO0FBQ0g7QUFDSjs7QUFFRCxRQUFJQyxZQUFZSCxPQUFPRCxRQUFRLENBQWYsQ0FBaEI7QUFDQSxRQUFJSSxjQUFjQSxVQUFVLENBQVYsTUFBaUIsVUFBakIsSUFBK0JBLFVBQVUsQ0FBVixNQUFpQixHQUE5RCxDQUFKLEVBQXdFO0FBQ3BFLGVBQU8sTUFBUDtBQUNIOztBQUVELFdBQU9GLElBQVA7QUFDSDs7QUFFRCxTQUFTRyxpQkFBVCxDQUEyQkMsR0FBM0IsRUFBZ0M7QUFDNUIsUUFBSUwsU0FBUyx3QkFBUyxvQkFBVUssR0FBVixDQUFULEVBQXlCLEVBQUVDLGNBQWMsSUFBaEIsRUFBekIsQ0FBYjtBQUNBLFdBQU9OLE9BQU9PLEdBQVAsQ0FBVyxVQUFDQyxLQUFELEVBQVFULEtBQVIsRUFBa0I7QUFDaEMsWUFBSVUsUUFBUWpCLGdCQUFnQk0sYUFBYVUsS0FBYixFQUFvQlQsS0FBcEIsRUFBMkJDLE1BQTNCLENBQWhCLENBQVo7QUFDQSxZQUFLUyxLQUFMLEVBQWE7QUFDVCxtQkFBT0QsTUFBTSxDQUFOLEVBQVNFLEtBQVQsQ0FBZSxPQUFmLEVBQ0pILEdBREksQ0FDQztBQUFBLHVCQUFLRSxNQUFNRSxDQUFOLENBQUw7QUFBQSxhQURELEVBRUpDLElBRkksQ0FFQyxJQUZELENBQVA7QUFHSCxTQUpELE1BSU87QUFDSCxtQkFBT0osTUFBTSxDQUFOLENBQVA7QUFDSDtBQUNKLEtBVE0sRUFTSkksSUFUSSxDQVNDLEVBVEQsQ0FBUDtBQVVIOztrQkFFY1IsaUIiLCJmaWxlIjoidGVybWluYWwtaGlnaGxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcblxuaW1wb3J0IHRva2VuaXplIGZyb20gJy4vdG9rZW5pemUnO1xuaW1wb3J0IElucHV0ICAgIGZyb20gJy4vaW5wdXQnO1xuXG5sZXQgY29sb3JzID0gbmV3IGNoYWxrLmNvbnN0cnVjdG9yKHsgZW5hYmxlZDogdHJ1ZSB9KTtcblxuY29uc3QgSElHSExJR0hUX1RIRU1FID0ge1xuICAgICdicmFja2V0cyc6IGNvbG9ycy5jeWFuLFxuICAgICdhdC13b3JkJzogIGNvbG9ycy5jeWFuLFxuICAgICdjYWxsJzogICAgIGNvbG9ycy5jeWFuLFxuICAgICdjb21tZW50JzogIGNvbG9ycy5ncmF5LFxuICAgICdzdHJpbmcnOiAgIGNvbG9ycy5ncmVlbixcbiAgICAnY2xhc3MnOiAgICBjb2xvcnMueWVsbG93LFxuICAgICdoYXNoJzogICAgIGNvbG9ycy5tYWdlbnRhLFxuICAgICcoJzogICAgICAgIGNvbG9ycy5jeWFuLFxuICAgICcpJzogICAgICAgIGNvbG9ycy5jeWFuLFxuICAgICd7JzogICAgICAgIGNvbG9ycy55ZWxsb3csXG4gICAgJ30nOiAgICAgICAgY29sb3JzLnllbGxvdyxcbiAgICAnWyc6ICAgICAgICBjb2xvcnMueWVsbG93LFxuICAgICddJzogICAgICAgIGNvbG9ycy55ZWxsb3csXG4gICAgJzonOiAgICAgICAgY29sb3JzLnllbGxvdyxcbiAgICAnOyc6ICAgICAgICBjb2xvcnMueWVsbG93XG59O1xuXG5mdW5jdGlvbiBnZXRUb2tlblR5cGUoW3R5cGUsIHZhbHVlXSwgaW5kZXgsIHRva2Vucykge1xuICAgIGlmICh0eXBlID09PSAnd29yZCcpIHtcbiAgICAgICAgaWYgKHZhbHVlWzBdID09PSAnLicpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2xhc3MnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZVswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hhc2gnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG5leHRUb2tlbiA9IHRva2Vuc1tpbmRleCArIDFdO1xuICAgIGlmIChuZXh0VG9rZW4gJiYgKG5leHRUb2tlblswXSA9PT0gJ2JyYWNrZXRzJyB8fCBuZXh0VG9rZW5bMF0gPT09ICcoJykpIHtcbiAgICAgICAgcmV0dXJuICdjYWxsJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gdGVybWluYWxIaWdobGlnaHQoY3NzKSB7XG4gICAgbGV0IHRva2VucyA9IHRva2VuaXplKG5ldyBJbnB1dChjc3MpLCB7IGlnbm9yZUVycm9yczogdHJ1ZSB9KTtcbiAgICByZXR1cm4gdG9rZW5zLm1hcCgodG9rZW4sIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBjb2xvciA9IEhJR0hMSUdIVF9USEVNRVtnZXRUb2tlblR5cGUodG9rZW4sIGluZGV4LCB0b2tlbnMpXTtcbiAgICAgICAgaWYgKCBjb2xvciApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2tlblsxXS5zcGxpdCgvXFxyP1xcbi8pXG4gICAgICAgICAgICAgIC5tYXAoIGkgPT4gY29sb3IoaSkgKVxuICAgICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5bMV07XG4gICAgICAgIH1cbiAgICB9KS5qb2luKCcnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdGVybWluYWxIaWdobGlnaHQ7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = tokenize;
	var SINGLE_QUOTE = 39;
	var DOUBLE_QUOTE = 34;
	var BACKSLASH = 92;
	var SLASH = 47;
	var NEWLINE = 10;
	var SPACE = 32;
	var FEED = 12;
	var TAB = 9;
	var CR = 13;
	var OPEN_SQUARE = 91;
	var CLOSE_SQUARE = 93;
	var OPEN_PARENTHESES = 40;
	var CLOSE_PARENTHESES = 41;
	var OPEN_CURLY = 123;
	var CLOSE_CURLY = 125;
	var SEMICOLON = 59;
	var ASTERISK = 42;
	var COLON = 58;
	var AT = 64;
	
	var RE_AT_END = /[ \n\t\r\f\{\(\)'"\\;/\[\]#]/g;
	var RE_WORD_END = /[ \n\t\r\f\(\)\{\}:;@!'"\\\]\[#]|\/(?=\*)/g;
	var RE_BAD_BRACKET = /.[\\\/\("'\n]/;
	
	function tokenize(input) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    var tokens = [];
	    var css = input.css.valueOf();
	
	    var ignore = options.ignoreErrors;
	
	    var code = void 0,
	        next = void 0,
	        quote = void 0,
	        lines = void 0,
	        last = void 0,
	        content = void 0,
	        escape = void 0,
	        nextLine = void 0,
	        nextOffset = void 0,
	        escaped = void 0,
	        escapePos = void 0,
	        prev = void 0,
	        n = void 0;
	
	    var length = css.length;
	    var offset = -1;
	    var line = 1;
	    var pos = 0;
	
	    function unclosed(what) {
	        throw input.error('Unclosed ' + what, line, pos - offset);
	    }
	
	    while (pos < length) {
	        code = css.charCodeAt(pos);
	
	        if (code === NEWLINE || code === FEED || code === CR && css.charCodeAt(pos + 1) !== NEWLINE) {
	            offset = pos;
	            line += 1;
	        }
	
	        switch (code) {
	            case NEWLINE:
	            case SPACE:
	            case TAB:
	            case CR:
	            case FEED:
	                next = pos;
	                do {
	                    next += 1;
	                    code = css.charCodeAt(next);
	                    if (code === NEWLINE) {
	                        offset = next;
	                        line += 1;
	                    }
	                } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
	
	                tokens.push(['space', css.slice(pos, next)]);
	                pos = next - 1;
	                break;
	
	            case OPEN_SQUARE:
	                tokens.push(['[', '[', line, pos - offset]);
	                break;
	
	            case CLOSE_SQUARE:
	                tokens.push([']', ']', line, pos - offset]);
	                break;
	
	            case OPEN_CURLY:
	                tokens.push(['{', '{', line, pos - offset]);
	                break;
	
	            case CLOSE_CURLY:
	                tokens.push(['}', '}', line, pos - offset]);
	                break;
	
	            case COLON:
	                tokens.push([':', ':', line, pos - offset]);
	                break;
	
	            case SEMICOLON:
	                tokens.push([';', ';', line, pos - offset]);
	                break;
	
	            case OPEN_PARENTHESES:
	                prev = tokens.length ? tokens[tokens.length - 1][1] : '';
	                n = css.charCodeAt(pos + 1);
	                if (prev === 'url' && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
	                    next = pos;
	                    do {
	                        escaped = false;
	                        next = css.indexOf(')', next + 1);
	                        if (next === -1) {
	                            if (ignore) {
	                                next = pos;
	                                break;
	                            } else {
	                                unclosed('bracket');
	                            }
	                        }
	                        escapePos = next;
	                        while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	                            escapePos -= 1;
	                            escaped = !escaped;
	                        }
	                    } while (escaped);
	
	                    tokens.push(['brackets', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
	                    pos = next;
	                } else {
	                    next = css.indexOf(')', pos + 1);
	                    content = css.slice(pos, next + 1);
	
	                    if (next === -1 || RE_BAD_BRACKET.test(content)) {
	                        tokens.push(['(', '(', line, pos - offset]);
	                    } else {
	                        tokens.push(['brackets', content, line, pos - offset, line, next - offset]);
	                        pos = next;
	                    }
	                }
	
	                break;
	
	            case CLOSE_PARENTHESES:
	                tokens.push([')', ')', line, pos - offset]);
	                break;
	
	            case SINGLE_QUOTE:
	            case DOUBLE_QUOTE:
	                quote = code === SINGLE_QUOTE ? '\'' : '"';
	                next = pos;
	                do {
	                    escaped = false;
	                    next = css.indexOf(quote, next + 1);
	                    if (next === -1) {
	                        if (ignore) {
	                            next = pos + 1;
	                            break;
	                        } else {
	                            unclosed('quote');
	                        }
	                    }
	                    escapePos = next;
	                    while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	                        escapePos -= 1;
	                        escaped = !escaped;
	                    }
	                } while (escaped);
	
	                content = css.slice(pos, next + 1);
	                lines = content.split('\n');
	                last = lines.length - 1;
	
	                if (last > 0) {
	                    nextLine = line + last;
	                    nextOffset = next - lines[last].length;
	                } else {
	                    nextLine = line;
	                    nextOffset = offset;
	                }
	
	                tokens.push(['string', css.slice(pos, next + 1), line, pos - offset, nextLine, next - nextOffset]);
	
	                offset = nextOffset;
	                line = nextLine;
	                pos = next;
	                break;
	
	            case AT:
	                RE_AT_END.lastIndex = pos + 1;
	                RE_AT_END.test(css);
	                if (RE_AT_END.lastIndex === 0) {
	                    next = css.length - 1;
	                } else {
	                    next = RE_AT_END.lastIndex - 2;
	                }
	                tokens.push(['at-word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
	                pos = next;
	                break;
	
	            case BACKSLASH:
	                next = pos;
	                escape = true;
	                while (css.charCodeAt(next + 1) === BACKSLASH) {
	                    next += 1;
	                    escape = !escape;
	                }
	                code = css.charCodeAt(next + 1);
	                if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
	                    next += 1;
	                }
	                tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
	                pos = next;
	                break;
	
	            default:
	                if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
	                    next = css.indexOf('*/', pos + 2) + 1;
	                    if (next === 0) {
	                        if (ignore) {
	                            next = css.length;
	                        } else {
	                            unclosed('comment');
	                        }
	                    }
	
	                    content = css.slice(pos, next + 1);
	                    lines = content.split('\n');
	                    last = lines.length - 1;
	
	                    if (last > 0) {
	                        nextLine = line + last;
	                        nextOffset = next - lines[last].length;
	                    } else {
	                        nextLine = line;
	                        nextOffset = offset;
	                    }
	
	                    tokens.push(['comment', content, line, pos - offset, nextLine, next - nextOffset]);
	
	                    offset = nextOffset;
	                    line = nextLine;
	                    pos = next;
	                } else {
	                    RE_WORD_END.lastIndex = pos + 1;
	                    RE_WORD_END.test(css);
	                    if (RE_WORD_END.lastIndex === 0) {
	                        next = css.length - 1;
	                    } else {
	                        next = RE_WORD_END.lastIndex - 2;
	                    }
	
	                    tokens.push(['word', css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
	                    pos = next;
	                }
	
	                break;
	        }
	
	        pos++;
	    }
	
	    return tokens;
	}
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRva2VuaXplLmVzNiJdLCJuYW1lcyI6WyJ0b2tlbml6ZSIsIlNJTkdMRV9RVU9URSIsIkRPVUJMRV9RVU9URSIsIkJBQ0tTTEFTSCIsIlNMQVNIIiwiTkVXTElORSIsIlNQQUNFIiwiRkVFRCIsIlRBQiIsIkNSIiwiT1BFTl9TUVVBUkUiLCJDTE9TRV9TUVVBUkUiLCJPUEVOX1BBUkVOVEhFU0VTIiwiQ0xPU0VfUEFSRU5USEVTRVMiLCJPUEVOX0NVUkxZIiwiQ0xPU0VfQ1VSTFkiLCJTRU1JQ09MT04iLCJBU1RFUklTSyIsIkNPTE9OIiwiQVQiLCJSRV9BVF9FTkQiLCJSRV9XT1JEX0VORCIsIlJFX0JBRF9CUkFDS0VUIiwiaW5wdXQiLCJvcHRpb25zIiwidG9rZW5zIiwiY3NzIiwidmFsdWVPZiIsImlnbm9yZSIsImlnbm9yZUVycm9ycyIsImNvZGUiLCJuZXh0IiwicXVvdGUiLCJsaW5lcyIsImxhc3QiLCJjb250ZW50IiwiZXNjYXBlIiwibmV4dExpbmUiLCJuZXh0T2Zmc2V0IiwiZXNjYXBlZCIsImVzY2FwZVBvcyIsInByZXYiLCJuIiwibGVuZ3RoIiwib2Zmc2V0IiwibGluZSIsInBvcyIsInVuY2xvc2VkIiwid2hhdCIsImVycm9yIiwiY2hhckNvZGVBdCIsInB1c2giLCJzbGljZSIsImluZGV4T2YiLCJ0ZXN0Iiwic3BsaXQiLCJsYXN0SW5kZXgiXSwibWFwcGluZ3MiOiI7OztrQkF3QndCQSxRO0FBeEJ4QixJQUFNQyxpQkFBTjtBQUNBLElBQU1DLGlCQUFOO0FBQ0EsSUFBTUMsY0FBTjtBQUNBLElBQU1DLFVBQU47QUFDQSxJQUFNQyxZQUFOO0FBQ0EsSUFBTUMsVUFBTjtBQUNBLElBQU1DLFNBQU47QUFDQSxJQUFNQyxPQUFOO0FBQ0EsSUFBTUMsT0FBTjtBQUNBLElBQU1DLGdCQUFOO0FBQ0EsSUFBTUMsaUJBQU47QUFDQSxJQUFNQyxxQkFBTjtBQUNBLElBQU1DLHNCQUFOO0FBQ0EsSUFBTUMsZ0JBQU47QUFDQSxJQUFNQyxpQkFBTjtBQUNBLElBQU1DLGNBQU47QUFDQSxJQUFNQyxhQUFOO0FBQ0EsSUFBTUMsVUFBTjtBQUNBLElBQU1DLE9BQU47O0FBRUEsSUFBTUMsWUFBaUIsK0JBQXZCO0FBQ0EsSUFBTUMsY0FBaUIsNENBQXZCO0FBQ0EsSUFBTUMsaUJBQWlCLGVBQXZCOztBQUVlLFNBQVN0QixRQUFULENBQWtCdUIsS0FBbEIsRUFBd0M7QUFBQSxRQUFmQyxPQUFlLHVFQUFMLEVBQUs7O0FBQ25ELFFBQUlDLFNBQVMsRUFBYjtBQUNBLFFBQUlDLE1BQVNILE1BQU1HLEdBQU4sQ0FBVUMsT0FBVixFQUFiOztBQUVBLFFBQUlDLFNBQVNKLFFBQVFLLFlBQXJCOztBQUVBLFFBQUlDLGFBQUo7QUFBQSxRQUFVQyxhQUFWO0FBQUEsUUFBZ0JDLGNBQWhCO0FBQUEsUUFBdUJDLGNBQXZCO0FBQUEsUUFBOEJDLGFBQTlCO0FBQUEsUUFBb0NDLGdCQUFwQztBQUFBLFFBQTZDQyxlQUE3QztBQUFBLFFBQ0lDLGlCQURKO0FBQUEsUUFDY0MsbUJBRGQ7QUFBQSxRQUMwQkMsZ0JBRDFCO0FBQUEsUUFDbUNDLGtCQURuQztBQUFBLFFBQzhDQyxhQUQ5QztBQUFBLFFBQ29EQyxVQURwRDs7QUFHQSxRQUFJQyxTQUFTakIsSUFBSWlCLE1BQWpCO0FBQ0EsUUFBSUMsU0FBUyxDQUFDLENBQWQ7QUFDQSxRQUFJQyxPQUFVLENBQWQ7QUFDQSxRQUFJQyxNQUFVLENBQWQ7O0FBRUEsYUFBU0MsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7QUFDcEIsY0FBTXpCLE1BQU0wQixLQUFOLENBQVksY0FBY0QsSUFBMUIsRUFBZ0NILElBQWhDLEVBQXNDQyxNQUFNRixNQUE1QyxDQUFOO0FBQ0g7O0FBRUQsV0FBUUUsTUFBTUgsTUFBZCxFQUF1QjtBQUNuQmIsZUFBT0osSUFBSXdCLFVBQUosQ0FBZUosR0FBZixDQUFQOztBQUVBLFlBQUtoQixTQUFTekIsT0FBVCxJQUFvQnlCLFNBQVN2QixJQUE3QixJQUNBdUIsU0FBU3JCLEVBQVQsSUFBZWlCLElBQUl3QixVQUFKLENBQWVKLE1BQU0sQ0FBckIsTUFBNEJ6QyxPQURoRCxFQUMwRDtBQUN0RHVDLHFCQUFTRSxHQUFUO0FBQ0FELG9CQUFTLENBQVQ7QUFDSDs7QUFFRCxnQkFBU2YsSUFBVDtBQUNBLGlCQUFLekIsT0FBTDtBQUNBLGlCQUFLQyxLQUFMO0FBQ0EsaUJBQUtFLEdBQUw7QUFDQSxpQkFBS0MsRUFBTDtBQUNBLGlCQUFLRixJQUFMO0FBQ0l3Qix1QkFBT2UsR0FBUDtBQUNBLG1CQUFHO0FBQ0NmLDRCQUFRLENBQVI7QUFDQUQsMkJBQU9KLElBQUl3QixVQUFKLENBQWVuQixJQUFmLENBQVA7QUFDQSx3QkFBS0QsU0FBU3pCLE9BQWQsRUFBd0I7QUFDcEJ1QyxpQ0FBU2IsSUFBVDtBQUNBYyxnQ0FBUyxDQUFUO0FBQ0g7QUFDSixpQkFQRCxRQU9VZixTQUFTeEIsS0FBVCxJQUNBd0IsU0FBU3pCLE9BRFQsSUFFQXlCLFNBQVN0QixHQUZULElBR0FzQixTQUFTckIsRUFIVCxJQUlBcUIsU0FBU3ZCLElBWG5COztBQWFBa0IsdUJBQU8wQixJQUFQLENBQVksQ0FBQyxPQUFELEVBQVV6QixJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLElBQWYsQ0FBVixDQUFaO0FBQ0FlLHNCQUFNZixPQUFPLENBQWI7QUFDQTs7QUFFSixpQkFBS3JCLFdBQUw7QUFDSWUsdUJBQU8wQixJQUFQLENBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXTixJQUFYLEVBQWlCQyxNQUFNRixNQUF2QixDQUFaO0FBQ0E7O0FBRUosaUJBQUtqQyxZQUFMO0FBQ0ljLHVCQUFPMEIsSUFBUCxDQUFZLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBV04sSUFBWCxFQUFpQkMsTUFBTUYsTUFBdkIsQ0FBWjtBQUNBOztBQUVKLGlCQUFLOUIsVUFBTDtBQUNJVyx1QkFBTzBCLElBQVAsQ0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVdOLElBQVgsRUFBaUJDLE1BQU1GLE1BQXZCLENBQVo7QUFDQTs7QUFFSixpQkFBSzdCLFdBQUw7QUFDSVUsdUJBQU8wQixJQUFQLENBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXTixJQUFYLEVBQWlCQyxNQUFNRixNQUF2QixDQUFaO0FBQ0E7O0FBRUosaUJBQUsxQixLQUFMO0FBQ0lPLHVCQUFPMEIsSUFBUCxDQUFZLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBV04sSUFBWCxFQUFpQkMsTUFBTUYsTUFBdkIsQ0FBWjtBQUNBOztBQUVKLGlCQUFLNUIsU0FBTDtBQUNJUyx1QkFBTzBCLElBQVAsQ0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVdOLElBQVgsRUFBaUJDLE1BQU1GLE1BQXZCLENBQVo7QUFDQTs7QUFFSixpQkFBS2hDLGdCQUFMO0FBQ0k2Qix1QkFBT2hCLE9BQU9rQixNQUFQLEdBQWdCbEIsT0FBT0EsT0FBT2tCLE1BQVAsR0FBZ0IsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBaEIsR0FBK0MsRUFBdEQ7QUFDQUQsb0JBQU9oQixJQUFJd0IsVUFBSixDQUFlSixNQUFNLENBQXJCLENBQVA7QUFDQSxvQkFBS0wsU0FBUyxLQUFULElBQWtCQyxNQUFNekMsWUFBeEIsSUFBd0N5QyxNQUFNeEMsWUFBOUMsSUFDa0J3QyxNQUFNcEMsS0FEeEIsSUFDaUNvQyxNQUFNckMsT0FEdkMsSUFDa0RxQyxNQUFNbEMsR0FEeEQsSUFFa0JrQyxNQUFNbkMsSUFGeEIsSUFFZ0NtQyxNQUFNakMsRUFGM0MsRUFFZ0Q7QUFDNUNzQiwyQkFBT2UsR0FBUDtBQUNBLHVCQUFHO0FBQ0NQLGtDQUFVLEtBQVY7QUFDQVIsK0JBQVVMLElBQUkyQixPQUFKLENBQVksR0FBWixFQUFpQnRCLE9BQU8sQ0FBeEIsQ0FBVjtBQUNBLDRCQUFLQSxTQUFTLENBQUMsQ0FBZixFQUFtQjtBQUNmLGdDQUFLSCxNQUFMLEVBQWM7QUFDVkcsdUNBQU9lLEdBQVA7QUFDQTtBQUNILDZCQUhELE1BR087QUFDSEMseUNBQVMsU0FBVDtBQUNIO0FBQ0o7QUFDRFAsb0NBQVlULElBQVo7QUFDQSwrQkFBUUwsSUFBSXdCLFVBQUosQ0FBZVYsWUFBWSxDQUEzQixNQUFrQ3JDLFNBQTFDLEVBQXNEO0FBQ2xEcUMseUNBQWEsQ0FBYjtBQUNBRCxzQ0FBVSxDQUFDQSxPQUFYO0FBQ0g7QUFDSixxQkFoQkQsUUFnQlVBLE9BaEJWOztBQWtCQWQsMkJBQU8wQixJQUFQLENBQVksQ0FBQyxVQUFELEVBQWF6QixJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLE9BQU8sQ0FBdEIsQ0FBYixFQUNSYyxJQURRLEVBQ0ZDLE1BQU9GLE1BREwsRUFFUkMsSUFGUSxFQUVGZCxPQUFPYSxNQUZMLENBQVo7QUFJQUUsMEJBQU1mLElBQU47QUFFSCxpQkE1QkQsTUE0Qk87QUFDSEEsMkJBQVVMLElBQUkyQixPQUFKLENBQVksR0FBWixFQUFpQlAsTUFBTSxDQUF2QixDQUFWO0FBQ0FYLDhCQUFVVCxJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLE9BQU8sQ0FBdEIsQ0FBVjs7QUFFQSx3QkFBS0EsU0FBUyxDQUFDLENBQVYsSUFBZVQsZUFBZWdDLElBQWYsQ0FBb0JuQixPQUFwQixDQUFwQixFQUFtRDtBQUMvQ1YsK0JBQU8wQixJQUFQLENBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXTixJQUFYLEVBQWlCQyxNQUFNRixNQUF2QixDQUFaO0FBQ0gscUJBRkQsTUFFTztBQUNIbkIsK0JBQU8wQixJQUFQLENBQVksQ0FBQyxVQUFELEVBQWFoQixPQUFiLEVBQ1JVLElBRFEsRUFDRkMsTUFBT0YsTUFETCxFQUVSQyxJQUZRLEVBRUZkLE9BQU9hLE1BRkwsQ0FBWjtBQUlBRSw4QkFBTWYsSUFBTjtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUosaUJBQUtsQixpQkFBTDtBQUNJWSx1QkFBTzBCLElBQVAsQ0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVdOLElBQVgsRUFBaUJDLE1BQU1GLE1BQXZCLENBQVo7QUFDQTs7QUFFSixpQkFBSzNDLFlBQUw7QUFDQSxpQkFBS0MsWUFBTDtBQUNJOEIsd0JBQVFGLFNBQVM3QixZQUFULEdBQXdCLElBQXhCLEdBQStCLEdBQXZDO0FBQ0E4Qix1QkFBUWUsR0FBUjtBQUNBLG1CQUFHO0FBQ0NQLDhCQUFVLEtBQVY7QUFDQVIsMkJBQVVMLElBQUkyQixPQUFKLENBQVlyQixLQUFaLEVBQW1CRCxPQUFPLENBQTFCLENBQVY7QUFDQSx3QkFBS0EsU0FBUyxDQUFDLENBQWYsRUFBbUI7QUFDZiw0QkFBS0gsTUFBTCxFQUFjO0FBQ1ZHLG1DQUFPZSxNQUFNLENBQWI7QUFDQTtBQUNILHlCQUhELE1BR087QUFDSEMscUNBQVMsT0FBVDtBQUNIO0FBQ0o7QUFDRFAsZ0NBQVlULElBQVo7QUFDQSwyQkFBUUwsSUFBSXdCLFVBQUosQ0FBZVYsWUFBWSxDQUEzQixNQUFrQ3JDLFNBQTFDLEVBQXNEO0FBQ2xEcUMscUNBQWEsQ0FBYjtBQUNBRCxrQ0FBVSxDQUFDQSxPQUFYO0FBQ0g7QUFDSixpQkFoQkQsUUFnQlVBLE9BaEJWOztBQWtCQUosMEJBQVVULElBQUkwQixLQUFKLENBQVVOLEdBQVYsRUFBZWYsT0FBTyxDQUF0QixDQUFWO0FBQ0FFLHdCQUFVRSxRQUFRb0IsS0FBUixDQUFjLElBQWQsQ0FBVjtBQUNBckIsdUJBQVVELE1BQU1VLE1BQU4sR0FBZSxDQUF6Qjs7QUFFQSxvQkFBS1QsT0FBTyxDQUFaLEVBQWdCO0FBQ1pHLCtCQUFhUSxPQUFPWCxJQUFwQjtBQUNBSSxpQ0FBYVAsT0FBT0UsTUFBTUMsSUFBTixFQUFZUyxNQUFoQztBQUNILGlCQUhELE1BR087QUFDSE4sK0JBQWFRLElBQWI7QUFDQVAsaUNBQWFNLE1BQWI7QUFDSDs7QUFFRG5CLHVCQUFPMEIsSUFBUCxDQUFZLENBQUMsUUFBRCxFQUFXekIsSUFBSTBCLEtBQUosQ0FBVU4sR0FBVixFQUFlZixPQUFPLENBQXRCLENBQVgsRUFDUmMsSUFEUSxFQUNGQyxNQUFPRixNQURMLEVBRVJQLFFBRlEsRUFFRU4sT0FBT08sVUFGVCxDQUFaOztBQUtBTSx5QkFBU04sVUFBVDtBQUNBTyx1QkFBU1IsUUFBVDtBQUNBUyxzQkFBU2YsSUFBVDtBQUNBOztBQUVKLGlCQUFLWixFQUFMO0FBQ0lDLDBCQUFVb0MsU0FBVixHQUFzQlYsTUFBTSxDQUE1QjtBQUNBMUIsMEJBQVVrQyxJQUFWLENBQWU1QixHQUFmO0FBQ0Esb0JBQUtOLFVBQVVvQyxTQUFWLEtBQXdCLENBQTdCLEVBQWlDO0FBQzdCekIsMkJBQU9MLElBQUlpQixNQUFKLEdBQWEsQ0FBcEI7QUFDSCxpQkFGRCxNQUVPO0FBQ0haLDJCQUFPWCxVQUFVb0MsU0FBVixHQUFzQixDQUE3QjtBQUNIO0FBQ0QvQix1QkFBTzBCLElBQVAsQ0FBWSxDQUFDLFNBQUQsRUFBWXpCLElBQUkwQixLQUFKLENBQVVOLEdBQVYsRUFBZWYsT0FBTyxDQUF0QixDQUFaLEVBQ1JjLElBRFEsRUFDRkMsTUFBT0YsTUFETCxFQUVSQyxJQUZRLEVBRUZkLE9BQU9hLE1BRkwsQ0FBWjtBQUlBRSxzQkFBTWYsSUFBTjtBQUNBOztBQUVKLGlCQUFLNUIsU0FBTDtBQUNJNEIsdUJBQVNlLEdBQVQ7QUFDQVYseUJBQVMsSUFBVDtBQUNBLHVCQUFRVixJQUFJd0IsVUFBSixDQUFlbkIsT0FBTyxDQUF0QixNQUE2QjVCLFNBQXJDLEVBQWlEO0FBQzdDNEIsNEJBQVMsQ0FBVDtBQUNBSyw2QkFBUyxDQUFDQSxNQUFWO0FBQ0g7QUFDRE4sdUJBQU9KLElBQUl3QixVQUFKLENBQWVuQixPQUFPLENBQXRCLENBQVA7QUFDQSxvQkFBS0ssVUFBV04sU0FBUzFCLEtBQVQsSUFDQTBCLFNBQVN4QixLQURULElBRUF3QixTQUFTekIsT0FGVCxJQUdBeUIsU0FBU3RCLEdBSFQsSUFJQXNCLFNBQVNyQixFQUpULElBS0FxQixTQUFTdkIsSUFMekIsRUFLa0M7QUFDOUJ3Qiw0QkFBUSxDQUFSO0FBQ0g7QUFDRE4sdUJBQU8wQixJQUFQLENBQVksQ0FBQyxNQUFELEVBQVN6QixJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLE9BQU8sQ0FBdEIsQ0FBVCxFQUNSYyxJQURRLEVBQ0ZDLE1BQU9GLE1BREwsRUFFUkMsSUFGUSxFQUVGZCxPQUFPYSxNQUZMLENBQVo7QUFJQUUsc0JBQU1mLElBQU47QUFDQTs7QUFFSjtBQUNJLG9CQUFLRCxTQUFTMUIsS0FBVCxJQUFrQnNCLElBQUl3QixVQUFKLENBQWVKLE1BQU0sQ0FBckIsTUFBNEI3QixRQUFuRCxFQUE4RDtBQUMxRGMsMkJBQU9MLElBQUkyQixPQUFKLENBQVksSUFBWixFQUFrQlAsTUFBTSxDQUF4QixJQUE2QixDQUFwQztBQUNBLHdCQUFLZixTQUFTLENBQWQsRUFBa0I7QUFDZCw0QkFBS0gsTUFBTCxFQUFjO0FBQ1ZHLG1DQUFPTCxJQUFJaUIsTUFBWDtBQUNILHlCQUZELE1BRU87QUFDSEkscUNBQVMsU0FBVDtBQUNIO0FBQ0o7O0FBRURaLDhCQUFVVCxJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLE9BQU8sQ0FBdEIsQ0FBVjtBQUNBRSw0QkFBVUUsUUFBUW9CLEtBQVIsQ0FBYyxJQUFkLENBQVY7QUFDQXJCLDJCQUFVRCxNQUFNVSxNQUFOLEdBQWUsQ0FBekI7O0FBRUEsd0JBQUtULE9BQU8sQ0FBWixFQUFnQjtBQUNaRyxtQ0FBYVEsT0FBT1gsSUFBcEI7QUFDQUkscUNBQWFQLE9BQU9FLE1BQU1DLElBQU4sRUFBWVMsTUFBaEM7QUFDSCxxQkFIRCxNQUdPO0FBQ0hOLG1DQUFhUSxJQUFiO0FBQ0FQLHFDQUFhTSxNQUFiO0FBQ0g7O0FBRURuQiwyQkFBTzBCLElBQVAsQ0FBWSxDQUFDLFNBQUQsRUFBWWhCLE9BQVosRUFDUlUsSUFEUSxFQUNFQyxNQUFPRixNQURULEVBRVJQLFFBRlEsRUFFRU4sT0FBT08sVUFGVCxDQUFaOztBQUtBTSw2QkFBU04sVUFBVDtBQUNBTywyQkFBU1IsUUFBVDtBQUNBUywwQkFBU2YsSUFBVDtBQUVILGlCQS9CRCxNQStCTztBQUNIVixnQ0FBWW1DLFNBQVosR0FBd0JWLE1BQU0sQ0FBOUI7QUFDQXpCLGdDQUFZaUMsSUFBWixDQUFpQjVCLEdBQWpCO0FBQ0Esd0JBQUtMLFlBQVltQyxTQUFaLEtBQTBCLENBQS9CLEVBQW1DO0FBQy9CekIsK0JBQU9MLElBQUlpQixNQUFKLEdBQWEsQ0FBcEI7QUFDSCxxQkFGRCxNQUVPO0FBQ0haLCtCQUFPVixZQUFZbUMsU0FBWixHQUF3QixDQUEvQjtBQUNIOztBQUVEL0IsMkJBQU8wQixJQUFQLENBQVksQ0FBQyxNQUFELEVBQVN6QixJQUFJMEIsS0FBSixDQUFVTixHQUFWLEVBQWVmLE9BQU8sQ0FBdEIsQ0FBVCxFQUNSYyxJQURRLEVBQ0ZDLE1BQU9GLE1BREwsRUFFUkMsSUFGUSxFQUVGZCxPQUFPYSxNQUZMLENBQVo7QUFJQUUsMEJBQU1mLElBQU47QUFDSDs7QUFFRDtBQXRPSjs7QUF5T0FlO0FBQ0g7O0FBRUQsV0FBT3JCLE1BQVA7QUFDSCIsImZpbGUiOiJ0b2tlbml6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFNJTkdMRV9RVU9URSAgICAgID0gJ1xcJycuY2hhckNvZGVBdCgwKTtcbmNvbnN0IERPVUJMRV9RVU9URSAgICAgID0gICdcIicuY2hhckNvZGVBdCgwKTtcbmNvbnN0IEJBQ0tTTEFTSCAgICAgICAgID0gJ1xcXFwnLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBTTEFTSCAgICAgICAgICAgICA9ICAnLycuY2hhckNvZGVBdCgwKTtcbmNvbnN0IE5FV0xJTkUgICAgICAgICAgID0gJ1xcbicuY2hhckNvZGVBdCgwKTtcbmNvbnN0IFNQQUNFICAgICAgICAgICAgID0gICcgJy5jaGFyQ29kZUF0KDApO1xuY29uc3QgRkVFRCAgICAgICAgICAgICAgPSAnXFxmJy5jaGFyQ29kZUF0KDApO1xuY29uc3QgVEFCICAgICAgICAgICAgICAgPSAnXFx0Jy5jaGFyQ29kZUF0KDApO1xuY29uc3QgQ1IgICAgICAgICAgICAgICAgPSAnXFxyJy5jaGFyQ29kZUF0KDApO1xuY29uc3QgT1BFTl9TUVVBUkUgICAgICAgPSAgJ1snLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBDTE9TRV9TUVVBUkUgICAgICA9ICAnXScuY2hhckNvZGVBdCgwKTtcbmNvbnN0IE9QRU5fUEFSRU5USEVTRVMgID0gICcoJy5jaGFyQ29kZUF0KDApO1xuY29uc3QgQ0xPU0VfUEFSRU5USEVTRVMgPSAgJyknLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBPUEVOX0NVUkxZICAgICAgICA9ICAneycuY2hhckNvZGVBdCgwKTtcbmNvbnN0IENMT1NFX0NVUkxZICAgICAgID0gICd9Jy5jaGFyQ29kZUF0KDApO1xuY29uc3QgU0VNSUNPTE9OICAgICAgICAgPSAgJzsnLmNoYXJDb2RlQXQoMCk7XG5jb25zdCBBU1RFUklTSyAgICAgICAgICA9ICAnKicuY2hhckNvZGVBdCgwKTtcbmNvbnN0IENPTE9OICAgICAgICAgICAgID0gICc6Jy5jaGFyQ29kZUF0KDApO1xuY29uc3QgQVQgICAgICAgICAgICAgICAgPSAgJ0AnLmNoYXJDb2RlQXQoMCk7XG5cbmNvbnN0IFJFX0FUX0VORCAgICAgID0gL1sgXFxuXFx0XFxyXFxmXFx7XFwoXFwpJ1wiXFxcXDsvXFxbXFxdI10vZztcbmNvbnN0IFJFX1dPUkRfRU5EICAgID0gL1sgXFxuXFx0XFxyXFxmXFwoXFwpXFx7XFx9OjtAISdcIlxcXFxcXF1cXFsjXXxcXC8oPz1cXCopL2c7XG5jb25zdCBSRV9CQURfQlJBQ0tFVCA9IC8uW1xcXFxcXC9cXChcIidcXG5dLztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9rZW5pemUoaW5wdXQsIG9wdGlvbnMgPSB7IH0pIHtcbiAgICBsZXQgdG9rZW5zID0gW107XG4gICAgbGV0IGNzcyAgICA9IGlucHV0LmNzcy52YWx1ZU9mKCk7XG5cbiAgICBsZXQgaWdub3JlID0gb3B0aW9ucy5pZ25vcmVFcnJvcnM7XG5cbiAgICBsZXQgY29kZSwgbmV4dCwgcXVvdGUsIGxpbmVzLCBsYXN0LCBjb250ZW50LCBlc2NhcGUsXG4gICAgICAgIG5leHRMaW5lLCBuZXh0T2Zmc2V0LCBlc2NhcGVkLCBlc2NhcGVQb3MsIHByZXYsIG47XG5cbiAgICBsZXQgbGVuZ3RoID0gY3NzLmxlbmd0aDtcbiAgICBsZXQgb2Zmc2V0ID0gLTE7XG4gICAgbGV0IGxpbmUgICA9ICAxO1xuICAgIGxldCBwb3MgICAgPSAgMDtcblxuICAgIGZ1bmN0aW9uIHVuY2xvc2VkKHdoYXQpIHtcbiAgICAgICAgdGhyb3cgaW5wdXQuZXJyb3IoJ1VuY2xvc2VkICcgKyB3aGF0LCBsaW5lLCBwb3MgLSBvZmZzZXQpO1xuICAgIH1cblxuICAgIHdoaWxlICggcG9zIDwgbGVuZ3RoICkge1xuICAgICAgICBjb2RlID0gY3NzLmNoYXJDb2RlQXQocG9zKTtcblxuICAgICAgICBpZiAoIGNvZGUgPT09IE5FV0xJTkUgfHwgY29kZSA9PT0gRkVFRCB8fFxuICAgICAgICAgICAgIGNvZGUgPT09IENSICYmIGNzcy5jaGFyQ29kZUF0KHBvcyArIDEpICE9PSBORVdMSU5FICkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gcG9zO1xuICAgICAgICAgICAgbGluZSAgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoIGNvZGUgKSB7XG4gICAgICAgIGNhc2UgTkVXTElORTpcbiAgICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgY2FzZSBUQUI6XG4gICAgICAgIGNhc2UgQ1I6XG4gICAgICAgIGNhc2UgRkVFRDpcbiAgICAgICAgICAgIG5leHQgPSBwb3M7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbmV4dCArPSAxO1xuICAgICAgICAgICAgICAgIGNvZGUgPSBjc3MuY2hhckNvZGVBdChuZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoIGNvZGUgPT09IE5FV0xJTkUgKSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IG5leHQ7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoIGNvZGUgPT09IFNQQUNFICAgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSBORVdMSU5FIHx8XG4gICAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gVEFCICAgICB8fFxuICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPT09IENSICAgICAgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSBGRUVEICk7XG5cbiAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnc3BhY2UnLCBjc3Muc2xpY2UocG9zLCBuZXh0KV0pO1xuICAgICAgICAgICAgcG9zID0gbmV4dCAtIDE7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIE9QRU5fU1FVQVJFOlxuICAgICAgICAgICAgdG9rZW5zLnB1c2goWydbJywgJ1snLCBsaW5lLCBwb3MgLSBvZmZzZXRdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQ0xPU0VfU1FVQVJFOlxuICAgICAgICAgICAgdG9rZW5zLnB1c2goWyddJywgJ10nLCBsaW5lLCBwb3MgLSBvZmZzZXRdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgT1BFTl9DVVJMWTpcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKFsneycsICd7JywgbGluZSwgcG9zIC0gb2Zmc2V0XSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIENMT1NFX0NVUkxZOlxuICAgICAgICAgICAgdG9rZW5zLnB1c2goWyd9JywgJ30nLCBsaW5lLCBwb3MgLSBvZmZzZXRdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQ09MT046XG4gICAgICAgICAgICB0b2tlbnMucHVzaChbJzonLCAnOicsIGxpbmUsIHBvcyAtIG9mZnNldF0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBTRU1JQ09MT046XG4gICAgICAgICAgICB0b2tlbnMucHVzaChbJzsnLCAnOycsIGxpbmUsIHBvcyAtIG9mZnNldF0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBPUEVOX1BBUkVOVEhFU0VTOlxuICAgICAgICAgICAgcHJldiA9IHRva2Vucy5sZW5ndGggPyB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzFdIDogJyc7XG4gICAgICAgICAgICBuICAgID0gY3NzLmNoYXJDb2RlQXQocG9zICsgMSk7XG4gICAgICAgICAgICBpZiAoIHByZXYgPT09ICd1cmwnICYmIG4gIT09IFNJTkdMRV9RVU9URSAmJiBuICE9PSBET1VCTEVfUVVPVEUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbiAhPT0gU1BBQ0UgJiYgbiAhPT0gTkVXTElORSAmJiBuICE9PSBUQUIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbiAhPT0gRkVFRCAmJiBuICE9PSBDUiApIHtcbiAgICAgICAgICAgICAgICBuZXh0ID0gcG9zO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBuZXh0ICAgID0gY3NzLmluZGV4T2YoJyknLCBuZXh0ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICggbmV4dCA9PT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGlnbm9yZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gcG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmNsb3NlZCgnYnJhY2tldCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZVBvcyA9IG5leHQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICggY3NzLmNoYXJDb2RlQXQoZXNjYXBlUG9zIC0gMSkgPT09IEJBQ0tTTEFTSCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVzY2FwZVBvcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoIGVzY2FwZWQgKTtcblxuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnYnJhY2tldHMnLCBjc3Muc2xpY2UocG9zLCBuZXh0ICsgMSksXG4gICAgICAgICAgICAgICAgICAgIGxpbmUsIHBvcyAgLSBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGxpbmUsIG5leHQgLSBvZmZzZXRcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBwb3MgPSBuZXh0O1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHQgICAgPSBjc3MuaW5kZXhPZignKScsIHBvcyArIDEpO1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjc3Muc2xpY2UocG9zLCBuZXh0ICsgMSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIG5leHQgPT09IC0xIHx8IFJFX0JBRF9CUkFDS0VULnRlc3QoY29udGVudCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnKCcsICcoJywgbGluZSwgcG9zIC0gb2Zmc2V0XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2goWydicmFja2V0cycsIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLCBwb3MgIC0gb2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZSwgbmV4dCAtIG9mZnNldFxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQ0xPU0VfUEFSRU5USEVTRVM6XG4gICAgICAgICAgICB0b2tlbnMucHVzaChbJyknLCAnKScsIGxpbmUsIHBvcyAtIG9mZnNldF0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBTSU5HTEVfUVVPVEU6XG4gICAgICAgIGNhc2UgRE9VQkxFX1FVT1RFOlxuICAgICAgICAgICAgcXVvdGUgPSBjb2RlID09PSBTSU5HTEVfUVVPVEUgPyAnXFwnJyA6ICdcIic7XG4gICAgICAgICAgICBuZXh0ICA9IHBvcztcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBlc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbmV4dCAgICA9IGNzcy5pbmRleE9mKHF1b3RlLCBuZXh0ICsgMSk7XG4gICAgICAgICAgICAgICAgaWYgKCBuZXh0ID09PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpZ25vcmUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gcG9zICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5jbG9zZWQoJ3F1b3RlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXNjYXBlUG9zID0gbmV4dDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoIGNzcy5jaGFyQ29kZUF0KGVzY2FwZVBvcyAtIDEpID09PSBCQUNLU0xBU0ggKSB7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZVBvcyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoIGVzY2FwZWQgKTtcblxuICAgICAgICAgICAgY29udGVudCA9IGNzcy5zbGljZShwb3MsIG5leHQgKyAxKTtcbiAgICAgICAgICAgIGxpbmVzICAgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGxhc3QgICAgPSBsaW5lcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICBpZiAoIGxhc3QgPiAwICkge1xuICAgICAgICAgICAgICAgIG5leHRMaW5lICAgPSBsaW5lICsgbGFzdDtcbiAgICAgICAgICAgICAgICBuZXh0T2Zmc2V0ID0gbmV4dCAtIGxpbmVzW2xhc3RdLmxlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dExpbmUgICA9IGxpbmU7XG4gICAgICAgICAgICAgICAgbmV4dE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9rZW5zLnB1c2goWydzdHJpbmcnLCBjc3Muc2xpY2UocG9zLCBuZXh0ICsgMSksXG4gICAgICAgICAgICAgICAgbGluZSwgcG9zICAtIG9mZnNldCxcbiAgICAgICAgICAgICAgICBuZXh0TGluZSwgbmV4dCAtIG5leHRPZmZzZXRcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBvZmZzZXQgPSBuZXh0T2Zmc2V0O1xuICAgICAgICAgICAgbGluZSAgID0gbmV4dExpbmU7XG4gICAgICAgICAgICBwb3MgICAgPSBuZXh0O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBBVDpcbiAgICAgICAgICAgIFJFX0FUX0VORC5sYXN0SW5kZXggPSBwb3MgKyAxO1xuICAgICAgICAgICAgUkVfQVRfRU5ELnRlc3QoY3NzKTtcbiAgICAgICAgICAgIGlmICggUkVfQVRfRU5ELmxhc3RJbmRleCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICBuZXh0ID0gY3NzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHQgPSBSRV9BVF9FTkQubGFzdEluZGV4IC0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnYXQtd29yZCcsIGNzcy5zbGljZShwb3MsIG5leHQgKyAxKSxcbiAgICAgICAgICAgICAgICBsaW5lLCBwb3MgIC0gb2Zmc2V0LFxuICAgICAgICAgICAgICAgIGxpbmUsIG5leHQgLSBvZmZzZXRcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgcG9zID0gbmV4dDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgQkFDS1NMQVNIOlxuICAgICAgICAgICAgbmV4dCAgID0gcG9zO1xuICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIHdoaWxlICggY3NzLmNoYXJDb2RlQXQobmV4dCArIDEpID09PSBCQUNLU0xBU0ggKSB7XG4gICAgICAgICAgICAgICAgbmV4dCAgKz0gMTtcbiAgICAgICAgICAgICAgICBlc2NhcGUgPSAhZXNjYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29kZSA9IGNzcy5jaGFyQ29kZUF0KG5leHQgKyAxKTtcbiAgICAgICAgICAgIGlmICggZXNjYXBlICYmIChjb2RlICE9PSBTTEFTSCAgICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSAhPT0gU1BBQ0UgICAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgIT09IE5FV0xJTkUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlICE9PSBUQUIgICAgICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSAhPT0gQ1IgICAgICAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgIT09IEZFRUQgKSApIHtcbiAgICAgICAgICAgICAgICBuZXh0ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMucHVzaChbJ3dvcmQnLCBjc3Muc2xpY2UocG9zLCBuZXh0ICsgMSksXG4gICAgICAgICAgICAgICAgbGluZSwgcG9zICAtIG9mZnNldCxcbiAgICAgICAgICAgICAgICBsaW5lLCBuZXh0IC0gb2Zmc2V0XG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHBvcyA9IG5leHQ7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKCBjb2RlID09PSBTTEFTSCAmJiBjc3MuY2hhckNvZGVBdChwb3MgKyAxKSA9PT0gQVNURVJJU0sgKSB7XG4gICAgICAgICAgICAgICAgbmV4dCA9IGNzcy5pbmRleE9mKCcqLycsIHBvcyArIDIpICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoIG5leHQgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaWdub3JlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGNzcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmNsb3NlZCgnY29tbWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNzcy5zbGljZShwb3MsIG5leHQgKyAxKTtcbiAgICAgICAgICAgICAgICBsaW5lcyAgID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgbGFzdCAgICA9IGxpbmVzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGxhc3QgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0TGluZSAgID0gbGluZSArIGxhc3Q7XG4gICAgICAgICAgICAgICAgICAgIG5leHRPZmZzZXQgPSBuZXh0IC0gbGluZXNbbGFzdF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRMaW5lICAgPSBsaW5lO1xuICAgICAgICAgICAgICAgICAgICBuZXh0T2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnY29tbWVudCcsIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGxpbmUsICAgICBwb3MgIC0gb2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBuZXh0TGluZSwgbmV4dCAtIG5leHRPZmZzZXRcbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgIG9mZnNldCA9IG5leHRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgbGluZSAgID0gbmV4dExpbmU7XG4gICAgICAgICAgICAgICAgcG9zICAgID0gbmV4dDtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBSRV9XT1JEX0VORC5sYXN0SW5kZXggPSBwb3MgKyAxO1xuICAgICAgICAgICAgICAgIFJFX1dPUkRfRU5ELnRlc3QoY3NzKTtcbiAgICAgICAgICAgICAgICBpZiAoIFJFX1dPUkRfRU5ELmxhc3RJbmRleCA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGNzcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBSRV9XT1JEX0VORC5sYXN0SW5kZXggLSAyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKFsnd29yZCcsIGNzcy5zbGljZShwb3MsIG5leHQgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgbGluZSwgcG9zICAtIG9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgbGluZSwgbmV4dCAtIG9mZnNldFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIHBvcyA9IG5leHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2Vucztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _cssSyntaxError = __webpack_require__(5);
	
	var _cssSyntaxError2 = _interopRequireDefault(_cssSyntaxError);
	
	var _previousMap = __webpack_require__(19);
	
	var _previousMap2 = _interopRequireDefault(_previousMap);
	
	var _path = __webpack_require__(36);
	
	var _path2 = _interopRequireDefault(_path);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var sequence = 0;
	
	/**
	 * Represents the source CSS.
	 *
	 * @example
	 * const root  = postcss.parse(css, { from: file });
	 * const input = root.source.input;
	 */
	
	var Input = function () {
	
	    /**
	     * @param {string} css    - input CSS source
	     * @param {object} [opts] - {@link Processor#process} options
	     */
	    function Input(css) {
	        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        _classCallCheck(this, Input);
	
	        /**
	         * @member {string} - input CSS source
	         *
	         * @example
	         * const input = postcss.parse('a{}', { from: file }).input;
	         * input.css //=> "a{}";
	         */
	        this.css = css.toString();
	
	        if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
	            this.css = this.css.slice(1);
	        }
	
	        if (opts.from) {
	            if (/^\w+:\/\//.test(opts.from)) {
	                /**
	                 * @member {string} - The absolute path to the CSS source file
	                 *                    defined with the `from` option.
	                 *
	                 * @example
	                 * const root = postcss.parse(css, { from: 'a.css' });
	                 * root.source.input.file //=> '/home/ai/a.css'
	                 */
	                this.file = opts.from;
	            } else {
	                this.file = _path2.default.resolve(opts.from);
	            }
	        }
	
	        var map = new _previousMap2.default(this.css, opts);
	        if (map.text) {
	            /**
	             * @member {PreviousMap} - The input source map passed from
	             *                         a compilation step before PostCSS
	             *                         (for example, from Sass compiler).
	             *
	             * @example
	             * root.source.input.map.consumer().sources //=> ['a.sass']
	             */
	            this.map = map;
	            var file = map.consumer().file;
	            if (!this.file && file) this.file = this.mapResolve(file);
	        }
	
	        if (!this.file) {
	            sequence += 1;
	            /**
	             * @member {string} - The unique ID of the CSS source. It will be
	             *                    created if `from` option is not provided
	             *                    (because PostCSS does not know the file path).
	             *
	             * @example
	             * const root = postcss.parse(css);
	             * root.source.input.file //=> undefined
	             * root.source.input.id   //=> "<input css 1>"
	             */
	            this.id = '<input css ' + sequence + '>';
	        }
	        if (this.map) this.map.file = this.from;
	    }
	
	    Input.prototype.error = function error(message, line, column) {
	        var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	
	        var result = void 0;
	        var origin = this.origin(line, column);
	        if (origin) {
	            result = new _cssSyntaxError2.default(message, origin.line, origin.column, origin.source, origin.file, opts.plugin);
	        } else {
	            result = new _cssSyntaxError2.default(message, line, column, this.css, this.file, opts.plugin);
	        }
	
	        result.input = { line: line, column: column, source: this.css };
	        if (this.file) result.input.file = this.file;
	
	        return result;
	    };
	
	    /**
	     * Reads the input source map and returns a symbol position
	     * in the input source (e.g., in a Sass file that was compiled
	     * to CSS before being passed to PostCSS).
	     *
	     * @param {number} line   - line in input CSS
	     * @param {number} column - column in input CSS
	     *
	     * @return {filePosition} position in input source
	     *
	     * @example
	     * root.source.input.origin(1, 1) //=> { file: 'a.css', line: 3, column: 1 }
	     */
	
	
	    Input.prototype.origin = function origin(line, column) {
	        if (!this.map) return false;
	        var consumer = this.map.consumer();
	
	        var from = consumer.originalPositionFor({ line: line, column: column });
	        if (!from.source) return false;
	
	        var result = {
	            file: this.mapResolve(from.source),
	            line: from.line,
	            column: from.column
	        };
	
	        var source = consumer.sourceContentFor(from.source);
	        if (source) result.source = source;
	
	        return result;
	    };
	
	    Input.prototype.mapResolve = function mapResolve(file) {
	        if (/^\w+:\/\//.test(file)) {
	            return file;
	        } else {
	            return _path2.default.resolve(this.map.consumer().sourceRoot || '.', file);
	        }
	    };
	
	    /**
	     * The CSS source identifier. Contains {@link Input#file} if the user
	     * set the `from` option, or {@link Input#id} if they did not.
	     * @type {string}
	     *
	     * @example
	     * const root = postcss.parse(css, { from: 'a.css' });
	     * root.source.input.from //=> "/home/ai/a.css"
	     *
	     * const root = postcss.parse(css);
	     * root.source.input.from //=> "<input css 1>"
	     */
	
	
	    _createClass(Input, [{
	        key: 'from',
	        get: function get() {
	            return this.file || this.id;
	        }
	    }]);
	
	    return Input;
	}();
	
	exports.default = Input;
	
	/**
	 * @typedef  {object} filePosition
	 * @property {string} file   - path to file
	 * @property {number} line   - source line in file
	 * @property {number} column - source column in file
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlucHV0LmVzNiJdLCJuYW1lcyI6WyJzZXF1ZW5jZSIsIklucHV0IiwiY3NzIiwib3B0cyIsInRvU3RyaW5nIiwic2xpY2UiLCJmcm9tIiwidGVzdCIsImZpbGUiLCJyZXNvbHZlIiwibWFwIiwidGV4dCIsImNvbnN1bWVyIiwibWFwUmVzb2x2ZSIsImlkIiwiZXJyb3IiLCJtZXNzYWdlIiwibGluZSIsImNvbHVtbiIsInJlc3VsdCIsIm9yaWdpbiIsInNvdXJjZSIsInBsdWdpbiIsImlucHV0Iiwib3JpZ2luYWxQb3NpdGlvbkZvciIsInNvdXJjZUNvbnRlbnRGb3IiLCJzb3VyY2VSb290Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBVyxDQUFmOztBQUVBOzs7Ozs7OztJQU9NQyxLOztBQUVGOzs7O0FBSUEsbUJBQVlDLEdBQVosRUFBNkI7QUFBQSxZQUFaQyxJQUFZLHVFQUFMLEVBQUs7O0FBQUE7O0FBQ3pCOzs7Ozs7O0FBT0EsYUFBS0QsR0FBTCxHQUFXQSxJQUFJRSxRQUFKLEVBQVg7O0FBRUEsWUFBSyxLQUFLRixHQUFMLENBQVMsQ0FBVCxNQUFnQixRQUFoQixJQUE0QixLQUFLQSxHQUFMLENBQVMsQ0FBVCxNQUFnQixRQUFqRCxFQUE0RDtBQUN4RCxpQkFBS0EsR0FBTCxHQUFXLEtBQUtBLEdBQUwsQ0FBU0csS0FBVCxDQUFlLENBQWYsQ0FBWDtBQUNIOztBQUVELFlBQUtGLEtBQUtHLElBQVYsRUFBaUI7QUFDYixnQkFBSyxZQUFZQyxJQUFaLENBQWlCSixLQUFLRyxJQUF0QixDQUFMLEVBQW1DO0FBQy9COzs7Ozs7OztBQVFBLHFCQUFLRSxJQUFMLEdBQVlMLEtBQUtHLElBQWpCO0FBQ0gsYUFWRCxNQVVPO0FBQ0gscUJBQUtFLElBQUwsR0FBWSxlQUFLQyxPQUFMLENBQWFOLEtBQUtHLElBQWxCLENBQVo7QUFDSDtBQUNKOztBQUVELFlBQUlJLE1BQU0sMEJBQWdCLEtBQUtS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aWxlIjoiaW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ3NzU3ludGF4RXJyb3IgZnJvbSAnLi9jc3Mtc3ludGF4LWVycm9yJztcbmltcG9ydCBQcmV2aW91c01hcCAgICBmcm9tICcuL3ByZXZpb3VzLW1hcCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5sZXQgc2VxdWVuY2UgPSAwO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHNvdXJjZSBDU1MuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHJvb3QgID0gcG9zdGNzcy5wYXJzZShjc3MsIHsgZnJvbTogZmlsZSB9KTtcbiAqIGNvbnN0IGlucHV0ID0gcm9vdC5zb3VyY2UuaW5wdXQ7XG4gKi9cbmNsYXNzIElucHV0IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjc3MgICAgLSBpbnB1dCBDU1Mgc291cmNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRzXSAtIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc30gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNzcywgb3B0cyA9IHsgfSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIGlucHV0IENTUyBzb3VyY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY29uc3QgaW5wdXQgPSBwb3N0Y3NzLnBhcnNlKCdhe30nLCB7IGZyb206IGZpbGUgfSkuaW5wdXQ7XG4gICAgICAgICAqIGlucHV0LmNzcyAvLz0+IFwiYXt9XCI7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNzcyA9IGNzcy50b1N0cmluZygpO1xuXG4gICAgICAgIGlmICggdGhpcy5jc3NbMF0gPT09ICdcXHVGRUZGJyB8fCB0aGlzLmNzc1swXSA9PT0gJ1xcdUZGRkUnICkge1xuICAgICAgICAgICAgdGhpcy5jc3MgPSB0aGlzLmNzcy5zbGljZSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggb3B0cy5mcm9tICkge1xuICAgICAgICAgICAgaWYgKCAvXlxcdys6XFwvXFwvLy50ZXN0KG9wdHMuZnJvbSkgKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBDU1Mgc291cmNlIGZpbGVcbiAgICAgICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZCB3aXRoIHRoZSBgZnJvbWAgb3B0aW9uLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZShjc3MsIHsgZnJvbTogJ2EuY3NzJyB9KTtcbiAgICAgICAgICAgICAgICAgKiByb290LnNvdXJjZS5pbnB1dC5maWxlIC8vPT4gJy9ob21lL2FpL2EuY3NzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsZSA9IG9wdHMuZnJvbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlID0gcGF0aC5yZXNvbHZlKG9wdHMuZnJvbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWFwID0gbmV3IFByZXZpb3VzTWFwKHRoaXMuY3NzLCBvcHRzKTtcbiAgICAgICAgaWYgKCBtYXAudGV4dCApIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7UHJldmlvdXNNYXB9IC0gVGhlIGlucHV0IHNvdXJjZSBtYXAgcGFzc2VkIGZyb21cbiAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIGEgY29tcGlsYXRpb24gc3RlcCBiZWZvcmUgUG9zdENTU1xuICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgKGZvciBleGFtcGxlLCBmcm9tIFNhc3MgY29tcGlsZXIpLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiByb290LnNvdXJjZS5pbnB1dC5tYXAuY29uc3VtZXIoKS5zb3VyY2VzIC8vPT4gWydhLnNhc3MnXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgICAgIGxldCBmaWxlID0gbWFwLmNvbnN1bWVyKCkuZmlsZTtcbiAgICAgICAgICAgIGlmICggIXRoaXMuZmlsZSAmJiBmaWxlICkgdGhpcy5maWxlID0gdGhpcy5tYXBSZXNvbHZlKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhdGhpcy5maWxlICkge1xuICAgICAgICAgICAgc2VxdWVuY2UgKz0gMTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSAtIFRoZSB1bmlxdWUgSUQgb2YgdGhlIENTUyBzb3VyY2UuIEl0IHdpbGwgYmVcbiAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAgICBjcmVhdGVkIGlmIGBmcm9tYCBvcHRpb24gaXMgbm90IHByb3ZpZGVkXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgKGJlY2F1c2UgUG9zdENTUyBkb2VzIG5vdCBrbm93IHRoZSBmaWxlIHBhdGgpLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZShjc3MpO1xuICAgICAgICAgICAgICogcm9vdC5zb3VyY2UuaW5wdXQuZmlsZSAvLz0+IHVuZGVmaW5lZFxuICAgICAgICAgICAgICogcm9vdC5zb3VyY2UuaW5wdXQuaWQgICAvLz0+IFwiPGlucHV0IGNzcyAxPlwiXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuaWQgICA9ICc8aW5wdXQgY3NzICcgKyBzZXF1ZW5jZSArICc+JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMubWFwICkgdGhpcy5tYXAuZmlsZSA9IHRoaXMuZnJvbTtcbiAgICB9XG5cbiAgICBlcnJvcihtZXNzYWdlLCBsaW5lLCBjb2x1bW4sIG9wdHMgPSB7IH0pIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgbGV0IG9yaWdpbiA9IHRoaXMub3JpZ2luKGxpbmUsIGNvbHVtbik7XG4gICAgICAgIGlmICggb3JpZ2luICkge1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IENzc1N5bnRheEVycm9yKG1lc3NhZ2UsIG9yaWdpbi5saW5lLCBvcmlnaW4uY29sdW1uLFxuICAgICAgICAgICAgICAgIG9yaWdpbi5zb3VyY2UsIG9yaWdpbi5maWxlLCBvcHRzLnBsdWdpbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgQ3NzU3ludGF4RXJyb3IobWVzc2FnZSwgbGluZSwgY29sdW1uLFxuICAgICAgICAgICAgICAgIHRoaXMuY3NzLCB0aGlzLmZpbGUsIG9wdHMucGx1Z2luKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5pbnB1dCA9IHsgbGluZSwgY29sdW1uLCBzb3VyY2U6IHRoaXMuY3NzIH07XG4gICAgICAgIGlmICggdGhpcy5maWxlICkgcmVzdWx0LmlucHV0LmZpbGUgPSB0aGlzLmZpbGU7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkcyB0aGUgaW5wdXQgc291cmNlIG1hcCBhbmQgcmV0dXJucyBhIHN5bWJvbCBwb3NpdGlvblxuICAgICAqIGluIHRoZSBpbnB1dCBzb3VyY2UgKGUuZy4sIGluIGEgU2FzcyBmaWxlIHRoYXQgd2FzIGNvbXBpbGVkXG4gICAgICogdG8gQ1NTIGJlZm9yZSBiZWluZyBwYXNzZWQgdG8gUG9zdENTUykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGluZSAgIC0gbGluZSBpbiBpbnB1dCBDU1NcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIC0gY29sdW1uIGluIGlucHV0IENTU1xuICAgICAqXG4gICAgICogQHJldHVybiB7ZmlsZVBvc2l0aW9ufSBwb3NpdGlvbiBpbiBpbnB1dCBzb3VyY2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC5zb3VyY2UuaW5wdXQub3JpZ2luKDEsIDEpIC8vPT4geyBmaWxlOiAnYS5jc3MnLCBsaW5lOiAzLCBjb2x1bW46IDEgfVxuICAgICAqL1xuICAgIG9yaWdpbihsaW5lLCBjb2x1bW4pIHtcbiAgICAgICAgaWYgKCAhdGhpcy5tYXAgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGxldCBjb25zdW1lciA9IHRoaXMubWFwLmNvbnN1bWVyKCk7XG5cbiAgICAgICAgbGV0IGZyb20gPSBjb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHsgbGluZSwgY29sdW1uIH0pO1xuICAgICAgICBpZiAoICFmcm9tLnNvdXJjZSApIHJldHVybiBmYWxzZTtcblxuICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZmlsZTogICB0aGlzLm1hcFJlc29sdmUoZnJvbS5zb3VyY2UpLFxuICAgICAgICAgICAgbGluZTogICBmcm9tLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW46IGZyb20uY29sdW1uXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHNvdXJjZSA9IGNvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3IoZnJvbS5zb3VyY2UpO1xuICAgICAgICBpZiAoIHNvdXJjZSApIHJlc3VsdC5zb3VyY2UgPSBzb3VyY2U7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBtYXBSZXNvbHZlKGZpbGUpIHtcbiAgICAgICAgaWYgKCAvXlxcdys6XFwvXFwvLy50ZXN0KGZpbGUpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHRoaXMubWFwLmNvbnN1bWVyKCkuc291cmNlUm9vdCB8fCAnLicsIGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIENTUyBzb3VyY2UgaWRlbnRpZmllci4gQ29udGFpbnMge0BsaW5rIElucHV0I2ZpbGV9IGlmIHRoZSB1c2VyXG4gICAgICogc2V0IHRoZSBgZnJvbWAgb3B0aW9uLCBvciB7QGxpbmsgSW5wdXQjaWR9IGlmIHRoZXkgZGlkIG5vdC5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZShjc3MsIHsgZnJvbTogJ2EuY3NzJyB9KTtcbiAgICAgKiByb290LnNvdXJjZS5pbnB1dC5mcm9tIC8vPT4gXCIvaG9tZS9haS9hLmNzc1wiXG4gICAgICpcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZShjc3MpO1xuICAgICAqIHJvb3Quc291cmNlLmlucHV0LmZyb20gLy89PiBcIjxpbnB1dCBjc3MgMT5cIlxuICAgICAqL1xuICAgIGdldCBmcm9tKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlIHx8IHRoaXMuaWQ7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0O1xuXG4vKipcbiAqIEB0eXBlZGVmICB7b2JqZWN0fSBmaWxlUG9zaXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBmaWxlICAgLSBwYXRoIHRvIGZpbGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsaW5lICAgLSBzb3VyY2UgbGluZSBpbiBmaWxlXG4gKiBAcHJvcGVydHkge251bWJlcn0gY29sdW1uIC0gc291cmNlIGNvbHVtbiBpbiBmaWxlXG4gKi9cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _jsBase = __webpack_require__(20);
	
	var _sourceMap = __webpack_require__(25);
	
	var _sourceMap2 = _interopRequireDefault(_sourceMap);
	
	var _path = __webpack_require__(36);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _fs = __webpack_require__(37);
	
	var _fs2 = _interopRequireDefault(_fs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Source map information from input CSS.
	 * For example, source map after Sass compiler.
	 *
	 * This class will automatically find source map in input CSS or in file system
	 * near input file (according `from` option).
	 *
	 * @example
	 * const root = postcss.parse(css, { from: 'a.sass.css' });
	 * root.input.map //=> PreviousMap
	 */
	var PreviousMap = function () {
	
	    /**
	     * @param {string}         css    - input CSS source
	     * @param {processOptions} [opts] - {@link Processor#process} options
	     */
	    function PreviousMap(css, opts) {
	        _classCallCheck(this, PreviousMap);
	
	        this.loadAnnotation(css);
	        /**
	         * @member {boolean} - Was source map inlined by data-uri to input CSS.
	         */
	        this.inline = this.startWith(this.annotation, 'data:');
	
	        var prev = opts.map ? opts.map.prev : undefined;
	        var text = this.loadMap(opts.from, prev);
	        if (text) this.text = text;
	    }
	
	    /**
	     * Create a instance of `SourceMapGenerator` class
	     * from the `source-map` library to work with source map information.
	     *
	     * It is lazy method, so it will create object only on first call
	     * and then it will use cache.
	     *
	     * @return {SourceMapGenerator} object with source map information
	     */
	
	
	    PreviousMap.prototype.consumer = function consumer() {
	        if (!this.consumerCache) {
	            this.consumerCache = new _sourceMap2.default.SourceMapConsumer(this.text);
	        }
	        return this.consumerCache;
	    };
	
	    /**
	     * Does source map contains `sourcesContent` with input source text.
	     *
	     * @return {boolean} Is `sourcesContent` present
	     */
	
	
	    PreviousMap.prototype.withContent = function withContent() {
	        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
	    };
	
	    PreviousMap.prototype.startWith = function startWith(string, start) {
	        if (!string) return false;
	        return string.substr(0, start.length) === start;
	    };
	
	    PreviousMap.prototype.loadAnnotation = function loadAnnotation(css) {
	        var match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
	        if (match) this.annotation = match[1].trim();
	    };
	
	    PreviousMap.prototype.decodeInline = function decodeInline(text) {
	        var utfd64 = 'data:application/json;charset=utf-8;base64,';
	        var utf64 = 'data:application/json;charset=utf8;base64,';
	        var b64 = 'data:application/json;base64,';
	        var uri = 'data:application/json,';
	
	        if (this.startWith(text, uri)) {
	            return decodeURIComponent(text.substr(uri.length));
	        } else if (this.startWith(text, b64)) {
	            return _jsBase.Base64.decode(text.substr(b64.length));
	        } else if (this.startWith(text, utf64)) {
	            return _jsBase.Base64.decode(text.substr(utf64.length));
	        } else if (this.startWith(text, utfd64)) {
	            return _jsBase.Base64.decode(text.substr(utfd64.length));
	        } else {
	            var encoding = text.match(/data:application\/json;([^,]+),/)[1];
	            throw new Error('Unsupported source map encoding ' + encoding);
	        }
	    };
	
	    PreviousMap.prototype.loadMap = function loadMap(file, prev) {
	        if (prev === false) return false;
	
	        if (prev) {
	            if (typeof prev === 'string') {
	                return prev;
	            } else if (typeof prev === 'function') {
	                var prevPath = prev(file);
	                if (prevPath && _fs2.default.existsSync && _fs2.default.existsSync(prevPath)) {
	                    return _fs2.default.readFileSync(prevPath, 'utf-8').toString().trim();
	                } else {
	                    throw new Error('Unable to load previous source map: ' + prevPath.toString());
	                }
	            } else if (prev instanceof _sourceMap2.default.SourceMapConsumer) {
	                return _sourceMap2.default.SourceMapGenerator.fromSourceMap(prev).toString();
	            } else if (prev instanceof _sourceMap2.default.SourceMapGenerator) {
	                return prev.toString();
	            } else if (this.isMap(prev)) {
	                return JSON.stringify(prev);
	            } else {
	                throw new Error('Unsupported previous source map format: ' + prev.toString());
	            }
	        } else if (this.inline) {
	            return this.decodeInline(this.annotation);
	        } else if (this.annotation) {
	            var map = this.annotation;
	            if (file) map = _path2.default.join(_path2.default.dirname(file), map);
	
	            this.root = _path2.default.dirname(map);
	            if (_fs2.default.existsSync && _fs2.default.existsSync(map)) {
	                return _fs2.default.readFileSync(map, 'utf-8').toString().trim();
	            } else {
	                return false;
	            }
	        }
	    };
	
	    PreviousMap.prototype.isMap = function isMap(map) {
	        if ((typeof map === 'undefined' ? 'undefined' : _typeof(map)) !== 'object') return false;
	        return typeof map.mappings === 'string' || typeof map._mappings === 'string';
	    };
	
	    return PreviousMap;
	}();
	
	exports.default = PreviousMap;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXZpb3VzLW1hcC5lczYiXSwibmFtZXMiOlsiUHJldmlvdXNNYXAiLCJjc3MiLCJvcHRzIiwibG9hZEFubm90YXRpb24iLCJpbmxpbmUiLCJzdGFydFdpdGgiLCJhbm5vdGF0aW9uIiwicHJldiIsIm1hcCIsInVuZGVmaW5lZCIsInRleHQiLCJsb2FkTWFwIiwiZnJvbSIsImNvbnN1bWVyIiwiY29uc3VtZXJDYWNoZSIsIlNvdXJjZU1hcENvbnN1bWVyIiwid2l0aENvbnRlbnQiLCJzb3VyY2VzQ29udGVudCIsImxlbmd0aCIsInN0cmluZyIsInN0YXJ0Iiwic3Vic3RyIiwibWF0Y2giLCJ0cmltIiwiZGVjb2RlSW5saW5lIiwidXRmZDY0IiwidXRmNjQiLCJiNjQiLCJ1cmkiLCJkZWNvZGVVUklDb21wb25lbnQiLCJkZWNvZGUiLCJlbmNvZGluZyIsIkVycm9yIiwiZmlsZSIsInByZXZQYXRoIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwiU291cmNlTWFwR2VuZXJhdG9yIiwiZnJvbVNvdXJjZU1hcCIsImlzTWFwIiwiSlNPTiIsInN0cmluZ2lmeSIsImpvaW4iLCJkaXJuYW1lIiwicm9vdCIsIm1hcHBpbmdzIiwiX21hcHBpbmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7O0lBV01BLFc7O0FBRUY7Ozs7QUFJQSx5QkFBWUMsR0FBWixFQUFpQkMsSUFBakIsRUFBdUI7QUFBQTs7QUFDbkIsYUFBS0MsY0FBTCxDQUFvQkYsR0FBcEI7QUFDQTs7O0FBR0EsYUFBS0csTUFBTCxHQUFjLEtBQUtDLFNBQUwsQ0FBZSxLQUFLQyxVQUFwQixFQUFnQyxPQUFoQyxDQUFkOztBQUVBLFlBQUlDLE9BQU9MLEtBQUtNLEdBQUwsR0FBV04sS0FBS00sR0FBTCxDQUFTRCxJQUFwQixHQUEyQkUsU0FBdEM7QUFDQSxZQUFJQyxPQUFPLEtBQUtDLE9BQUwsQ0FB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QTlCLEdBQXlDZCxJQUF6QyxFQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDSixLOzswQkFFRGlCLEssa0JBQU1oQyxHLEVBQUs7QUFDUCxZQUFLLFFBQU9BLEdBQVAseUNBQU9BLEdBQVAsT0FBZSxRQUFwQixFQUErQixPQUFPLEtBQVA7QUFDL0IsZUFBTyxPQUFPQSxJQUFJc0MsUUFBWCxLQUF3QixRQUF4QixJQUNBLE9BQU90QyxJQUFJdUMsU0FBWCxLQUF5QixRQURoQztBQUVILEs7Ozs7O2tCQUdVL0MsVyIsImZpbGUiOiJwcmV2aW91cy1tYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlNjQgfSBmcm9tICdqcy1iYXNlNjQnO1xuaW1wb3J0ICAgbW96aWxsYSAgZnJvbSAnc291cmNlLW1hcCc7XG5pbXBvcnQgICBwYXRoICAgICBmcm9tICdwYXRoJztcbmltcG9ydCAgIGZzICAgICAgIGZyb20gJ2ZzJztcblxuLyoqXG4gKiBTb3VyY2UgbWFwIGluZm9ybWF0aW9uIGZyb20gaW5wdXQgQ1NTLlxuICogRm9yIGV4YW1wbGUsIHNvdXJjZSBtYXAgYWZ0ZXIgU2FzcyBjb21waWxlci5cbiAqXG4gKiBUaGlzIGNsYXNzIHdpbGwgYXV0b21hdGljYWxseSBmaW5kIHNvdXJjZSBtYXAgaW4gaW5wdXQgQ1NTIG9yIGluIGZpbGUgc3lzdGVtXG4gKiBuZWFyIGlucHV0IGZpbGUgKGFjY29yZGluZyBgZnJvbWAgb3B0aW9uKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoY3NzLCB7IGZyb206ICdhLnNhc3MuY3NzJyB9KTtcbiAqIHJvb3QuaW5wdXQubWFwIC8vPT4gUHJldmlvdXNNYXBcbiAqL1xuY2xhc3MgUHJldmlvdXNNYXAge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgY3NzICAgIC0gaW5wdXQgQ1NTIHNvdXJjZVxuICAgICAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IFtvcHRzXSAtIHtAbGluayBQcm9jZXNzb3IjcHJvY2Vzc30gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNzcywgb3B0cykge1xuICAgICAgICB0aGlzLmxvYWRBbm5vdGF0aW9uKGNzcyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtib29sZWFufSAtIFdhcyBzb3VyY2UgbWFwIGlubGluZWQgYnkgZGF0YS11cmkgdG8gaW5wdXQgQ1NTLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbmxpbmUgPSB0aGlzLnN0YXJ0V2l0aCh0aGlzLmFubm90YXRpb24sICdkYXRhOicpO1xuXG4gICAgICAgIGxldCBwcmV2ID0gb3B0cy5tYXAgPyBvcHRzLm1hcC5wcmV2IDogdW5kZWZpbmVkO1xuICAgICAgICBsZXQgdGV4dCA9IHRoaXMubG9hZE1hcChvcHRzLmZyb20sIHByZXYpO1xuICAgICAgICBpZiAoIHRleHQgKSB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGluc3RhbmNlIG9mIGBTb3VyY2VNYXBHZW5lcmF0b3JgIGNsYXNzXG4gICAgICogZnJvbSB0aGUgYHNvdXJjZS1tYXBgIGxpYnJhcnkgdG8gd29yayB3aXRoIHNvdXJjZSBtYXAgaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBJdCBpcyBsYXp5IG1ldGhvZCwgc28gaXQgd2lsbCBjcmVhdGUgb2JqZWN0IG9ubHkgb24gZmlyc3QgY2FsbFxuICAgICAqIGFuZCB0aGVuIGl0IHdpbGwgdXNlIGNhY2hlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U291cmNlTWFwR2VuZXJhdG9yfSBvYmplY3Qgd2l0aCBzb3VyY2UgbWFwIGluZm9ybWF0aW9uXG4gICAgICovXG4gICAgY29uc3VtZXIoKSB7XG4gICAgICAgIGlmICggIXRoaXMuY29uc3VtZXJDYWNoZSApIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3VtZXJDYWNoZSA9IG5ldyBtb3ppbGxhLlNvdXJjZU1hcENvbnN1bWVyKHRoaXMudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZXJDYWNoZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHNvdXJjZSBtYXAgY29udGFpbnMgYHNvdXJjZXNDb250ZW50YCB3aXRoIGlucHV0IHNvdXJjZSB0ZXh0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgYHNvdXJjZXNDb250ZW50YCBwcmVzZW50XG4gICAgICovXG4gICAgd2l0aENvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmNvbnN1bWVyKCkuc291cmNlc0NvbnRlbnQgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3VtZXIoKS5zb3VyY2VzQ29udGVudC5sZW5ndGggPiAwKTtcbiAgICB9XG5cbiAgICBzdGFydFdpdGgoc3RyaW5nLCBzdGFydCkge1xuICAgICAgICBpZiAoICFzdHJpbmcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyKDAsIHN0YXJ0Lmxlbmd0aCkgPT09IHN0YXJ0O1xuICAgIH1cblxuICAgIGxvYWRBbm5vdGF0aW9uKGNzcykge1xuICAgICAgICBsZXQgbWF0Y2ggPSBjc3MubWF0Y2goL1xcL1xcKlxccyojIHNvdXJjZU1hcHBpbmdVUkw9KC4qKVxccypcXCpcXC8vKTtcbiAgICAgICAgaWYgKCBtYXRjaCApIHRoaXMuYW5ub3RhdGlvbiA9IG1hdGNoWzFdLnRyaW0oKTtcbiAgICB9XG5cbiAgICBkZWNvZGVJbmxpbmUodGV4dCkge1xuICAgICAgICBsZXQgdXRmZDY0ID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnO1xuICAgICAgICBsZXQgdXRmNjQgID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zjg7YmFzZTY0LCc7XG4gICAgICAgIGxldCBiNjQgICAgPSAnZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCwnO1xuICAgICAgICBsZXQgdXJpICAgID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbiwnO1xuXG4gICAgICAgIGlmICggdGhpcy5zdGFydFdpdGgodGV4dCwgdXJpKSApIHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoIHRleHQuc3Vic3RyKHVyaS5sZW5ndGgpICk7XG5cbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5zdGFydFdpdGgodGV4dCwgYjY0KSApIHtcbiAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKCB0ZXh0LnN1YnN0cihiNjQubGVuZ3RoKSApO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuc3RhcnRXaXRoKHRleHQsIHV0ZjY0KSApIHtcbiAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKCB0ZXh0LnN1YnN0cih1dGY2NC5sZW5ndGgpICk7XG5cbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5zdGFydFdpdGgodGV4dCwgdXRmZDY0KSApIHtcbiAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKCB0ZXh0LnN1YnN0cih1dGZkNjQubGVuZ3RoKSApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZW5jb2RpbmcgPSB0ZXh0Lm1hdGNoKC9kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjsoW14sXSspLC8pWzFdO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBzb3VyY2UgbWFwIGVuY29kaW5nICcgKyBlbmNvZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkTWFwKGZpbGUsIHByZXYpIHtcbiAgICAgICAgaWYgKCBwcmV2ID09PSBmYWxzZSApIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAoIHByZXYgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBwcmV2ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBwcmV2ID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIGxldCBwcmV2UGF0aCA9IHByZXYoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKCBwcmV2UGF0aCAmJiBmcy5leGlzdHNTeW5jICYmIGZzLmV4aXN0c1N5bmMocHJldlBhdGgpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHByZXZQYXRoLCAndXRmLTgnKS50b1N0cmluZygpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2FkIHByZXZpb3VzIHNvdXJjZSBtYXA6ICcgK1xuICAgICAgICAgICAgICAgICAgICBwcmV2UGF0aC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBwcmV2IGluc3RhbmNlb2YgbW96aWxsYS5Tb3VyY2VNYXBDb25zdW1lciApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW96aWxsYS5Tb3VyY2VNYXBHZW5lcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgLmZyb21Tb3VyY2VNYXAocHJldikudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHByZXYgaW5zdGFuY2VvZiBtb3ppbGxhLlNvdXJjZU1hcEdlbmVyYXRvciApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldi50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy5pc01hcChwcmV2KSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJldik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgcHJldmlvdXMgc291cmNlIG1hcCBmb3JtYXQ6ICcgK1xuICAgICAgICAgICAgICAgICAgICBwcmV2LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuaW5saW5lICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlSW5saW5lKHRoaXMuYW5ub3RhdGlvbik7XG5cbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5hbm5vdGF0aW9uICkge1xuICAgICAgICAgICAgbGV0IG1hcCA9IHRoaXMuYW5ub3RhdGlvbjtcbiAgICAgICAgICAgIGlmICggZmlsZSApIG1hcCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZSksIG1hcCk7XG5cbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHBhdGguZGlybmFtZShtYXApO1xuICAgICAgICAgICAgaWYgKCBmcy5leGlzdHNTeW5jICYmIGZzLmV4aXN0c1N5bmMobWFwKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKG1hcCwgJ3V0Zi04JykudG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzTWFwKG1hcCkge1xuICAgICAgICBpZiAoIHR5cGVvZiBtYXAgIT09ICdvYmplY3QnICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG1hcC5tYXBwaW5ncyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICAgIHR5cGVvZiBtYXAuX21hcHBpbmdzID09PSAnc3RyaW5nJztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByZXZpb3VzTWFwO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
	 *
	 *  Licensed under the MIT license.
	 *    http://opensource.org/licenses/mit-license
	 *
	 *  References:
	 *    http://en.wikipedia.org/wiki/Base64
	 */
	
	(function(global) {
	    'use strict';
	    // existing version for noConflict()
	    var _Base64 = global.Base64;
	    var version = "2.1.9";
	    // if node.js, we use Buffer
	    var buffer;
	    if (typeof module !== 'undefined' && module.exports) {
	        try {
	            buffer = __webpack_require__(21).Buffer;
	        } catch (err) {}
	    }
	    // constants
	    var b64chars
	        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	    var b64tab = function(bin) {
	        var t = {};
	        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
	        return t;
	    }(b64chars);
	    var fromCharCode = String.fromCharCode;
	    // encoder stuff
	    var cb_utob = function(c) {
	        if (c.length < 2) {
	            var cc = c.charCodeAt(0);
	            return cc < 0x80 ? c
	                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
	                                + fromCharCode(0x80 | (cc & 0x3f)))
	                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
	                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
	                   + fromCharCode(0x80 | ( cc         & 0x3f)));
	        } else {
	            var cc = 0x10000
	                + (c.charCodeAt(0) - 0xD800) * 0x400
	                + (c.charCodeAt(1) - 0xDC00);
	            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
	                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
	                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
	                    + fromCharCode(0x80 | ( cc         & 0x3f)));
	        }
	    };
	    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
	    var utob = function(u) {
	        return u.replace(re_utob, cb_utob);
	    };
	    var cb_encode = function(ccc) {
	        var padlen = [0, 2, 1][ccc.length % 3],
	        ord = ccc.charCodeAt(0) << 16
	            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
	            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
	        chars = [
	            b64chars.charAt( ord >>> 18),
	            b64chars.charAt((ord >>> 12) & 63),
	            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
	            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
	        ];
	        return chars.join('');
	    };
	    var btoa = global.btoa ? function(b) {
	        return global.btoa(b);
	    } : function(b) {
	        return b.replace(/[\s\S]{1,3}/g, cb_encode);
	    };
	    var _encode = buffer ? function (u) {
	        return (u.constructor === buffer.constructor ? u : new buffer(u))
	        .toString('base64')
	    }
	    : function (u) { return btoa(utob(u)) }
	    ;
	    var encode = function(u, urisafe) {
	        return !urisafe
	            ? _encode(String(u))
	            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
	                return m0 == '+' ? '-' : '_';
	            }).replace(/=/g, '');
	    };
	    var encodeURI = function(u) { return encode(u, true) };
	    // decoder stuff
	    var re_btou = new RegExp([
	        '[\xC0-\xDF][\x80-\xBF]',
	        '[\xE0-\xEF][\x80-\xBF]{2}',
	        '[\xF0-\xF7][\x80-\xBF]{3}'
	    ].join('|'), 'g');
	    var cb_btou = function(cccc) {
	        switch(cccc.length) {
	        case 4:
	            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
	                |    ((0x3f & cccc.charCodeAt(1)) << 12)
	                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
	                |     (0x3f & cccc.charCodeAt(3)),
	            offset = cp - 0x10000;
	            return (fromCharCode((offset  >>> 10) + 0xD800)
	                    + fromCharCode((offset & 0x3FF) + 0xDC00));
	        case 3:
	            return fromCharCode(
	                ((0x0f & cccc.charCodeAt(0)) << 12)
	                    | ((0x3f & cccc.charCodeAt(1)) << 6)
	                    |  (0x3f & cccc.charCodeAt(2))
	            );
	        default:
	            return  fromCharCode(
	                ((0x1f & cccc.charCodeAt(0)) << 6)
	                    |  (0x3f & cccc.charCodeAt(1))
	            );
	        }
	    };
	    var btou = function(b) {
	        return b.replace(re_btou, cb_btou);
	    };
	    var cb_decode = function(cccc) {
	        var len = cccc.length,
	        padlen = len % 4,
	        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
	            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
	            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
	            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
	        chars = [
	            fromCharCode( n >>> 16),
	            fromCharCode((n >>>  8) & 0xff),
	            fromCharCode( n         & 0xff)
	        ];
	        chars.length -= [0, 0, 2, 1][padlen];
	        return chars.join('');
	    };
	    var atob = global.atob ? function(a) {
	        return global.atob(a);
	    } : function(a){
	        return a.replace(/[\s\S]{1,4}/g, cb_decode);
	    };
	    var _decode = buffer ? function(a) {
	        return (a.constructor === buffer.constructor
	                ? a : new buffer(a, 'base64')).toString();
	    }
	    : function(a) { return btou(atob(a)) };
	    var decode = function(a){
	        return _decode(
	            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
	                .replace(/[^A-Za-z0-9\+\/]/g, '')
	        );
	    };
	    var noConflict = function() {
	        var Base64 = global.Base64;
	        global.Base64 = _Base64;
	        return Base64;
	    };
	    // export Base64
	    global.Base64 = {
	        VERSION: version,
	        atob: atob,
	        btoa: btoa,
	        fromBase64: decode,
	        toBase64: encode,
	        utob: utob,
	        encode: encode,
	        encodeURI: encodeURI,
	        btou: btou,
	        decode: decode,
	        noConflict: noConflict
	    };
	    // if ES5 is available, make Base64.extendString() available
	    if (typeof Object.defineProperty === 'function') {
	        var noEnum = function(v){
	            return {value:v,enumerable:false,writable:true,configurable:true};
	        };
	        global.Base64.extendString = function () {
	            Object.defineProperty(
	                String.prototype, 'fromBase64', noEnum(function () {
	                    return decode(this)
	                }));
	            Object.defineProperty(
	                String.prototype, 'toBase64', noEnum(function (urisafe) {
	                    return encode(this, urisafe)
	                }));
	            Object.defineProperty(
	                String.prototype, 'toBase64URI', noEnum(function () {
	                    return encode(this, true)
	                }));
	        };
	    }
	    // that's it!
	    if (global['Meteor']) {
	       Base64 = global.Base64; // for normal export in Meteor.js
	    }
	})(this);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(22)
	var ieee754 = __webpack_require__(23)
	var isArray = __webpack_require__(24)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21).Buffer, (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(26).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(32).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(35).SourceNode;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var base64VLQ = __webpack_require__(27);
	var util = __webpack_require__(29);
	var ArraySet = __webpack_require__(30).ArraySet;
	var MappingList = __webpack_require__(31).MappingList;
	
	/**
	 * An instance of the SourceMapGenerator represents a source map which is
	 * being built incrementally. You may pass an object with the following
	 * properties:
	 *
	 *   - file: The filename of the generated source.
	 *   - sourceRoot: A root for all relative URLs in this source map.
	 */
	function SourceMapGenerator(aArgs) {
	  if (!aArgs) {
	    aArgs = {};
	  }
	  this._file = util.getArg(aArgs, 'file', null);
	  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	  this._mappings = new MappingList();
	  this._sourcesContents = null;
	}
	
	SourceMapGenerator.prototype._version = 3;
	
	/**
	 * Creates a new SourceMapGenerator based on a SourceMapConsumer
	 *
	 * @param aSourceMapConsumer The SourceMap.
	 */
	SourceMapGenerator.fromSourceMap =
	  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	    var sourceRoot = aSourceMapConsumer.sourceRoot;
	    var generator = new SourceMapGenerator({
	      file: aSourceMapConsumer.file,
	      sourceRoot: sourceRoot
	    });
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      var newMapping = {
	        generated: {
	          line: mapping.generatedLine,
	          column: mapping.generatedColumn
	        }
	      };
	
	      if (mapping.source != null) {
	        newMapping.source = mapping.source;
	        if (sourceRoot != null) {
	          newMapping.source = util.relative(sourceRoot, newMapping.source);
	        }
	
	        newMapping.original = {
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        };
	
	        if (mapping.name != null) {
	          newMapping.name = mapping.name;
	        }
	      }
	
	      generator.addMapping(newMapping);
	    });
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        generator.setSourceContent(sourceFile, content);
	      }
	    });
	    return generator;
	  };
	
	/**
	 * Add a single mapping from original source line and column to the generated
	 * source's line and column for this source map being created. The mapping
	 * object should have the following properties:
	 *
	 *   - generated: An object with the generated line and column positions.
	 *   - original: An object with the original line and column positions.
	 *   - source: The original source file (relative to the sourceRoot).
	 *   - name: An optional original token name for this mapping.
	 */
	SourceMapGenerator.prototype.addMapping =
	  function SourceMapGenerator_addMapping(aArgs) {
	    var generated = util.getArg(aArgs, 'generated');
	    var original = util.getArg(aArgs, 'original', null);
	    var source = util.getArg(aArgs, 'source', null);
	    var name = util.getArg(aArgs, 'name', null);
	
	    if (!this._skipValidation) {
	      this._validateMapping(generated, original, source, name);
	    }
	
	    if (source != null) {
	      source = String(source);
	      if (!this._sources.has(source)) {
	        this._sources.add(source);
	      }
	    }
	
	    if (name != null) {
	      name = String(name);
	      if (!this._names.has(name)) {
	        this._names.add(name);
	      }
	    }
	
	    this._mappings.add({
	      generatedLine: generated.line,
	      generatedColumn: generated.column,
	      originalLine: original != null && original.line,
	      originalColumn: original != null && original.column,
	      source: source,
	      name: name
	    });
	  };
	
	/**
	 * Set the source content for a source file.
	 */
	SourceMapGenerator.prototype.setSourceContent =
	  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	    var source = aSourceFile;
	    if (this._sourceRoot != null) {
	      source = util.relative(this._sourceRoot, source);
	    }
	
	    if (aSourceContent != null) {
	      // Add the source content to the _sourcesContents map.
	      // Create a new _sourcesContents map if the property is null.
	      if (!this._sourcesContents) {
	        this._sourcesContents = Object.create(null);
	      }
	      this._sourcesContents[util.toSetString(source)] = aSourceContent;
	    } else if (this._sourcesContents) {
	      // Remove the source file from the _sourcesContents map.
	      // If the _sourcesContents map is empty, set the property to null.
	      delete this._sourcesContents[util.toSetString(source)];
	      if (Object.keys(this._sourcesContents).length === 0) {
	        this._sourcesContents = null;
	      }
	    }
	  };
	
	/**
	 * Applies the mappings of a sub-source-map for a specific source file to the
	 * source map being generated. Each mapping to the supplied source file is
	 * rewritten using the supplied source map. Note: The resolution for the
	 * resulting mappings is the minimium of this map and the supplied map.
	 *
	 * @param aSourceMapConsumer The source map to be applied.
	 * @param aSourceFile Optional. The filename of the source file.
	 *        If omitted, SourceMapConsumer's file property will be used.
	 * @param aSourceMapPath Optional. The dirname of the path to the source map
	 *        to be applied. If relative, it is relative to the SourceMapConsumer.
	 *        This parameter is needed when the two source maps aren't in the same
	 *        directory, and the source map to be applied contains relative source
	 *        paths. If so, those relative source paths need to be rewritten
	 *        relative to the SourceMapGenerator.
	 */
	SourceMapGenerator.prototype.applySourceMap =
	  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	    var sourceFile = aSourceFile;
	    // If aSourceFile is omitted, we will use the file property of the SourceMap
	    if (aSourceFile == null) {
	      if (aSourceMapConsumer.file == null) {
	        throw new Error(
	          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	          'or the source map\'s "file" property. Both were omitted.'
	        );
	      }
	      sourceFile = aSourceMapConsumer.file;
	    }
	    var sourceRoot = this._sourceRoot;
	    // Make "sourceFile" relative if an absolute Url is passed.
	    if (sourceRoot != null) {
	      sourceFile = util.relative(sourceRoot, sourceFile);
	    }
	    // Applying the SourceMap can add and remove items from the sources and
	    // the names array.
	    var newSources = new ArraySet();
	    var newNames = new ArraySet();
	
	    // Find mappings for the "sourceFile"
	    this._mappings.unsortedForEach(function (mapping) {
	      if (mapping.source === sourceFile && mapping.originalLine != null) {
	        // Check if it can be mapped by the source map, then update the mapping.
	        var original = aSourceMapConsumer.originalPositionFor({
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        });
	        if (original.source != null) {
	          // Copy mapping
	          mapping.source = original.source;
	          if (aSourceMapPath != null) {
	            mapping.source = util.join(aSourceMapPath, mapping.source)
	          }
	          if (sourceRoot != null) {
	            mapping.source = util.relative(sourceRoot, mapping.source);
	          }
	          mapping.originalLine = original.line;
	          mapping.originalColumn = original.column;
	          if (original.name != null) {
	            mapping.name = original.name;
	          }
	        }
	      }
	
	      var source = mapping.source;
	      if (source != null && !newSources.has(source)) {
	        newSources.add(source);
	      }
	
	      var name = mapping.name;
	      if (name != null && !newNames.has(name)) {
	        newNames.add(name);
	      }
	
	    }, this);
	    this._sources = newSources;
	    this._names = newNames;
	
	    // Copy sourcesContents of applied map.
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aSourceMapPath != null) {
	          sourceFile = util.join(aSourceMapPath, sourceFile);
	        }
	        if (sourceRoot != null) {
	          sourceFile = util.relative(sourceRoot, sourceFile);
	        }
	        this.setSourceContent(sourceFile, content);
	      }
	    }, this);
	  };
	
	/**
	 * A mapping can have one of the three levels of data:
	 *
	 *   1. Just the generated position.
	 *   2. The Generated position, original position, and original source.
	 *   3. Generated and original position, original source, as well as a name
	 *      token.
	 *
	 * To maintain consistency, we validate that any new mapping being added falls
	 * in to one of these categories.
	 */
	SourceMapGenerator.prototype._validateMapping =
	  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                              aName) {
	    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	        && aGenerated.line > 0 && aGenerated.column >= 0
	        && !aOriginal && !aSource && !aName) {
	      // Case 1.
	      return;
	    }
	    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	             && aGenerated.line > 0 && aGenerated.column >= 0
	             && aOriginal.line > 0 && aOriginal.column >= 0
	             && aSource) {
	      // Cases 2 and 3.
	      return;
	    }
	    else {
	      throw new Error('Invalid mapping: ' + JSON.stringify({
	        generated: aGenerated,
	        source: aSource,
	        original: aOriginal,
	        name: aName
	      }));
	    }
	  };
	
	/**
	 * Serialize the accumulated mappings in to the stream of base 64 VLQs
	 * specified by the source map format.
	 */
	SourceMapGenerator.prototype._serializeMappings =
	  function SourceMapGenerator_serializeMappings() {
	    var previousGeneratedColumn = 0;
	    var previousGeneratedLine = 1;
	    var previousOriginalColumn = 0;
	    var previousOriginalLine = 0;
	    var previousName = 0;
	    var previousSource = 0;
	    var result = '';
	    var next;
	    var mapping;
	    var nameIdx;
	    var sourceIdx;
	
	    var mappings = this._mappings.toArray();
	    for (var i = 0, len = mappings.length; i < len; i++) {
	      mapping = mappings[i];
	      next = ''
	
	      if (mapping.generatedLine !== previousGeneratedLine) {
	        previousGeneratedColumn = 0;
	        while (mapping.generatedLine !== previousGeneratedLine) {
	          next += ';';
	          previousGeneratedLine++;
	        }
	      }
	      else {
	        if (i > 0) {
	          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	            continue;
	          }
	          next += ',';
	        }
	      }
	
	      next += base64VLQ.encode(mapping.generatedColumn
	                                 - previousGeneratedColumn);
	      previousGeneratedColumn = mapping.generatedColumn;
	
	      if (mapping.source != null) {
	        sourceIdx = this._sources.indexOf(mapping.source);
	        next += base64VLQ.encode(sourceIdx - previousSource);
	        previousSource = sourceIdx;
	
	        // lines are stored 0-based in SourceMap spec version 3
	        next += base64VLQ.encode(mapping.originalLine - 1
	                                   - previousOriginalLine);
	        previousOriginalLine = mapping.originalLine - 1;
	
	        next += base64VLQ.encode(mapping.originalColumn
	                                   - previousOriginalColumn);
	        previousOriginalColumn = mapping.originalColumn;
	
	        if (mapping.name != null) {
	          nameIdx = this._names.indexOf(mapping.name);
	          next += base64VLQ.encode(nameIdx - previousName);
	          previousName = nameIdx;
	        }
	      }
	
	      result += next;
	    }
	
	    return result;
	  };
	
	SourceMapGenerator.prototype._generateSourcesContent =
	  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	    return aSources.map(function (source) {
	      if (!this._sourcesContents) {
	        return null;
	      }
	      if (aSourceRoot != null) {
	        source = util.relative(aSourceRoot, source);
	      }
	      var key = util.toSetString(source);
	      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	        ? this._sourcesContents[key]
	        : null;
	    }, this);
	  };
	
	/**
	 * Externalize the source map.
	 */
	SourceMapGenerator.prototype.toJSON =
	  function SourceMapGenerator_toJSON() {
	    var map = {
	      version: this._version,
	      sources: this._sources.toArray(),
	      names: this._names.toArray(),
	      mappings: this._serializeMappings()
	    };
	    if (this._file != null) {
	      map.file = this._file;
	    }
	    if (this._sourceRoot != null) {
	      map.sourceRoot = this._sourceRoot;
	    }
	    if (this._sourcesContents) {
	      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	    }
	
	    return map;
	  };
	
	/**
	 * Render the source map being generated to a string.
	 */
	SourceMapGenerator.prototype.toString =
	  function SourceMapGenerator_toString() {
	    return JSON.stringify(this.toJSON());
	  };
	
	exports.SourceMapGenerator = SourceMapGenerator;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	var base64 = __webpack_require__(28);
	
	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011
	
	var VLQ_BASE_SHIFT = 5;
	
	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	
	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	
	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	
	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}
	
	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}
	
	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	exports.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;
	
	  var vlq = toVLQSigned(aValue);
	
	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  } while (vlq > 0);
	
	  return encoded;
	};
	
	/**
	 * Decodes the next base 64 VLQ value from the given string and returns the
	 * value and the rest of the string via the out parameter.
	 */
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	  var strLen = aStr.length;
	  var result = 0;
	  var shift = 0;
	  var continuation, digit;
	
	  do {
	    if (aIndex >= strLen) {
	      throw new Error("Expected more digits in base 64 VLQ value.");
	    }
	
	    digit = base64.decode(aStr.charCodeAt(aIndex++));
	    if (digit === -1) {
	      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	    }
	
	    continuation = !!(digit & VLQ_CONTINUATION_BIT);
	    digit &= VLQ_BASE_MASK;
	    result = result + (digit << shift);
	    shift += VLQ_BASE_SHIFT;
	  } while (continuation);
	
	  aOutParam.value = fromVLQSigned(result);
	  aOutParam.rest = aIndex;
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
	
	/**
	 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	 */
	exports.encode = function (number) {
	  if (0 <= number && number < intToCharMap.length) {
	    return intToCharMap[number];
	  }
	  throw new TypeError("Must be between 0 and 63: " + number);
	};
	
	/**
	 * Decode a single base 64 character code digit to an integer. Returns -1 on
	 * failure.
	 */
	exports.decode = function (charCode) {
	  var bigA = 65;     // 'A'
	  var bigZ = 90;     // 'Z'
	
	  var littleA = 97;  // 'a'
	  var littleZ = 122; // 'z'
	
	  var zero = 48;     // '0'
	  var nine = 57;     // '9'
	
	  var plus = 43;     // '+'
	  var slash = 47;    // '/'
	
	  var littleOffset = 26;
	  var numberOffset = 52;
	
	  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	  if (bigA <= charCode && charCode <= bigZ) {
	    return (charCode - bigA);
	  }
	
	  // 26 - 51: abcdefghijklmnopqrstuvwxyz
	  if (littleA <= charCode && charCode <= littleZ) {
	    return (charCode - littleA + littleOffset);
	  }
	
	  // 52 - 61: 0123456789
	  if (zero <= charCode && charCode <= nine) {
	    return (charCode - zero + numberOffset);
	  }
	
	  // 62: +
	  if (charCode == plus) {
	    return 62;
	  }
	
	  // 63: /
	  if (charCode == slash) {
	    return 63;
	  }
	
	  // Invalid base64 digit.
	  return -1;
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	/**
	 * This is a helper function for getting values from parameter/options
	 * objects.
	 *
	 * @param args The object we are extracting values from
	 * @param name The name of the property we are getting.
	 * @param defaultValue An optional value to return if the property is missing
	 * from the object. If this is not specified and the property is missing, an
	 * error will be thrown.
	 */
	function getArg(aArgs, aName, aDefaultValue) {
	  if (aName in aArgs) {
	    return aArgs[aName];
	  } else if (arguments.length === 3) {
	    return aDefaultValue;
	  } else {
	    throw new Error('"' + aName + '" is a required argument.');
	  }
	}
	exports.getArg = getArg;
	
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	
	function urlParse(aUrl) {
	  var match = aUrl.match(urlRegexp);
	  if (!match) {
	    return null;
	  }
	  return {
	    scheme: match[1],
	    auth: match[2],
	    host: match[3],
	    port: match[4],
	    path: match[5]
	  };
	}
	exports.urlParse = urlParse;
	
	function urlGenerate(aParsedUrl) {
	  var url = '';
	  if (aParsedUrl.scheme) {
	    url += aParsedUrl.scheme + ':';
	  }
	  url += '//';
	  if (aParsedUrl.auth) {
	    url += aParsedUrl.auth + '@';
	  }
	  if (aParsedUrl.host) {
	    url += aParsedUrl.host;
	  }
	  if (aParsedUrl.port) {
	    url += ":" + aParsedUrl.port
	  }
	  if (aParsedUrl.path) {
	    url += aParsedUrl.path;
	  }
	  return url;
	}
	exports.urlGenerate = urlGenerate;
	
	/**
	 * Normalizes a path, or the path portion of a URL:
	 *
	 * - Replaces consecutive slashes with one slash.
	 * - Removes unnecessary '.' parts.
	 * - Removes unnecessary '<dir>/..' parts.
	 *
	 * Based on code in the Node.js 'path' core module.
	 *
	 * @param aPath The path or url to normalize.
	 */
	function normalize(aPath) {
	  var path = aPath;
	  var url = urlParse(aPath);
	  if (url) {
	    if (!url.path) {
	      return aPath;
	    }
	    path = url.path;
	  }
	  var isAbsolute = exports.isAbsolute(path);
	
	  var parts = path.split(/\/+/);
	  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	    part = parts[i];
	    if (part === '.') {
	      parts.splice(i, 1);
	    } else if (part === '..') {
	      up++;
	    } else if (up > 0) {
	      if (part === '') {
	        // The first part is blank if the path is absolute. Trying to go
	        // above the root is a no-op. Therefore we can remove all '..' parts
	        // directly after the root.
	        parts.splice(i + 1, up);
	        up = 0;
	      } else {
	        parts.splice(i, 2);
	        up--;
	      }
	    }
	  }
	  path = parts.join('/');
	
	  if (path === '') {
	    path = isAbsolute ? '/' : '.';
	  }
	
	  if (url) {
	    url.path = path;
	    return urlGenerate(url);
	  }
	  return path;
	}
	exports.normalize = normalize;
	
	/**
	 * Joins two paths/URLs.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be joined with the root.
	 *
	 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	 *   first.
	 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	 *   is updated with the result and aRoot is returned. Otherwise the result
	 *   is returned.
	 *   - If aPath is absolute, the result is aPath.
	 *   - Otherwise the two paths are joined with a slash.
	 * - Joining for example 'http://' and 'www.example.com' is also supported.
	 */
	function join(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	  if (aPath === "") {
	    aPath = ".";
	  }
	  var aPathUrl = urlParse(aPath);
	  var aRootUrl = urlParse(aRoot);
	  if (aRootUrl) {
	    aRoot = aRootUrl.path || '/';
	  }
	
	  // `join(foo, '//www.example.org')`
	  if (aPathUrl && !aPathUrl.scheme) {
	    if (aRootUrl) {
	      aPathUrl.scheme = aRootUrl.scheme;
	    }
	    return urlGenerate(aPathUrl);
	  }
	
	  if (aPathUrl || aPath.match(dataUrlRegexp)) {
	    return aPath;
	  }
	
	  // `join('http://', 'www.example.com')`
	  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	    aRootUrl.host = aPath;
	    return urlGenerate(aRootUrl);
	  }
	
	  var joined = aPath.charAt(0) === '/'
	    ? aPath
	    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
	
	  if (aRootUrl) {
	    aRootUrl.path = joined;
	    return urlGenerate(aRootUrl);
	  }
	  return joined;
	}
	exports.join = join;
	
	exports.isAbsolute = function (aPath) {
	  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
	};
	
	/**
	 * Make a path relative to a URL or another path.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be made relative to aRoot.
	 */
	function relative(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	
	  aRoot = aRoot.replace(/\/$/, '');
	
	  // It is possible for the path to be above the root. In this case, simply
	  // checking whether the root is a prefix of the path won't work. Instead, we
	  // need to remove components from the root one by one, until either we find
	  // a prefix that fits, or we run out of components to remove.
	  var level = 0;
	  while (aPath.indexOf(aRoot + '/') !== 0) {
	    var index = aRoot.lastIndexOf("/");
	    if (index < 0) {
	      return aPath;
	    }
	
	    // If the only part of the root that is left is the scheme (i.e. http://,
	    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	    // have exhausted all components, so the path is not relative to the root.
	    aRoot = aRoot.slice(0, index);
	    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	      return aPath;
	    }
	
	    ++level;
	  }
	
	  // Make sure we add a "../" for each component we removed from the root.
	  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	
	var supportsNullProto = (function () {
	  var obj = Object.create(null);
	  return !('__proto__' in obj);
	}());
	
	function identity (s) {
	  return s;
	}
	
	/**
	 * Because behavior goes wacky when you set `__proto__` on objects, we
	 * have to prefix all the strings in our set with an arbitrary character.
	 *
	 * See https://github.com/mozilla/source-map/pull/31 and
	 * https://github.com/mozilla/source-map/issues/30
	 *
	 * @param String aStr
	 */
	function toSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return '$' + aStr;
	  }
	
	  return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	
	function fromSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return aStr.slice(1);
	  }
	
	  return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	
	function isProtoString(s) {
	  if (!s) {
	    return false;
	  }
	
	  var length = s.length;
	
	  if (length < 9 /* "__proto__".length */) {
	    return false;
	  }
	
	  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 9) !== 95  /* '_' */) {
	    return false;
	  }
	
	  for (var i = length - 10; i >= 0; i--) {
	    if (s.charCodeAt(i) !== 36 /* '$' */) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	/**
	 * Comparator between two mappings where the original positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same original source/line/column, but different generated
	 * line and column the same. Useful when searching for a mapping with a
	 * stubbed out mapping.
	 */
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	
	/**
	 * Comparator between two mappings with deflated source and name indices where
	 * the generated positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same generated line and column, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(29);
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = util.toSetString(aStr);
	  var isDuplicate = has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    this._set[sStr] = idx;
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  var sStr = util.toSetString(aStr);
	  return has.call(this._set, sStr);
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  var sStr = util.toSetString(aStr);
	  if (has.call(this._set, sStr)) {
	    return this._set[sStr];
	  }
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(29);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(29);
	var binarySearch = __webpack_require__(33);
	var ArraySet = __webpack_require__(30).ArraySet;
	var base64VLQ = __webpack_require__(27);
	var quickSort = __webpack_require__(34).quickSort;
	
	function SourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap)
	    : new BasicSourceMapConsumer(sourceMap);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      if (source != null && sourceRoot != null) {
	        source = util.join(sourceRoot, source);
	      }
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is provided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: Optional. the column number in the original source.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    if (this.sourceRoot != null) {
	      needle.source = util.relative(this.sourceRoot, needle.source);
	    }
	    if (!this._sources.has(needle.source)) {
	      return [];
	    }
	    needle.source = this._sources.indexOf(needle.source);
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The only parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._sources.toArray().map(function (s) {
	      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	    }, this);
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (var index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          if (this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    if (this.sourceRoot != null) {
	      aSource = util.relative(this.sourceRoot, aSource);
	    }
	
	    if (this._sources.has(aSource)) {
	      return this.sourcesContent[this._sources.indexOf(aSource)];
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + aSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    if (this.sourceRoot != null) {
	      source = util.relative(this.sourceRoot, source);
	    }
	    if (!this._sources.has(source)) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	    source = this._sources.indexOf(source);
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The only parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        if (section.consumer.sourceRoot !== null) {
	          source = util.join(section.consumer.sourceRoot, source);
	        }
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = section.consumer._names.at(mapping.name);
	        this._names.add(name);
	        name = this._names.indexOf(name);
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(26).SourceMapGenerator;
	var util = __webpack_require__(29);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are removed from this array, by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var shiftNextLine = function() {
	      var lineContents = remainingLines.shift();
	      // The last line of a file might not have a newline.
	      var newLine = remainingLines.shift() || "";
	      return lineContents + newLine;
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[0];
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[0];
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLines.length > 0) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 37 */
/***/ function(module, exports) {



/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var defaultRaw = {
	    colon: ': ',
	    indent: '    ',
	    beforeDecl: '\n',
	    beforeRule: '\n',
	    beforeOpen: ' ',
	    beforeClose: '\n',
	    beforeComment: '\n',
	    after: '\n',
	    emptyBody: '',
	    commentLeft: ' ',
	    commentRight: ' '
	};
	
	function capitalize(str) {
	    return str[0].toUpperCase() + str.slice(1);
	}
	
	var Stringifier = function () {
	    function Stringifier(builder) {
	        _classCallCheck(this, Stringifier);
	
	        this.builder = builder;
	    }
	
	    Stringifier.prototype.stringify = function stringify(node, semicolon) {
	        this[node.type](node, semicolon);
	    };
	
	    Stringifier.prototype.root = function root(node) {
	        this.body(node);
	        if (node.raws.after) this.builder(node.raws.after);
	    };
	
	    Stringifier.prototype.comment = function comment(node) {
	        var left = this.raw(node, 'left', 'commentLeft');
	        var right = this.raw(node, 'right', 'commentRight');
	        this.builder('/*' + left + node.text + right + '*/', node);
	    };
	
	    Stringifier.prototype.decl = function decl(node, semicolon) {
	        var between = this.raw(node, 'between', 'colon');
	        var string = node.prop + between + this.rawValue(node, 'value');
	
	        if (node.important) {
	            string += node.raws.important || ' !important';
	        }
	
	        if (semicolon) string += ';';
	        this.builder(string, node);
	    };
	
	    Stringifier.prototype.rule = function rule(node) {
	        this.block(node, this.rawValue(node, 'selector'));
	    };
	
	    Stringifier.prototype.atrule = function atrule(node, semicolon) {
	        var name = '@' + node.name;
	        var params = node.params ? this.rawValue(node, 'params') : '';
	
	        if (typeof node.raws.afterName !== 'undefined') {
	            name += node.raws.afterName;
	        } else if (params) {
	            name += ' ';
	        }
	
	        if (node.nodes) {
	            this.block(node, name + params);
	        } else {
	            var end = (node.raws.between || '') + (semicolon ? ';' : '');
	            this.builder(name + params + end, node);
	        }
	    };
	
	    Stringifier.prototype.body = function body(node) {
	        var last = node.nodes.length - 1;
	        while (last > 0) {
	            if (node.nodes[last].type !== 'comment') break;
	            last -= 1;
	        }
	
	        var semicolon = this.raw(node, 'semicolon');
	        for (var i = 0; i < node.nodes.length; i++) {
	            var child = node.nodes[i];
	            var before = this.raw(child, 'before');
	            if (before) this.builder(before);
	            this.stringify(child, last !== i || semicolon);
	        }
	    };
	
	    Stringifier.prototype.block = function block(node, start) {
	        var between = this.raw(node, 'between', 'beforeOpen');
	        this.builder(start + between + '{', node, 'start');
	
	        var after = void 0;
	        if (node.nodes && node.nodes.length) {
	            this.body(node);
	            after = this.raw(node, 'after');
	        } else {
	            after = this.raw(node, 'after', 'emptyBody');
	        }
	
	        if (after) this.builder(after);
	        this.builder('}', node, 'end');
	    };
	
	    Stringifier.prototype.raw = function raw(node, own, detect) {
	        var value = void 0;
	        if (!detect) detect = own;
	
	        // Already had
	        if (own) {
	            value = node.raws[own];
	            if (typeof value !== 'undefined') return value;
	        }
	
	        var parent = node.parent;
	
	        // Hack for first rule in CSS
	        if (detect === 'before') {
	            if (!parent || parent.type === 'root' && parent.first === node) {
	                return '';
	            }
	        }
	
	        // Floating child without parent
	        if (!parent) return defaultRaw[detect];
	
	        // Detect style by other nodes
	        var root = node.root();
	        if (!root.rawCache) root.rawCache = {};
	        if (typeof root.rawCache[detect] !== 'undefined') {
	            return root.rawCache[detect];
	        }
	
	        if (detect === 'before' || detect === 'after') {
	            return this.beforeAfter(node, detect);
	        } else {
	            var method = 'raw' + capitalize(detect);
	            if (this[method]) {
	                value = this[method](root, node);
	            } else {
	                root.walk(function (i) {
	                    value = i.raws[own];
	                    if (typeof value !== 'undefined') return false;
	                });
	            }
	        }
	
	        if (typeof value === 'undefined') value = defaultRaw[detect];
	
	        root.rawCache[detect] = value;
	        return value;
	    };
	
	    Stringifier.prototype.rawSemicolon = function rawSemicolon(root) {
	        var value = void 0;
	        root.walk(function (i) {
	            if (i.nodes && i.nodes.length && i.last.type === 'decl') {
	                value = i.raws.semicolon;
	                if (typeof value !== 'undefined') return false;
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawEmptyBody = function rawEmptyBody(root) {
	        var value = void 0;
	        root.walk(function (i) {
	            if (i.nodes && i.nodes.length === 0) {
	                value = i.raws.after;
	                if (typeof value !== 'undefined') return false;
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawIndent = function rawIndent(root) {
	        if (root.raws.indent) return root.raws.indent;
	        var value = void 0;
	        root.walk(function (i) {
	            var p = i.parent;
	            if (p && p !== root && p.parent && p.parent === root) {
	                if (typeof i.raws.before !== 'undefined') {
	                    var parts = i.raws.before.split('\n');
	                    value = parts[parts.length - 1];
	                    value = value.replace(/[^\s]/g, '');
	                    return false;
	                }
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawBeforeComment = function rawBeforeComment(root, node) {
	        var value = void 0;
	        root.walkComments(function (i) {
	            if (typeof i.raws.before !== 'undefined') {
	                value = i.raws.before;
	                if (value.indexOf('\n') !== -1) {
	                    value = value.replace(/[^\n]+$/, '');
	                }
	                return false;
	            }
	        });
	        if (typeof value === 'undefined') {
	            value = this.raw(node, null, 'beforeDecl');
	        }
	        return value;
	    };
	
	    Stringifier.prototype.rawBeforeDecl = function rawBeforeDecl(root, node) {
	        var value = void 0;
	        root.walkDecls(function (i) {
	            if (typeof i.raws.before !== 'undefined') {
	                value = i.raws.before;
	                if (value.indexOf('\n') !== -1) {
	                    value = value.replace(/[^\n]+$/, '');
	                }
	                return false;
	            }
	        });
	        if (typeof value === 'undefined') {
	            value = this.raw(node, null, 'beforeRule');
	        }
	        return value;
	    };
	
	    Stringifier.prototype.rawBeforeRule = function rawBeforeRule(root) {
	        var value = void 0;
	        root.walk(function (i) {
	            if (i.nodes && (i.parent !== root || root.first !== i)) {
	                if (typeof i.raws.before !== 'undefined') {
	                    value = i.raws.before;
	                    if (value.indexOf('\n') !== -1) {
	                        value = value.replace(/[^\n]+$/, '');
	                    }
	                    return false;
	                }
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawBeforeClose = function rawBeforeClose(root) {
	        var value = void 0;
	        root.walk(function (i) {
	            if (i.nodes && i.nodes.length > 0) {
	                if (typeof i.raws.after !== 'undefined') {
	                    value = i.raws.after;
	                    if (value.indexOf('\n') !== -1) {
	                        value = value.replace(/[^\n]+$/, '');
	                    }
	                    return false;
	                }
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawBeforeOpen = function rawBeforeOpen(root) {
	        var value = void 0;
	        root.walk(function (i) {
	            if (i.type !== 'decl') {
	                value = i.raws.between;
	                if (typeof value !== 'undefined') return false;
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.rawColon = function rawColon(root) {
	        var value = void 0;
	        root.walkDecls(function (i) {
	            if (typeof i.raws.between !== 'undefined') {
	                value = i.raws.between.replace(/[^\s:]/g, '');
	                return false;
	            }
	        });
	        return value;
	    };
	
	    Stringifier.prototype.beforeAfter = function beforeAfter(node, detect) {
	        var value = void 0;
	        if (node.type === 'decl') {
	            value = this.raw(node, null, 'beforeDecl');
	        } else if (node.type === 'comment') {
	            value = this.raw(node, null, 'beforeComment');
	        } else if (detect === 'before') {
	            value = this.raw(node, null, 'beforeRule');
	        } else {
	            value = this.raw(node, null, 'beforeClose');
	        }
	
	        var buf = node.parent;
	        var depth = 0;
	        while (buf && buf.type !== 'root') {
	            depth += 1;
	            buf = buf.parent;
	        }
	
	        if (value.indexOf('\n') !== -1) {
	            var indent = this.raw(node, null, 'indent');
	            if (indent.length) {
	                for (var step = 0; step < depth; step++) {
	                    value += indent;
	                }
	            }
	        }
	
	        return value;
	    };
	
	    Stringifier.prototype.rawValue = function rawValue(node, prop) {
	        var value = node[prop];
	        var raw = node.raws[prop];
	        if (raw && raw.value === value) {
	            return raw.raw;
	        } else {
	            return value;
	        }
	    };
	
	    return Stringifier;
	}();
	
	exports.default = Stringifier;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ2lmaWVyLmVzNiJdLCJuYW1lcyI6WyJkZWZhdWx0UmF3IiwiY29sb24iLCJpbmRlbnQiLCJiZWZvcmVEZWNsIiwiYmVmb3JlUnVsZSIsImJlZm9yZU9wZW4iLCJiZWZvcmVDbG9zZSIsImJlZm9yZUNvbW1lbnQiLCJhZnRlciIsImVtcHR5Qm9keSIsImNvbW1lbnRMZWZ0IiwiY29tbWVudFJpZ2h0IiwiY2FwaXRhbGl6ZSIsInN0ciIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJTdHJpbmdpZmllciIsImJ1aWxkZXIiLCJzdHJpbmdpZnkiLCJub2RlIiwic2VtaWNvbG9uIiwidHlwZSIsInJvb3QiLCJib2R5IiwicmF3cyIsImNvbW1lbnQiLCJsZWZ0IiwicmF3IiwicmlnaHQiLCJ0ZXh0IiwiZGVjbCIsImJldHdlZW4iLCJzdHJpbmciLCJwcm9wIiwicmF3VmFsdWUiLCJpbXBvcnRhbnQiLCJydWxlIiwiYmxvY2siLCJhdHJ1bGUiLCJuYW1lIiwicGFyYW1zIiwiYWZ0ZXJOYW1lIiwibm9kZXMiLCJlbmQiLCJsYXN0IiwibGVuZ3RoIiwiaSIsImNoaWxkIiwiYmVmb3JlIiwic3RhcnQiLCJvd24iLCJkZXRlY3QiLCJ2YWx1ZSIsInBhcmVudCIsImZpcnN0IiwicmF3Q2FjaGUiLCJiZWZvcmVBZnRlciIsIm1ldGhvZCIsIndhbGsiLCJyYXdTZW1pY29sb24iLCJyYXdFbXB0eUJvZHkiLCJyYXdJbmRlbnQiLCJwIiwicGFydHMiLCJzcGxpdCIsInJlcGxhY2UiLCJyYXdCZWZvcmVDb21tZW50Iiwid2Fsa0NvbW1lbnRzIiwiaW5kZXhPZiIsInJhd0JlZm9yZURlY2wiLCJ3YWxrRGVjbHMiLCJyYXdCZWZvcmVSdWxlIiwicmF3QmVmb3JlQ2xvc2UiLCJyYXdCZWZvcmVPcGVuIiwicmF3Q29sb24iLCJidWYiLCJkZXB0aCIsInN0ZXAiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLGFBQWE7QUFDZkMsV0FBZSxJQURBO0FBRWZDLFlBQWUsTUFG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VDtBQUNBRCxrQkFBTUEsSUFBSXRCLE1BQVY7QUFDSDs7QUFFRCxZQUFLRCxNQUFNZ0IsT0FBTixDQUFjLElBQWQsTUFBd0IsQ0FBQyxDQUE5QixFQUFrQztBQUM5QixnQkFBSWxFLFNBQVMsS0FBS3lCLEdBQUwsQ0FBU1IsSUFBVCxFQUFlLElBQWYsRUFBcUIsUUFBckIsQ0FBYjtBQUNBLGdCQUFLakIsT0FBTzJDLE1BQVosRUFBcUI7QUFDakIscUJBQU0sSUFBSWdDLE9BQU8sQ0FBakIsRUFBb0JBLE9BQU9ELEtBQTNCLEVBQWtDQyxNQUFsQztBQUEyQ3pCLDZCQUFTbEQsTUFBVDtBQUEzQztBQUNIO0FBQ0o7O0FBRUQsZUFBT2tELEtBQVA7QUFDSCxLOzswQkFFRGxCLFEscUJBQVNmLEksRUFBTWMsSSxFQUFNO0FBQ2pCLFlBQUltQixRQUFRakMsS0FBS2MsSUFBTCxDQUFaO0FBQ0EsWUFBSU4sTUFBUVIsS0FBS0ssSUFBTCxDQUFVUyxJQUFWLENBQVo7QUFDQSxZQUFLTixPQUFPQSxJQUFJeUIsS0FBSixLQUFjQSxLQUExQixFQUFrQztBQUM5QixtQkFBT3pCLElBQUlBLEdBQVg7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBT3lCLEtBQVA7QUFDSDtBQUNKLEs7Ozs7O2tCQUlVcEMsVyIsImZpbGUiOiJzdHJpbmdpZmllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlZmF1bHRSYXcgPSB7XG4gICAgY29sb246ICAgICAgICAgJzogJyxcbiAgICBpbmRlbnQ6ICAgICAgICAnICAgICcsXG4gICAgYmVmb3JlRGVjbDogICAgJ1xcbicsXG4gICAgYmVmb3JlUnVsZTogICAgJ1xcbicsXG4gICAgYmVmb3JlT3BlbjogICAgJyAnLFxuICAgIGJlZm9yZUNsb3NlOiAgICdcXG4nLFxuICAgIGJlZm9yZUNvbW1lbnQ6ICdcXG4nLFxuICAgIGFmdGVyOiAgICAgICAgICdcXG4nLFxuICAgIGVtcHR5Qm9keTogICAgICcnLFxuICAgIGNvbW1lbnRMZWZ0OiAgICcgJyxcbiAgICBjb21tZW50UmlnaHQ6ICAnICdcbn07XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKSB7XG4gICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuXG5jbGFzcyBTdHJpbmdpZmllciB7XG5cbiAgICBjb25zdHJ1Y3RvcihidWlsZGVyKSB7XG4gICAgICAgIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgc3RyaW5naWZ5KG5vZGUsIHNlbWljb2xvbikge1xuICAgICAgICB0aGlzW25vZGUudHlwZV0obm9kZSwgc2VtaWNvbG9uKTtcbiAgICB9XG5cbiAgICByb290KG5vZGUpIHtcbiAgICAgICAgdGhpcy5ib2R5KG5vZGUpO1xuICAgICAgICBpZiAoIG5vZGUucmF3cy5hZnRlciApIHRoaXMuYnVpbGRlcihub2RlLnJhd3MuYWZ0ZXIpO1xuICAgIH1cblxuICAgIGNvbW1lbnQobm9kZSkge1xuICAgICAgICBsZXQgbGVmdCAgPSB0aGlzLnJhdyhub2RlLCAnbGVmdCcsICAnY29tbWVudExlZnQnKTtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5yYXcobm9kZSwgJ3JpZ2h0JywgJ2NvbW1lbnRSaWdodCcpO1xuICAgICAgICB0aGlzLmJ1aWxkZXIoJy8qJyArIGxlZnQgKyBub2RlLnRleHQgKyByaWdodCArICcqLycsIG5vZGUpO1xuICAgIH1cblxuICAgIGRlY2wobm9kZSwgc2VtaWNvbG9uKSB7XG4gICAgICAgIGxldCBiZXR3ZWVuID0gdGhpcy5yYXcobm9kZSwgJ2JldHdlZW4nLCAnY29sb24nKTtcbiAgICAgICAgbGV0IHN0cmluZyAgPSBub2RlLnByb3AgKyBiZXR3ZWVuICsgdGhpcy5yYXdWYWx1ZShub2RlLCAndmFsdWUnKTtcblxuICAgICAgICBpZiAoIG5vZGUuaW1wb3J0YW50ICkge1xuICAgICAgICAgICAgc3RyaW5nICs9IG5vZGUucmF3cy5pbXBvcnRhbnQgfHwgJyAhaW1wb3J0YW50JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggc2VtaWNvbG9uICkgc3RyaW5nICs9ICc7JztcbiAgICAgICAgdGhpcy5idWlsZGVyKHN0cmluZywgbm9kZSk7XG4gICAgfVxuXG4gICAgcnVsZShub2RlKSB7XG4gICAgICAgIHRoaXMuYmxvY2sobm9kZSwgdGhpcy5yYXdWYWx1ZShub2RlLCAnc2VsZWN0b3InKSk7XG4gICAgfVxuXG4gICAgYXRydWxlKG5vZGUsIHNlbWljb2xvbikge1xuICAgICAgICBsZXQgbmFtZSAgID0gJ0AnICsgbm9kZS5uYW1lO1xuICAgICAgICBsZXQgcGFyYW1zID0gbm9kZS5wYXJhbXMgPyB0aGlzLnJhd1ZhbHVlKG5vZGUsICdwYXJhbXMnKSA6ICcnO1xuXG4gICAgICAgIGlmICggdHlwZW9mIG5vZGUucmF3cy5hZnRlck5hbWUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgbmFtZSArPSBub2RlLnJhd3MuYWZ0ZXJOYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKCBwYXJhbXMgKSB7XG4gICAgICAgICAgICBuYW1lICs9ICcgJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggbm9kZS5ub2RlcyApIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2sobm9kZSwgbmFtZSArIHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZW5kID0gKG5vZGUucmF3cy5iZXR3ZWVuIHx8ICcnKSArIChzZW1pY29sb24gPyAnOycgOiAnJyk7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkZXIobmFtZSArIHBhcmFtcyArIGVuZCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBib2R5KG5vZGUpIHtcbiAgICAgICAgbGV0IGxhc3QgPSBub2RlLm5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlICggbGFzdCA+IDAgKSB7XG4gICAgICAgICAgICBpZiAoIG5vZGUubm9kZXNbbGFzdF0udHlwZSAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICBsYXN0IC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VtaWNvbG9uID0gdGhpcy5yYXcobm9kZSwgJ3NlbWljb2xvbicpO1xuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBub2RlLm5vZGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgbGV0IGNoaWxkICA9IG5vZGUubm9kZXNbaV07XG4gICAgICAgICAgICBsZXQgYmVmb3JlID0gdGhpcy5yYXcoY2hpbGQsICdiZWZvcmUnKTtcbiAgICAgICAgICAgIGlmICggYmVmb3JlICkgdGhpcy5idWlsZGVyKGJlZm9yZSk7XG4gICAgICAgICAgICB0aGlzLnN0cmluZ2lmeShjaGlsZCwgbGFzdCAhPT0gaSB8fCBzZW1pY29sb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmxvY2sobm9kZSwgc3RhcnQpIHtcbiAgICAgICAgbGV0IGJldHdlZW4gPSB0aGlzLnJhdyhub2RlLCAnYmV0d2VlbicsICdiZWZvcmVPcGVuJyk7XG4gICAgICAgIHRoaXMuYnVpbGRlcihzdGFydCArIGJldHdlZW4gKyAneycsIG5vZGUsICdzdGFydCcpO1xuXG4gICAgICAgIGxldCBhZnRlcjtcbiAgICAgICAgaWYgKCBub2RlLm5vZGVzICYmIG5vZGUubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5ib2R5KG5vZGUpO1xuICAgICAgICAgICAgYWZ0ZXIgPSB0aGlzLnJhdyhub2RlLCAnYWZ0ZXInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFmdGVyID0gdGhpcy5yYXcobm9kZSwgJ2FmdGVyJywgJ2VtcHR5Qm9keScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBhZnRlciApIHRoaXMuYnVpbGRlcihhZnRlcik7XG4gICAgICAgIHRoaXMuYnVpbGRlcignfScsIG5vZGUsICdlbmQnKTtcbiAgICB9XG5cbiAgICByYXcobm9kZSwgb3duLCBkZXRlY3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBpZiAoICFkZXRlY3QgKSBkZXRlY3QgPSBvd247XG5cbiAgICAgICAgLy8gQWxyZWFkeSBoYWRcbiAgICAgICAgaWYgKCBvd24gKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5vZGUucmF3c1tvd25dO1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgICAgIC8vIEhhY2sgZm9yIGZpcnN0IHJ1bGUgaW4gQ1NTXG4gICAgICAgIGlmICggZGV0ZWN0ID09PSAnYmVmb3JlJyApIHtcbiAgICAgICAgICAgIGlmICggIXBhcmVudCB8fCBwYXJlbnQudHlwZSA9PT0gJ3Jvb3QnICYmIHBhcmVudC5maXJzdCA9PT0gbm9kZSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGbG9hdGluZyBjaGlsZCB3aXRob3V0IHBhcmVudFxuICAgICAgICBpZiAoICFwYXJlbnQgKSByZXR1cm4gZGVmYXVsdFJhd1tkZXRlY3RdO1xuXG4gICAgICAgIC8vIERldGVjdCBzdHlsZSBieSBvdGhlciBub2Rlc1xuICAgICAgICBsZXQgcm9vdCA9IG5vZGUucm9vdCgpO1xuICAgICAgICBpZiAoICFyb290LnJhd0NhY2hlICkgcm9vdC5yYXdDYWNoZSA9IHsgfTtcbiAgICAgICAgaWYgKCB0eXBlb2Ygcm9vdC5yYXdDYWNoZVtkZXRlY3RdICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiByb290LnJhd0NhY2hlW2RldGVjdF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGRldGVjdCA9PT0gJ2JlZm9yZScgfHwgZGV0ZWN0ID09PSAnYWZ0ZXInICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmVmb3JlQWZ0ZXIobm9kZSwgZGV0ZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtZXRob2QgPSAncmF3JyArIGNhcGl0YWxpemUoZGV0ZWN0KTtcbiAgICAgICAgICAgIGlmICggdGhpc1ttZXRob2RdICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpc1ttZXRob2RdKHJvb3QsIG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3c1tvd25dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB2YWx1ZSA9IGRlZmF1bHRSYXdbZGV0ZWN0XTtcblxuICAgICAgICByb290LnJhd0NhY2hlW2RldGVjdF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd1NlbWljb2xvbihyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggaS5ub2RlcyAmJiBpLm5vZGVzLmxlbmd0aCAmJiBpLmxhc3QudHlwZSA9PT0gJ2RlY2wnICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLnNlbWljb2xvbjtcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3RW1wdHlCb2R5KHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCBpLm5vZGVzICYmIGkubm9kZXMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmFmdGVyO1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdJbmRlbnQocm9vdCkge1xuICAgICAgICBpZiAoIHJvb3QucmF3cy5pbmRlbnQgKSByZXR1cm4gcm9vdC5yYXdzLmluZGVudDtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgbGV0IHAgPSBpLnBhcmVudDtcbiAgICAgICAgICAgIGlmICggcCAmJiBwICE9PSByb290ICYmIHAucGFyZW50ICYmIHAucGFyZW50ID09PSByb290ICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFydHMgPSBpLnJhd3MuYmVmb3JlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bXlxcc10vZywgJycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJhd0JlZm9yZUNvbW1lbnQocm9vdCwgbm9kZSkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2Fsa0NvbW1lbnRzKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmJlZm9yZTtcbiAgICAgICAgICAgICAgICBpZiAoIHZhbHVlLmluZGV4T2YoJ1xcbicpICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9bXlxcbl0rJC8sICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlRGVjbCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdCZWZvcmVEZWNsKHJvb3QsIG5vZGUpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGtEZWNscyggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZWZvcmU7XG4gICAgICAgICAgICAgICAgaWYgKCB2YWx1ZS5pbmRleE9mKCdcXG4nKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2JlZm9yZVJ1bGUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3QmVmb3JlUnVsZShyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggaS5ub2RlcyAmJiAoaS5wYXJlbnQgIT09IHJvb3QgfHwgcm9vdC5maXJzdCAhPT0gaSkgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmJlZm9yZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZS5pbmRleE9mKCdcXG4nKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmF3QmVmb3JlQ2xvc2Uocm9vdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIHJvb3Qud2FsayggaSA9PiB7XG4gICAgICAgICAgICBpZiAoIGkubm9kZXMgJiYgaS5ub2Rlcy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5hZnRlciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmFmdGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHZhbHVlLmluZGV4T2YoJ1xcbicpICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdCZWZvcmVPcGVuKHJvb3QpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICByb290LndhbGsoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCBpLnR5cGUgIT09ICdkZWNsJyApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZXR3ZWVuO1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdDb2xvbihyb290KSB7XG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgcm9vdC53YWxrRGVjbHMoIGkgPT4ge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgaS5yYXdzLmJldHdlZW4gIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaS5yYXdzLmJldHdlZW4ucmVwbGFjZSgvW15cXHM6XS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGJlZm9yZUFmdGVyKG5vZGUsIGRldGVjdCkge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGlmICggbm9kZS50eXBlID09PSAnZGVjbCcgKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVEZWNsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIG5vZGUudHlwZSA9PT0gJ2NvbW1lbnQnICkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlQ29tbWVudCcpO1xuICAgICAgICB9IGVsc2UgaWYgKCBkZXRlY3QgPT09ICdiZWZvcmUnICkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlUnVsZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlQ2xvc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBidWYgICA9IG5vZGUucGFyZW50O1xuICAgICAgICBsZXQgZGVwdGggPSAwO1xuICAgICAgICB3aGlsZSAoIGJ1ZiAmJiBidWYudHlwZSAhPT0gJ3Jvb3QnICkge1xuICAgICAgICAgICAgZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGJ1ZiA9IGJ1Zi5wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHZhbHVlLmluZGV4T2YoJ1xcbicpICE9PSAtMSApIHtcbiAgICAgICAgICAgIGxldCBpbmRlbnQgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnaW5kZW50Jyk7XG4gICAgICAgICAgICBpZiAoIGluZGVudC5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgZm9yICggbGV0IHN0ZXAgPSAwOyBzdGVwIDwgZGVwdGg7IHN0ZXArKyApIHZhbHVlICs9IGluZGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByYXdWYWx1ZShub2RlLCBwcm9wKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG5vZGVbcHJvcF07XG4gICAgICAgIGxldCByYXcgICA9IG5vZGUucmF3c1twcm9wXTtcbiAgICAgICAgaWYgKCByYXcgJiYgcmF3LnZhbHVlID09PSB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiByYXcucmF3O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0cmluZ2lmaWVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = stringify;
	
	var _stringifier = __webpack_require__(38);
	
	var _stringifier2 = _interopRequireDefault(_stringifier);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function stringify(node, builder) {
	    var str = new _stringifier2.default(builder);
	    str.stringify(node);
	}
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ2lmeS5lczYiXSwibmFtZXMiOlsic3RyaW5naWZ5Iiwibm9kZSIsImJ1aWxkZXIiLCJzdHIiXSwibWFwcGluZ3MiOiI7OztrQkFFd0JBLFM7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTQSxTQUFULENBQW1CQyxJQUFuQixFQUF5QkMsT0FBekIsRUFBa0M7QUFDN0MsUUFBSUMsTUFBTSwwQkFBZ0JELE9BQWhCLENBQVY7QUFDQUMsUUFBSUgsU0FBSixDQUFjQyxJQUFkO0FBQ0giLCJmaWxlIjoic3RyaW5naWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0cmluZ2lmaWVyIGZyb20gJy4vc3RyaW5naWZpZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHJpbmdpZnkobm9kZSwgYnVpbGRlcikge1xuICAgIGxldCBzdHIgPSBuZXcgU3RyaW5naWZpZXIoYnVpbGRlcik7XG4gICAgc3RyLnN0cmluZ2lmeShub2RlKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _lazyResult = __webpack_require__(41);
	
	var _lazyResult2 = _interopRequireDefault(_lazyResult);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Contains plugins to process CSS. Create one `Processor` instance,
	 * initialize its plugins, and then use that instance on numerous CSS files.
	 *
	 * @example
	 * const processor = postcss([autoprefixer, precss]);
	 * processor.process(css1).then(result => console.log(result.css));
	 * processor.process(css2).then(result => console.log(result.css));
	 */
	var Processor = function () {
	
	  /**
	   * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
	   *        plugins. See {@link Processor#use} for plugin format.
	   */
	  function Processor() {
	    var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	    _classCallCheck(this, Processor);
	
	    /**
	     * @member {string} - Current PostCSS version.
	     *
	     * @example
	     * if ( result.processor.version.split('.')[0] !== '5' ) {
	     *   throw new Error('This plugin works only with PostCSS 5');
	     * }
	     */
	    this.version = '5.2.4';
	    /**
	     * @member {pluginFunction[]} - Plugins added to this processor.
	     *
	     * @example
	     * const processor = postcss([autoprefixer, precss]);
	     * processor.plugins.length //=> 2
	     */
	    this.plugins = this.normalize(plugins);
	  }
	
	  /**
	   * Adds a plugin to be used as a CSS processor.
	   *
	   * PostCSS plugin can be in 4 formats:
	   * * A plugin created by {@link postcss.plugin} method.
	   * * A function. PostCSS will pass the function a @{link Root}
	   *   as the first argument and current {@link Result} instance
	   *   as the second.
	   * * An object with a `postcss` method. PostCSS will use that method
	   *   as described in #2.
	   * * Another {@link Processor} instance. PostCSS will copy plugins
	   *   from that instance into this one.
	   *
	   * Plugins can also be added by passing them as arguments when creating
	   * a `postcss` instance (see [`postcss(plugins)`]).
	   *
	   * Asynchronous plugins should return a `Promise` instance.
	   *
	   * @param {Plugin|pluginFunction|Processor} plugin - PostCSS plugin
	   *                                                   or {@link Processor}
	   *                                                   with plugins
	   *
	   * @example
	   * const processor = postcss()
	   *   .use(autoprefixer)
	   *   .use(precss);
	   *
	   * @return {Processes} current processor to make methods chain
	   */
	
	
	  Processor.prototype.use = function use(plugin) {
	    this.plugins = this.plugins.concat(this.normalize([plugin]));
	    return this;
	  };
	
	  /**
	   * Parses source CSS and returns a {@link LazyResult} Promise proxy.
	   * Because some plugins can be asynchronous it doesn’t make
	   * any transformations. Transformations will be applied
	   * in the {@link LazyResult} methods.
	   *
	   * @param {string|toString|Result} css - String with input CSS or
	   *                                       any object with a `toString()`
	   *                                       method, like a Buffer.
	   *                                       Optionally, send a {@link Result}
	   *                                       instance and the processor will
	   *                                       take the {@link Root} from it.
	   * @param {processOptions} [opts]      - options
	   *
	   * @return {LazyResult} Promise proxy
	   *
	   * @example
	   * processor.process(css, { from: 'a.css', to: 'a.out.css' })
	   *   .then(result => {
	   *      console.log(result.css);
	   *   });
	   */
	
	
	  Processor.prototype.process = function process(css) {
	    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    return new _lazyResult2.default(this, css, opts);
	  };
	
	  Processor.prototype.normalize = function normalize(plugins) {
	    var normalized = [];
	    for (var _iterator = plugins, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;
	
	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }
	
	      var i = _ref;
	
	      if (i.postcss) i = i.postcss;
	
	      if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && Array.isArray(i.plugins)) {
	        normalized = normalized.concat(i.plugins);
	      } else if (typeof i === 'function') {
	        normalized.push(i);
	      } else {
	        throw new Error(i + ' is not a PostCSS plugin');
	      }
	    }
	    return normalized;
	  };
	
	  return Processor;
	}();
	
	exports.default = Processor;
	
	/**
	 * @callback builder
	 * @param {string} part          - part of generated CSS connected to this node
	 * @param {Node}   node          - AST node
	 * @param {"start"|"end"} [type] - node’s part type
	 */
	
	/**
	 * @callback parser
	 *
	 * @param {string|toString} css   - string with input CSS or any object
	 *                                  with toString() method, like a Buffer
	 * @param {processOptions} [opts] - options with only `from` and `map` keys
	 *
	 * @return {Root} PostCSS AST
	 */
	
	/**
	 * @callback stringifier
	 *
	 * @param {Node} node       - start node for stringifing. Usually {@link Root}.
	 * @param {builder} builder - function to concatenate CSS from node’s parts
	 *                            or generate string and source map
	 *
	 * @return {void}
	 */
	
	/**
	 * @typedef {object} syntax
	 * @property {parser} parse          - function to generate AST by string
	 * @property {stringifier} stringify - function to generate string by AST
	 */
	
	/**
	 * @typedef {object} toString
	 * @property {function} toString
	 */
	
	/**
	 * @callback pluginFunction
	 * @param {Root} root     - parsed input CSS
	 * @param {Result} result - result to set warnings or check other plugins
	 */
	
	/**
	 * @typedef {object} Plugin
	 * @property {function} postcss - PostCSS plugin function
	 */
	
	/**
	 * @typedef {object} processOptions
	 * @property {string} from             - the path of the CSS source file.
	 *                                       You should always set `from`,
	 *                                       because it is used in source map
	 *                                       generation and syntax error messages.
	 * @property {string} to               - the path where you’ll put the output
	 *                                       CSS file. You should always set `to`
	 *                                       to generate correct source maps.
	 * @property {parser} parser           - function to generate AST by string
	 * @property {stringifier} stringifier - class to generate string by AST
	 * @property {syntax} syntax           - object with `parse` and `stringify`
	 * @property {object} map              - source map options
	 * @property {boolean} map.inline                    - does source map should
	 *                                                     be embedded in the output
	 *                                                     CSS as a base64-encoded
	 *                                                     comment
	 * @property {string|object|false|function} map.prev - source map content
	 *                                                     from a previous
	 *                                                     processing step
	 *                                                     (for example, Sass).
	 *                                                     PostCSS will try to find
	 *                                                     previous map
	 *                                                     automatically, so you
	 *                                                     could disable it by
	 *                                                     `false` value.
	 * @property {boolean} map.sourcesContent            - does PostCSS should set
	 *                                                     the origin content to map
	 * @property {string|false} map.annotation           - does PostCSS should set
	 *                                                     annotation comment to map
	 * @property {string} map.from                       - override `from` in map’s
	 *                                                     `sources`
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2Nlc3Nvci5lczYiXSwibmFtZXMiOlsiUHJvY2Vzc29yIiwicGx1Z2lucyIsInZlcnNpb24iLCJub3JtYWxpemUiLCJ1c2UiLCJwbHVnaW4iLCJjb25jYXQiLCJwcm9jZXNzIiwiY3NzIiwib3B0cyIsIm5vcm1hbGl6ZWQiLCJpIiwicG9zdGNzcyIsIkFycmF5IiwiaXNBcnJheSIsInB1c2giLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7OztJQVNNQSxTOztBQUVGOzs7O0FBSUEsdUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUN0Qjs7Ozs7Ozs7QUFRQSxTQUFLQyxPQUFMLEdBQWUsT0FBZjtBQUNBOzs7Ozs7O0FBT0EsU0FBS0QsT0FBTCxHQUFlLEtBQUtFLFNBQUwsQ0FBZUYsT0FBZixDQUFmO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBNkJBRyxHLGdCQUFJQyxNLEVBQVE7QUFDUixTQUFLSixPQUFMLEdBQWUsS0FBS0EsT0FBTCxDQUFhSyxNQUFiLENBQW9CLEtBQUtILFNBQUwsQ0FBZSxDQUFDRSxNQUFELENBQWYsQ0FBcEIsQ0FBZjtBQUNBLFdBQU8sSUFBUDtBQUNILEc7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFzQkFFLE8sb0JBQVFDLEcsRUFBaUI7QUFBQSxRQUFaQyxJQUFZLHVFQUFMLEVBQUs7O0FBQ3JCLFdBQU8seUJBQWUsSUFBZixFQUFxQkQsR0FBckIsRUFBMEJDLElBQTFCLENBQVA7QUFDSCxHOztzQkFFRE4sUyxzQkFBVUYsTyxFQUFTO0FBQ2YsUUFBSVMsYUFBYSxFQUFqQjtBQUNBLHlCQUFlVCxPQUFmLGtIQUF5QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsVUFBZlUsQ0FBZTs7QUFDckIsVUFBS0EsRUFBRUMsT0FBUCxFQUFpQkQsSUFBSUEsRUFBRUMsT0FBTjs7QUFFakIsVUFBSyxRQUFPRCxDQUFQLHlDQUFPQSxDQUFQLE9BQWEsUUFBYixJQUF5QkUsTUFBTUMsT0FBTixDQUFjSCxFQUFFVixPQUFoQixDQUE5QixFQUF5RDtBQUNyRFMscUJBQWFBLFdBQVdKLE1BQVgsQ0FBa0JLLEVBQUVWLE9BQXBCLENBQWI7QUFDSCxPQUZELE1BRU8sSUFBSyxPQUFPVSxDQUFQLEtBQWEsVUFBbEIsRUFBK0I7QUFDbENELG1CQUFXSyxJQUFYLENBQWdCSixDQUFoQjtBQUNILE9BRk0sTUFFQTtBQUNILGNBQU0sSUFBSUssS0FBSixDQUFVTCxJQUFJLDBCQUFkLENBQU47QUFDSDtBQUNKO0FBQ0QsV0FBT0QsVUFBUDtBQUNILEc7Ozs7O2tCQUlVVixTOztBQUVmOzs7Ozs7O0FBT0E7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQTs7Ozs7QUFLQTs7Ozs7O0FBTUE7Ozs7O0FBS0EiLCJmaWxlIjoicHJvY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExhenlSZXN1bHQgIGZyb20gJy4vbGF6eS1yZXN1bHQnO1xuXG4vKipcbiAqIENvbnRhaW5zIHBsdWdpbnMgdG8gcHJvY2VzcyBDU1MuIENyZWF0ZSBvbmUgYFByb2Nlc3NvcmAgaW5zdGFuY2UsXG4gKiBpbml0aWFsaXplIGl0cyBwbHVnaW5zLCBhbmQgdGhlbiB1c2UgdGhhdCBpbnN0YW5jZSBvbiBudW1lcm91cyBDU1MgZmlsZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHByb2Nlc3NvciA9IHBvc3Rjc3MoW2F1dG9wcmVmaXhlciwgcHJlY3NzXSk7XG4gKiBwcm9jZXNzb3IucHJvY2Vzcyhjc3MxKS50aGVuKHJlc3VsdCA9PiBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKSk7XG4gKiBwcm9jZXNzb3IucHJvY2Vzcyhjc3MyKS50aGVuKHJlc3VsdCA9PiBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKSk7XG4gKi9cbmNsYXNzIFByb2Nlc3NvciB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxQbHVnaW58cGx1Z2luRnVuY3Rpb24+fFByb2Nlc3Nvcn0gcGx1Z2lucyAtIFBvc3RDU1NcbiAgICAgKiAgICAgICAgcGx1Z2lucy4gU2VlIHtAbGluayBQcm9jZXNzb3IjdXNlfSBmb3IgcGx1Z2luIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwbHVnaW5zID0gW10pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBDdXJyZW50IFBvc3RDU1MgdmVyc2lvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCByZXN1bHQucHJvY2Vzc29yLnZlcnNpb24uc3BsaXQoJy4nKVswXSAhPT0gJzUnICkge1xuICAgICAgICAgKiAgIHRocm93IG5ldyBFcnJvcignVGhpcyBwbHVnaW4gd29ya3Mgb25seSB3aXRoIFBvc3RDU1MgNScpO1xuICAgICAgICAgKiB9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZlcnNpb24gPSAnNS4yLjQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7cGx1Z2luRnVuY3Rpb25bXX0gLSBQbHVnaW5zIGFkZGVkIHRvIHRoaXMgcHJvY2Vzc29yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjb25zdCBwcm9jZXNzb3IgPSBwb3N0Y3NzKFthdXRvcHJlZml4ZXIsIHByZWNzc10pO1xuICAgICAgICAgKiBwcm9jZXNzb3IucGx1Z2lucy5sZW5ndGggLy89PiAyXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLm5vcm1hbGl6ZShwbHVnaW5zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgcGx1Z2luIHRvIGJlIHVzZWQgYXMgYSBDU1MgcHJvY2Vzc29yLlxuICAgICAqXG4gICAgICogUG9zdENTUyBwbHVnaW4gY2FuIGJlIGluIDQgZm9ybWF0czpcbiAgICAgKiAqIEEgcGx1Z2luIGNyZWF0ZWQgYnkge0BsaW5rIHBvc3Rjc3MucGx1Z2lufSBtZXRob2QuXG4gICAgICogKiBBIGZ1bmN0aW9uLiBQb3N0Q1NTIHdpbGwgcGFzcyB0aGUgZnVuY3Rpb24gYSBAe2xpbmsgUm9vdH1cbiAgICAgKiAgIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQgY3VycmVudCB7QGxpbmsgUmVzdWx0fSBpbnN0YW5jZVxuICAgICAqICAgYXMgdGhlIHNlY29uZC5cbiAgICAgKiAqIEFuIG9iamVjdCB3aXRoIGEgYHBvc3Rjc3NgIG1ldGhvZC4gUG9zdENTUyB3aWxsIHVzZSB0aGF0IG1ldGhvZFxuICAgICAqICAgYXMgZGVzY3JpYmVkIGluICMyLlxuICAgICAqICogQW5vdGhlciB7QGxpbmsgUHJvY2Vzc29yfSBpbnN0YW5jZS4gUG9zdENTUyB3aWxsIGNvcHkgcGx1Z2luc1xuICAgICAqICAgZnJvbSB0aGF0IGluc3RhbmNlIGludG8gdGhpcyBvbmUuXG4gICAgICpcbiAgICAgKiBQbHVnaW5zIGNhbiBhbHNvIGJlIGFkZGVkIGJ5IHBhc3NpbmcgdGhlbSBhcyBhcmd1bWVudHMgd2hlbiBjcmVhdGluZ1xuICAgICAqIGEgYHBvc3Rjc3NgIGluc3RhbmNlIChzZWUgW2Bwb3N0Y3NzKHBsdWdpbnMpYF0pLlxuICAgICAqXG4gICAgICogQXN5bmNocm9ub3VzIHBsdWdpbnMgc2hvdWxkIHJldHVybiBhIGBQcm9taXNlYCBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGx1Z2lufHBsdWdpbkZ1bmN0aW9ufFByb2Nlc3Nvcn0gcGx1Z2luIC0gUG9zdENTUyBwbHVnaW5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIHtAbGluayBQcm9jZXNzb3J9XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHBsdWdpbnNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgcHJvY2Vzc29yID0gcG9zdGNzcygpXG4gICAgICogICAudXNlKGF1dG9wcmVmaXhlcilcbiAgICAgKiAgIC51c2UocHJlY3NzKTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb2Nlc3Nlc30gY3VycmVudCBwcm9jZXNzb3IgdG8gbWFrZSBtZXRob2RzIGNoYWluXG4gICAgICovXG4gICAgdXNlKHBsdWdpbikge1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuY29uY2F0KHRoaXMubm9ybWFsaXplKFtwbHVnaW5dKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlcyBzb3VyY2UgQ1NTIGFuZCByZXR1cm5zIGEge0BsaW5rIExhenlSZXN1bHR9IFByb21pc2UgcHJveHkuXG4gICAgICogQmVjYXVzZSBzb21lIHBsdWdpbnMgY2FuIGJlIGFzeW5jaHJvbm91cyBpdCBkb2VzbuKAmXQgbWFrZVxuICAgICAqIGFueSB0cmFuc2Zvcm1hdGlvbnMuIFRyYW5zZm9ybWF0aW9ucyB3aWxsIGJlIGFwcGxpZWRcbiAgICAgKiBpbiB0aGUge0BsaW5rIExhenlSZXN1bHR9IG1ldGhvZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3x0b1N0cmluZ3xSZXN1bHR9IGNzcyAtIFN0cmluZyB3aXRoIGlucHV0IENTUyBvclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW55IG9iamVjdCB3aXRoIGEgYHRvU3RyaW5nKClgXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QsIGxpa2UgYSBCdWZmZXIuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPcHRpb25hbGx5LCBzZW5kIGEge0BsaW5rIFJlc3VsdH1cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlIGFuZCB0aGUgcHJvY2Vzc29yIHdpbGxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2UgdGhlIHtAbGluayBSb290fSBmcm9tIGl0LlxuICAgICAqIEBwYXJhbSB7cHJvY2Vzc09wdGlvbnN9IFtvcHRzXSAgICAgIC0gb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybiB7TGF6eVJlc3VsdH0gUHJvbWlzZSBwcm94eVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwcm9jZXNzb3IucHJvY2Vzcyhjc3MsIHsgZnJvbTogJ2EuY3NzJywgdG86ICdhLm91dC5jc3MnIH0pXG4gICAgICogICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAqICAgICAgY29uc29sZS5sb2cocmVzdWx0LmNzcyk7XG4gICAgICogICB9KTtcbiAgICAgKi9cbiAgICBwcm9jZXNzKGNzcywgb3B0cyA9IHsgfSkge1xuICAgICAgICByZXR1cm4gbmV3IExhenlSZXN1bHQodGhpcywgY3NzLCBvcHRzKTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUocGx1Z2lucykge1xuICAgICAgICBsZXQgbm9ybWFsaXplZCA9IFtdO1xuICAgICAgICBmb3IgKCBsZXQgaSBvZiBwbHVnaW5zICkge1xuICAgICAgICAgICAgaWYgKCBpLnBvc3Rjc3MgKSBpID0gaS5wb3N0Y3NzO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBpID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KGkucGx1Z2lucykgKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZWQuY29uY2F0KGkucGx1Z2lucyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgaSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkLnB1c2goaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihpICsgJyBpcyBub3QgYSBQb3N0Q1NTIHBsdWdpbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9jZXNzb3I7XG5cbi8qKlxuICogQGNhbGxiYWNrIGJ1aWxkZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJ0ICAgICAgICAgIC0gcGFydCBvZiBnZW5lcmF0ZWQgQ1NTIGNvbm5lY3RlZCB0byB0aGlzIG5vZGVcbiAqIEBwYXJhbSB7Tm9kZX0gICBub2RlICAgICAgICAgIC0gQVNUIG5vZGVcbiAqIEBwYXJhbSB7XCJzdGFydFwifFwiZW5kXCJ9IFt0eXBlXSAtIG5vZGXigJlzIHBhcnQgdHlwZVxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHBhcnNlclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHRvU3RyaW5nfSBjc3MgICAtIHN0cmluZyB3aXRoIGlucHV0IENTUyBvciBhbnkgb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRvU3RyaW5nKCkgbWV0aG9kLCBsaWtlIGEgQnVmZmVyXG4gKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBbb3B0c10gLSBvcHRpb25zIHdpdGggb25seSBgZnJvbWAgYW5kIGBtYXBgIGtleXNcbiAqXG4gKiBAcmV0dXJuIHtSb290fSBQb3N0Q1NTIEFTVFxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHN0cmluZ2lmaWVyXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlICAgICAgIC0gc3RhcnQgbm9kZSBmb3Igc3RyaW5naWZpbmcuIFVzdWFsbHkge0BsaW5rIFJvb3R9LlxuICogQHBhcmFtIHtidWlsZGVyfSBidWlsZGVyIC0gZnVuY3Rpb24gdG8gY29uY2F0ZW5hdGUgQ1NTIGZyb20gbm9kZeKAmXMgcGFydHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIGdlbmVyYXRlIHN0cmluZyBhbmQgc291cmNlIG1hcFxuICpcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBzeW50YXhcbiAqIEBwcm9wZXJ0eSB7cGFyc2VyfSBwYXJzZSAgICAgICAgICAtIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIEFTVCBieSBzdHJpbmdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5naWZpZXJ9IHN0cmluZ2lmeSAtIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHN0cmluZyBieSBBU1RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IHRvU3RyaW5nXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSB0b1N0cmluZ1xuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHBsdWdpbkZ1bmN0aW9uXG4gKiBAcGFyYW0ge1Jvb3R9IHJvb3QgICAgIC0gcGFyc2VkIGlucHV0IENTU1xuICogQHBhcmFtIHtSZXN1bHR9IHJlc3VsdCAtIHJlc3VsdCB0byBzZXQgd2FybmluZ3Mgb3IgY2hlY2sgb3RoZXIgcGx1Z2luc1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gUGx1Z2luXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBwb3N0Y3NzIC0gUG9zdENTUyBwbHVnaW4gZnVuY3Rpb25cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IHByb2Nlc3NPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZnJvbSAgICAgICAgICAgICAtIHRoZSBwYXRoIG9mIHRoZSBDU1Mgc291cmNlIGZpbGUuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlvdSBzaG91bGQgYWx3YXlzIHNldCBgZnJvbWAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlY2F1c2UgaXQgaXMgdXNlZCBpbiBzb3VyY2UgbWFwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb24gYW5kIHN5bnRheCBlcnJvciBtZXNzYWdlcy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0byAgICAgICAgICAgICAgIC0gdGhlIHBhdGggd2hlcmUgeW914oCZbGwgcHV0IHRoZSBvdXRwdXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTIGZpbGUuIFlvdSBzaG91bGQgYWx3YXlzIHNldCBgdG9gXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGdlbmVyYXRlIGNvcnJlY3Qgc291cmNlIG1hcHMuXG4gKiBAcHJvcGVydHkge3BhcnNlcn0gcGFyc2VyICAgICAgICAgICAtIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIEFTVCBieSBzdHJpbmdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5naWZpZXJ9IHN0cmluZ2lmaWVyIC0gY2xhc3MgdG8gZ2VuZXJhdGUgc3RyaW5nIGJ5IEFTVFxuICogQHByb3BlcnR5IHtzeW50YXh9IHN5bnRheCAgICAgICAgICAgLSBvYmplY3Qgd2l0aCBgcGFyc2VgIGFuZCBgc3RyaW5naWZ5YFxuICogQHByb3BlcnR5IHtvYmplY3R9IG1hcCAgICAgICAgICAgICAgLSBzb3VyY2UgbWFwIG9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbWFwLmlubGluZSAgICAgICAgICAgICAgICAgICAgLSBkb2VzIHNvdXJjZSBtYXAgc2hvdWxkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgZW1iZWRkZWQgaW4gdGhlIG91dHB1dFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTUyBhcyBhIGJhc2U2NC1lbmNvZGVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudFxuICogQHByb3BlcnR5IHtzdHJpbmd8b2JqZWN0fGZhbHNlfGZ1bmN0aW9ufSBtYXAucHJldiAtIHNvdXJjZSBtYXAgY29udGVudFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gYSBwcmV2aW91c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3Npbmcgc3RlcFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmb3IgZXhhbXBsZSwgU2FzcykuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUG9zdENTUyB3aWxsIHRyeSB0byBmaW5kXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMgbWFwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b21hdGljYWxseSwgc28geW91XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bGQgZGlzYWJsZSBpdCBieVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBmYWxzZWAgdmFsdWUuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG1hcC5zb3VyY2VzQ29udGVudCAgICAgICAgICAgIC0gZG9lcyBQb3N0Q1NTIHNob3VsZCBzZXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgb3JpZ2luIGNvbnRlbnQgdG8gbWFwXG4gKiBAcHJvcGVydHkge3N0cmluZ3xmYWxzZX0gbWFwLmFubm90YXRpb24gICAgICAgICAgIC0gZG9lcyBQb3N0Q1NTIHNob3VsZCBzZXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uIGNvbW1lbnQgdG8gbWFwXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWFwLmZyb20gICAgICAgICAgICAgICAgICAgICAgIC0gb3ZlcnJpZGUgYGZyb21gIGluIG1hcOKAmXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgc291cmNlc2BcbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _mapGenerator = __webpack_require__(42);
	
	var _mapGenerator2 = _interopRequireDefault(_mapGenerator);
	
	var _stringify2 = __webpack_require__(39);
	
	var _stringify3 = _interopRequireDefault(_stringify2);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	var _result = __webpack_require__(43);
	
	var _result2 = _interopRequireDefault(_result);
	
	var _parse = __webpack_require__(45);
	
	var _parse2 = _interopRequireDefault(_parse);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function isPromise(obj) {
	    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.then === 'function';
	}
	
	/**
	 * A Promise proxy for the result of PostCSS transformations.
	 *
	 * A `LazyResult` instance is returned by {@link Processor#process}.
	 *
	 * @example
	 * const lazy = postcss([cssnext]).process(css);
	 */
	
	var LazyResult = function () {
	    function LazyResult(processor, css, opts) {
	        _classCallCheck(this, LazyResult);
	
	        this.stringified = false;
	        this.processed = false;
	
	        var root = void 0;
	        if ((typeof css === 'undefined' ? 'undefined' : _typeof(css)) === 'object' && css.type === 'root') {
	            root = css;
	        } else if (css instanceof LazyResult || css instanceof _result2.default) {
	            root = css.root;
	            if (css.map) {
	                if (typeof opts.map === 'undefined') opts.map = {};
	                if (!opts.map.inline) opts.map.inline = false;
	                opts.map.prev = css.map;
	            }
	        } else {
	            var parser = _parse2.default;
	            if (opts.syntax) parser = opts.syntax.parse;
	            if (opts.parser) parser = opts.parser;
	            if (parser.parse) parser = parser.parse;
	
	            try {
	                root = parser(css, opts);
	            } catch (error) {
	                this.error = error;
	            }
	        }
	
	        this.result = new _result2.default(processor, root, opts);
	    }
	
	    /**
	     * Returns a {@link Processor} instance, which will be used
	     * for CSS transformations.
	     * @type {Processor}
	     */
	
	
	    /**
	     * Processes input CSS through synchronous plugins
	     * and calls {@link Result#warnings()}.
	     *
	     * @return {Warning[]} warnings from plugins
	     */
	    LazyResult.prototype.warnings = function warnings() {
	        return this.sync().warnings();
	    };
	
	    /**
	     * Alias for the {@link LazyResult#css} property.
	     *
	     * @example
	     * lazy + '' === lazy.css;
	     *
	     * @return {string} output CSS
	     */
	
	
	    LazyResult.prototype.toString = function toString() {
	        return this.css;
	    };
	
	    /**
	     * Processes input CSS through synchronous and asynchronous plugins
	     * and calls `onFulfilled` with a Result instance. If a plugin throws
	     * an error, the `onRejected` callback will be executed.
	     *
	     * It implements standard Promise API.
	     *
	     * @param {onFulfilled} onFulfilled - callback will be executed
	     *                                    when all plugins will finish work
	     * @param {onRejected}  onRejected  - callback will be executed on any error
	     *
	     * @return {Promise} Promise API to make queue
	     *
	     * @example
	     * postcss([cssnext]).process(css).then(result => {
	     *   console.log(result.css);
	     * });
	     */
	
	
	    LazyResult.prototype.then = function then(onFulfilled, onRejected) {
	        return this.async().then(onFulfilled, onRejected);
	    };
	
	    /**
	     * Processes input CSS through synchronous and asynchronous plugins
	     * and calls onRejected for each error thrown in any plugin.
	     *
	     * It implements standard Promise API.
	     *
	     * @param {onRejected} onRejected - callback will be executed on any error
	     *
	     * @return {Promise} Promise API to make queue
	     *
	     * @example
	     * postcss([cssnext]).process(css).then(result => {
	     *   console.log(result.css);
	     * }).catch(error => {
	     *   console.error(error);
	     * });
	     */
	
	
	    LazyResult.prototype.catch = function _catch(onRejected) {
	        return this.async().catch(onRejected);
	    };
	
	    LazyResult.prototype.handleError = function handleError(error, plugin) {
	        try {
	            this.error = error;
	            if (error.name === 'CssSyntaxError' && !error.plugin) {
	                error.plugin = plugin.postcssPlugin;
	                error.setMessage();
	            } else if (plugin.postcssVersion) {
	                var pluginName = plugin.postcssPlugin;
	                var pluginVer = plugin.postcssVersion;
	                var runtimeVer = this.result.processor.version;
	                var a = pluginVer.split('.');
	                var b = runtimeVer.split('.');
	
	                if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
	                    (0, _warnOnce2.default)('Your current PostCSS version ' + 'is ' + runtimeVer + ', but ' + pluginName + ' ' + 'uses ' + pluginVer + '. Perhaps this is ' + 'the source of the error below.');
	                }
	            }
	        } catch (err) {
	            if (console && console.error) console.error(err);
	        }
	    };
	
	    LazyResult.prototype.asyncTick = function asyncTick(resolve, reject) {
	        var _this = this;
	
	        if (this.plugin >= this.processor.plugins.length) {
	            this.processed = true;
	            return resolve();
	        }
	
	        try {
	            (function () {
	                var plugin = _this.processor.plugins[_this.plugin];
	                var promise = _this.run(plugin);
	                _this.plugin += 1;
	
	                if (isPromise(promise)) {
	                    promise.then(function () {
	                        _this.asyncTick(resolve, reject);
	                    }).catch(function (error) {
	                        _this.handleError(error, plugin);
	                        _this.processed = true;
	                        reject(error);
	                    });
	                } else {
	                    _this.asyncTick(resolve, reject);
	                }
	            })();
	        } catch (error) {
	            this.processed = true;
	            reject(error);
	        }
	    };
	
	    LazyResult.prototype.async = function async() {
	        var _this2 = this;
	
	        if (this.processed) {
	            return new Promise(function (resolve, reject) {
	                if (_this2.error) {
	                    reject(_this2.error);
	                } else {
	                    resolve(_this2.stringify());
	                }
	            });
	        }
	        if (this.processing) {
	            return this.processing;
	        }
	
	        this.processing = new Promise(function (resolve, reject) {
	            if (_this2.error) return reject(_this2.error);
	            _this2.plugin = 0;
	            _this2.asyncTick(resolve, reject);
	        }).then(function () {
	            _this2.processed = true;
	            return _this2.stringify();
	        });
	
	        return this.processing;
	    };
	
	    LazyResult.prototype.sync = function sync() {
	        if (this.processed) return this.result;
	        this.processed = true;
	
	        if (this.processing) {
	            throw new Error('Use process(css).then(cb) to work with async plugins');
	        }
	
	        if (this.error) throw this.error;
	
	        for (var _iterator = this.result.processor.plugins, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }
	
	            var plugin = _ref;
	
	            var promise = this.run(plugin);
	            if (isPromise(promise)) {
	                throw new Error('Use process(css).then(cb) to work with async plugins');
	            }
	        }
	
	        return this.result;
	    };
	
	    LazyResult.prototype.run = function run(plugin) {
	        this.result.lastPlugin = plugin;
	
	        try {
	            return plugin(this.result.root, this.result);
	        } catch (error) {
	            this.handleError(error, plugin);
	            throw error;
	        }
	    };
	
	    LazyResult.prototype.stringify = function stringify() {
	        if (this.stringified) return this.result;
	        this.stringified = true;
	
	        this.sync();
	
	        var opts = this.result.opts;
	        var str = _stringify3.default;
	        if (opts.syntax) str = opts.syntax.stringify;
	        if (opts.stringifier) str = opts.stringifier;
	        if (str.stringify) str = str.stringify;
	
	        var map = new _mapGenerator2.default(str, this.result.root, this.result.opts);
	        var data = map.generate();
	        this.result.css = data[0];
	        this.result.map = data[1];
	
	        return this.result;
	    };
	
	    _createClass(LazyResult, [{
	        key: 'processor',
	        get: function get() {
	            return this.result.processor;
	        }
	
	        /**
	         * Options from the {@link Processor#process} call.
	         * @type {processOptions}
	         */
	
	    }, {
	        key: 'opts',
	        get: function get() {
	            return this.result.opts;
	        }
	
	        /**
	         * Processes input CSS through synchronous plugins, converts `Root`
	         * to a CSS string and returns {@link Result#css}.
	         *
	         * This property will only work with synchronous plugins.
	         * If the processor contains any asynchronous plugins
	         * it will throw an error. This is why this method is only
	         * for debug purpose, you should always use {@link LazyResult#then}.
	         *
	         * @type {string}
	         * @see Result#css
	         */
	
	    }, {
	        key: 'css',
	        get: function get() {
	            return this.stringify().css;
	        }
	
	        /**
	         * An alias for the `css` property. Use it with syntaxes
	         * that generate non-CSS output.
	         *
	         * This property will only work with synchronous plugins.
	         * If the processor contains any asynchronous plugins
	         * it will throw an error. This is why this method is only
	         * for debug purpose, you should always use {@link LazyResult#then}.
	         *
	         * @type {string}
	         * @see Result#content
	         */
	
	    }, {
	        key: 'content',
	        get: function get() {
	            return this.stringify().content;
	        }
	
	        /**
	         * Processes input CSS through synchronous plugins
	         * and returns {@link Result#map}.
	         *
	         * This property will only work with synchronous plugins.
	         * If the processor contains any asynchronous plugins
	         * it will throw an error. This is why this method is only
	         * for debug purpose, you should always use {@link LazyResult#then}.
	         *
	         * @type {SourceMapGenerator}
	         * @see Result#map
	         */
	
	    }, {
	        key: 'map',
	        get: function get() {
	            return this.stringify().map;
	        }
	
	        /**
	         * Processes input CSS through synchronous plugins
	         * and returns {@link Result#root}.
	         *
	         * This property will only work with synchronous plugins. If the processor
	         * contains any asynchronous plugins it will throw an error.
	         *
	         * This is why this method is only for debug purpose,
	         * you should always use {@link LazyResult#then}.
	         *
	         * @type {Root}
	         * @see Result#root
	         */
	
	    }, {
	        key: 'root',
	        get: function get() {
	            return this.sync().root;
	        }
	
	        /**
	         * Processes input CSS through synchronous plugins
	         * and returns {@link Result#messages}.
	         *
	         * This property will only work with synchronous plugins. If the processor
	         * contains any asynchronous plugins it will throw an error.
	         *
	         * This is why this method is only for debug purpose,
	         * you should always use {@link LazyResult#then}.
	         *
	         * @type {Message[]}
	         * @see Result#messages
	         */
	
	    }, {
	        key: 'messages',
	        get: function get() {
	            return this.sync().messages;
	        }
	    }]);
	
	    return LazyResult;
	}();
	
	exports.default = LazyResult;
	
	/**
	 * @callback onFulfilled
	 * @param {Result} result
	 */
	
	/**
	 * @callback onRejected
	 * @param {Error} error
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhenktcmVzdWx0LmVzNiJdLCJuYW1lcyI6WyJpc1Byb21pc2UiLCJvYmoiLCJ0aGVuIiwiTGF6eVJlc3VsdCIsInByb2Nlc3NvciIsImNzcyIsIm9wdHMiLCJzdHJpbmdpZmllZCIsInByb2Nlc3NlZCIsInJvb3QiLCJ0eXBlIiwibWFwIiwiaW5saW5lIiwicHJldiIsInBhcnNlciIsInN5bnRheCIsInBhcnNlIiwiZXJyb3IiLCJyZXN1bHQiLCJ3YXJuaW5ncyIsInN5bmMiLCJ0b1N0cmluZyIsIm9uRnVsZmlsbGVkIiwib25SZWplY3RlZCIsImFzeW5jIiwiY2F0Y2giLCJoYW5kbGVFcnJvciIsInBsdWdpbiIsIm5hbWUiLCJwb3N0Y3NzUGx1Z2luIiwic2V0TWVzc2FnZSIsInBvc3Rjc3NWZXJzaW9uIiwicGx1Z2luTmFtZSIsInBsdWdpblZlciIsInJ1bnRpbWVWZXIiLCJ2ZXJzaW9uIiwiYSIsInNwbGl0IiwiYiIsInBhcnNlSW50IiwiZXJyIiwiY29uc29sZSIsImFzeW5jVGljayIsInJlc29sdmUiLCJyZWplY3QiLCJwbHVnaW5zIiwibGVuZ3RoIiwicHJvbWlzZSIsInJ1biIsIlByb21pc2UiLCJzdHJpbmdpZnkiLCJwcm9jZXNzaW5nIiwiRXJyb3IiLCJsYXN0UGx1Z2luIiwic3RyIiwic3RyaW5naWZpZXIiLCJkYXRhIiwiZ2VuZXJhdGUiLCJjb250ZW50IiwibWVzc2FnZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF3QjtBQUNwQixXQUFPLFFBQU9BLEdBQVAseUNBQU9BLEdBQVAsT0FBZSxRQUFmLElBQTJCLE9BQU9BLElBQUlDLElBQVgsS0FBb0IsVUFBdEQ7QUFDSDs7QUFFRDs7Ozs7Ozs7O0lBUU1DLFU7QUFFRix3QkFBWUMsU0FBWixFQUF1QkMsR0FBdkIsRUFBNEJDLElBQTVCLEVBQWtDO0FBQUE7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QyxLQUFLUyxNQUFMLENBQVlaLElBQXBELENBQVg7QUFDQSxZQUFJa0QsT0FBTzdDLElBQUk4QyxRQUFKLEVBQVg7QUFDQSxhQUFLdkMsTUFBTCxDQUFZYixHQUFaLEdBQWtCbUQsS0FBSyxDQUFMLENBQWxCO0FBQ0EsYUFBS3RDLE1BQUwsQ0FBWVAsR0FBWixHQUFrQjZDLEtBQUssQ0FBTCxDQUFsQjs7QUFFQSxlQUFPLEtBQUt0QyxNQUFaO0FBQ0gsSzs7Ozs0QkFsU2U7QUFDWixtQkFBTyxLQUFLQSxNQUFMLENBQVlkLFNBQW5CO0FBQ0g7O0FBRUQ7Ozs7Ozs7NEJBSVc7QUFDUCxtQkFBTyxLQUFLYyxNQUFMLENBQVlaLElBQW5CO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs0QkFZVTtBQUNOLG1CQUFPLEtBQUs0QyxTQUFMLEdBQWlCN0MsR0FBeEI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzRCQVljO0FBQ1YsbUJBQU8sS0FBSzZDLFNBQUwsR0FBaUJRLE9BQXhCO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs0QkFZVTtBQUNOLG1CQUFPLEtBQUtSLFNBQUwsR0FBaUJ2QyxHQUF4QjtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OzRCQWFXO0FBQ1AsbUJBQU8sS0FBS1MsSUFBTCxHQUFZWCxJQUFuQjtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OzRCQWFlO0FBQ1gsbUJBQU8sS0FBS1csSUFBTCxHQUFZdUMsUUFBbkI7QUFDSDs7Ozs7O2tCQTBNVXhELFU7O0FBRWY7Ozs7O0FBS0EiLCJmaWxlIjoibGF6eS1yZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFwR2VuZXJhdG9yIGZyb20gJy4vbWFwLWdlbmVyYXRvcic7XG5pbXBvcnQgc3RyaW5naWZ5ICAgIGZyb20gJy4vc3RyaW5naWZ5JztcbmltcG9ydCB3YXJuT25jZSAgICAgZnJvbSAnLi93YXJuLW9uY2UnO1xuaW1wb3J0IFJlc3VsdCAgICAgICBmcm9tICcuL3Jlc3VsdCc7XG5pbXBvcnQgcGFyc2UgICAgICAgIGZyb20gJy4vcGFyc2UnO1xuXG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBBIFByb21pc2UgcHJveHkgZm9yIHRoZSByZXN1bHQgb2YgUG9zdENTUyB0cmFuc2Zvcm1hdGlvbnMuXG4gKlxuICogQSBgTGF6eVJlc3VsdGAgaW5zdGFuY2UgaXMgcmV0dXJuZWQgYnkge0BsaW5rIFByb2Nlc3NvciNwcm9jZXNzfS5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbGF6eSA9IHBvc3Rjc3MoW2Nzc25leHRdKS5wcm9jZXNzKGNzcyk7XG4gKi9cbmNsYXNzIExhenlSZXN1bHQge1xuXG4gICAgY29uc3RydWN0b3IocHJvY2Vzc29yLCBjc3MsIG9wdHMpIHtcbiAgICAgICAgdGhpcy5zdHJpbmdpZmllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByb2Nlc3NlZCAgID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IHJvb3Q7XG4gICAgICAgIGlmICggdHlwZW9mIGNzcyA9PT0gJ29iamVjdCcgJiYgY3NzLnR5cGUgPT09ICdyb290JyApIHtcbiAgICAgICAgICAgIHJvb3QgPSBjc3M7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNzcyBpbnN0YW5jZW9mIExhenlSZXN1bHQgfHwgY3NzIGluc3RhbmNlb2YgUmVzdWx0ICkge1xuICAgICAgICAgICAgcm9vdCA9IGNzcy5yb290O1xuICAgICAgICAgICAgaWYgKCBjc3MubWFwICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIG9wdHMubWFwID09PSAndW5kZWZpbmVkJyApIG9wdHMubWFwID0geyB9O1xuICAgICAgICAgICAgICAgIGlmICggIW9wdHMubWFwLmlubGluZSApIG9wdHMubWFwLmlubGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG9wdHMubWFwLnByZXYgPSBjc3MubWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBhcnNlciA9IHBhcnNlO1xuICAgICAgICAgICAgaWYgKCBvcHRzLnN5bnRheCApICBwYXJzZXIgPSBvcHRzLnN5bnRheC5wYXJzZTtcbiAgICAgICAgICAgIGlmICggb3B0cy5wYXJzZXIgKSAgcGFyc2VyID0gb3B0cy5wYXJzZXI7XG4gICAgICAgICAgICBpZiAoIHBhcnNlci5wYXJzZSApIHBhcnNlciA9IHBhcnNlci5wYXJzZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByb290ID0gcGFyc2VyKGNzcywgb3B0cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzdWx0ID0gbmV3IFJlc3VsdChwcm9jZXNzb3IsIHJvb3QsIG9wdHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSB7QGxpbmsgUHJvY2Vzc29yfSBpbnN0YW5jZSwgd2hpY2ggd2lsbCBiZSB1c2VkXG4gICAgICogZm9yIENTUyB0cmFuc2Zvcm1hdGlvbnMuXG4gICAgICogQHR5cGUge1Byb2Nlc3Nvcn1cbiAgICAgKi9cbiAgICBnZXQgcHJvY2Vzc29yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHQucHJvY2Vzc29yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgZnJvbSB0aGUge0BsaW5rIFByb2Nlc3NvciNwcm9jZXNzfSBjYWxsLlxuICAgICAqIEB0eXBlIHtwcm9jZXNzT3B0aW9uc31cbiAgICAgKi9cbiAgICBnZXQgb3B0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0Lm9wdHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGlucHV0IENTUyB0aHJvdWdoIHN5bmNocm9ub3VzIHBsdWdpbnMsIGNvbnZlcnRzIGBSb290YFxuICAgICAqIHRvIGEgQ1NTIHN0cmluZyBhbmQgcmV0dXJucyB7QGxpbmsgUmVzdWx0I2Nzc30uXG4gICAgICpcbiAgICAgKiBUaGlzIHByb3BlcnR5IHdpbGwgb25seSB3b3JrIHdpdGggc3luY2hyb25vdXMgcGx1Z2lucy5cbiAgICAgKiBJZiB0aGUgcHJvY2Vzc29yIGNvbnRhaW5zIGFueSBhc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IuIFRoaXMgaXMgd2h5IHRoaXMgbWV0aG9kIGlzIG9ubHlcbiAgICAgKiBmb3IgZGVidWcgcHVycG9zZSwgeW91IHNob3VsZCBhbHdheXMgdXNlIHtAbGluayBMYXp5UmVzdWx0I3RoZW59LlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAc2VlIFJlc3VsdCNjc3NcbiAgICAgKi9cbiAgICBnZXQgY3NzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoKS5jc3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWxpYXMgZm9yIHRoZSBgY3NzYCBwcm9wZXJ0eS4gVXNlIGl0IHdpdGggc3ludGF4ZXNcbiAgICAgKiB0aGF0IGdlbmVyYXRlIG5vbi1DU1Mgb3V0cHV0LlxuICAgICAqXG4gICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIG9ubHkgd29yayB3aXRoIHN5bmNocm9ub3VzIHBsdWdpbnMuXG4gICAgICogSWYgdGhlIHByb2Nlc3NvciBjb250YWlucyBhbnkgYXN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBpdCB3aWxsIHRocm93IGFuIGVycm9yLiBUaGlzIGlzIHdoeSB0aGlzIG1ldGhvZCBpcyBvbmx5XG4gICAgICogZm9yIGRlYnVnIHB1cnBvc2UsIHlvdSBzaG91bGQgYWx3YXlzIHVzZSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHNlZSBSZXN1bHQjY29udGVudFxuICAgICAqL1xuICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoKS5jb250ZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBDU1MgdGhyb3VnaCBzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogYW5kIHJldHVybnMge0BsaW5rIFJlc3VsdCNtYXB9LlxuICAgICAqXG4gICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIG9ubHkgd29yayB3aXRoIHN5bmNocm9ub3VzIHBsdWdpbnMuXG4gICAgICogSWYgdGhlIHByb2Nlc3NvciBjb250YWlucyBhbnkgYXN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBpdCB3aWxsIHRocm93IGFuIGVycm9yLiBUaGlzIGlzIHdoeSB0aGlzIG1ldGhvZCBpcyBvbmx5XG4gICAgICogZm9yIGRlYnVnIHB1cnBvc2UsIHlvdSBzaG91bGQgYWx3YXlzIHVzZSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTb3VyY2VNYXBHZW5lcmF0b3J9XG4gICAgICogQHNlZSBSZXN1bHQjbWFwXG4gICAgICovXG4gICAgZ2V0IG1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5KCkubWFwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBDU1MgdGhyb3VnaCBzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogYW5kIHJldHVybnMge0BsaW5rIFJlc3VsdCNyb290fS5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgd2lsbCBvbmx5IHdvcmsgd2l0aCBzeW5jaHJvbm91cyBwbHVnaW5zLiBJZiB0aGUgcHJvY2Vzc29yXG4gICAgICogY29udGFpbnMgYW55IGFzeW5jaHJvbm91cyBwbHVnaW5zIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHdoeSB0aGlzIG1ldGhvZCBpcyBvbmx5IGZvciBkZWJ1ZyBwdXJwb3NlLFxuICAgICAqIHlvdSBzaG91bGQgYWx3YXlzIHVzZSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtSb290fVxuICAgICAqIEBzZWUgUmVzdWx0I3Jvb3RcbiAgICAgKi9cbiAgICBnZXQgcm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYygpLnJvb3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGlucHV0IENTUyB0aHJvdWdoIHN5bmNocm9ub3VzIHBsdWdpbnNcbiAgICAgKiBhbmQgcmV0dXJucyB7QGxpbmsgUmVzdWx0I21lc3NhZ2VzfS5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgd2lsbCBvbmx5IHdvcmsgd2l0aCBzeW5jaHJvbm91cyBwbHVnaW5zLiBJZiB0aGUgcHJvY2Vzc29yXG4gICAgICogY29udGFpbnMgYW55IGFzeW5jaHJvbm91cyBwbHVnaW5zIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHdoeSB0aGlzIG1ldGhvZCBpcyBvbmx5IGZvciBkZWJ1ZyBwdXJwb3NlLFxuICAgICAqIHlvdSBzaG91bGQgYWx3YXlzIHVzZSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtNZXNzYWdlW119XG4gICAgICogQHNlZSBSZXN1bHQjbWVzc2FnZXNcbiAgICAgKi9cbiAgICBnZXQgbWVzc2FnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKS5tZXNzYWdlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgaW5wdXQgQ1NTIHRocm91Z2ggc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGFuZCBjYWxscyB7QGxpbmsgUmVzdWx0I3dhcm5pbmdzKCl9LlxuICAgICAqXG4gICAgICogQHJldHVybiB7V2FybmluZ1tdfSB3YXJuaW5ncyBmcm9tIHBsdWdpbnNcbiAgICAgKi9cbiAgICB3YXJuaW5ncygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYygpLndhcm5pbmdzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgZm9yIHRoZSB7QGxpbmsgTGF6eVJlc3VsdCNjc3N9IHByb3BlcnR5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsYXp5ICsgJycgPT09IGxhenkuY3NzO1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBvdXRwdXQgQ1NTXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNzcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgaW5wdXQgQ1NTIHRocm91Z2ggc3luY2hyb25vdXMgYW5kIGFzeW5jaHJvbm91cyBwbHVnaW5zXG4gICAgICogYW5kIGNhbGxzIGBvbkZ1bGZpbGxlZGAgd2l0aCBhIFJlc3VsdCBpbnN0YW5jZS4gSWYgYSBwbHVnaW4gdGhyb3dzXG4gICAgICogYW4gZXJyb3IsIHRoZSBgb25SZWplY3RlZGAgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZC5cbiAgICAgKlxuICAgICAqIEl0IGltcGxlbWVudHMgc3RhbmRhcmQgUHJvbWlzZSBBUEkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29uRnVsZmlsbGVkfSBvbkZ1bGZpbGxlZCAtIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gYWxsIHBsdWdpbnMgd2lsbCBmaW5pc2ggd29ya1xuICAgICAqIEBwYXJhbSB7b25SZWplY3RlZH0gIG9uUmVqZWN0ZWQgIC0gY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZCBvbiBhbnkgZXJyb3JcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgQVBJIHRvIG1ha2UgcXVldWVcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcG9zdGNzcyhbY3NzbmV4dF0pLnByb2Nlc3MoY3NzKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICogICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzeW5jKCkudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGlucHV0IENTUyB0aHJvdWdoIHN5bmNocm9ub3VzIGFuZCBhc3luY2hyb25vdXMgcGx1Z2luc1xuICAgICAqIGFuZCBjYWxscyBvblJlamVjdGVkIGZvciBlYWNoIGVycm9yIHRocm93biBpbiBhbnkgcGx1Z2luLlxuICAgICAqXG4gICAgICogSXQgaW1wbGVtZW50cyBzdGFuZGFyZCBQcm9taXNlIEFQSS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b25SZWplY3RlZH0gb25SZWplY3RlZCAtIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb24gYW55IGVycm9yXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIEFQSSB0byBtYWtlIHF1ZXVlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MoW2Nzc25leHRdKS5wcm9jZXNzKGNzcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAqICAgY29uc29sZS5sb2cocmVzdWx0LmNzcyk7XG4gICAgICogfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAqICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgY2F0Y2gob25SZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hc3luYygpLmNhdGNoKG9uUmVqZWN0ZWQpO1xuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKGVycm9yLCBwbHVnaW4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIGlmICggZXJyb3IubmFtZSA9PT0gJ0Nzc1N5bnRheEVycm9yJyAmJiAhZXJyb3IucGx1Z2luICkge1xuICAgICAgICAgICAgICAgIGVycm9yLnBsdWdpbiA9IHBsdWdpbi5wb3N0Y3NzUGx1Z2luO1xuICAgICAgICAgICAgICAgIGVycm9yLnNldE1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHBsdWdpbi5wb3N0Y3NzVmVyc2lvbiApIHtcbiAgICAgICAgICAgICAgICBsZXQgcGx1Z2luTmFtZSA9IHBsdWdpbi5wb3N0Y3NzUGx1Z2luO1xuICAgICAgICAgICAgICAgIGxldCBwbHVnaW5WZXIgID0gcGx1Z2luLnBvc3Rjc3NWZXJzaW9uO1xuICAgICAgICAgICAgICAgIGxldCBydW50aW1lVmVyID0gdGhpcy5yZXN1bHQucHJvY2Vzc29yLnZlcnNpb247XG4gICAgICAgICAgICAgICAgbGV0IGEgPSBwbHVnaW5WZXIuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICBsZXQgYiA9IHJ1bnRpbWVWZXIuc3BsaXQoJy4nKTtcblxuICAgICAgICAgICAgICAgIGlmICggYVswXSAhPT0gYlswXSB8fCBwYXJzZUludChhWzFdKSA+IHBhcnNlSW50KGJbMV0pICkge1xuICAgICAgICAgICAgICAgICAgICB3YXJuT25jZSgnWW91ciBjdXJyZW50IFBvc3RDU1MgdmVyc2lvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lzICcgKyBydW50aW1lVmVyICsgJywgYnV0ICcgKyBwbHVnaW5OYW1lICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXMgJyArIHBsdWdpblZlciArICcuIFBlcmhhcHMgdGhpcyBpcyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RoZSBzb3VyY2Ugb2YgdGhlIGVycm9yIGJlbG93LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoIGNvbnNvbGUgJiYgY29uc29sZS5lcnJvciApIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jVGljayhyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgaWYgKCB0aGlzLnBsdWdpbiA+PSB0aGlzLnByb2Nlc3Nvci5wbHVnaW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHBsdWdpbiAgPSB0aGlzLnByb2Nlc3Nvci5wbHVnaW5zW3RoaXMucGx1Z2luXTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5ydW4ocGx1Z2luKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luICs9IDE7XG5cbiAgICAgICAgICAgIGlmICggaXNQcm9taXNlKHByb21pc2UpICkge1xuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzeW5jVGljayhyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIHBsdWdpbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3luY1RpY2socmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jKCkge1xuICAgICAgICBpZiAoIHRoaXMucHJvY2Vzc2VkICkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLmVycm9yICkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5lcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnN0cmluZ2lmeSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMucHJvY2Vzc2luZyApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3Npbmc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb2Nlc3NpbmcgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKCB0aGlzLmVycm9yICkgcmV0dXJuIHJlamVjdCh0aGlzLmVycm9yKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luID0gMDtcbiAgICAgICAgICAgIHRoaXMuYXN5bmNUaWNrKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzaW5nO1xuICAgIH1cblxuICAgIHN5bmMoKSB7XG4gICAgICAgIGlmICggdGhpcy5wcm9jZXNzZWQgKSByZXR1cm4gdGhpcy5yZXN1bHQ7XG4gICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoIHRoaXMucHJvY2Vzc2luZyApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnVXNlIHByb2Nlc3MoY3NzKS50aGVuKGNiKSB0byB3b3JrIHdpdGggYXN5bmMgcGx1Z2lucycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0aGlzLmVycm9yICkgdGhyb3cgdGhpcy5lcnJvcjtcblxuICAgICAgICBmb3IgKCBsZXQgcGx1Z2luIG9mIHRoaXMucmVzdWx0LnByb2Nlc3Nvci5wbHVnaW5zICkge1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLnJ1bihwbHVnaW4pO1xuICAgICAgICAgICAgaWYgKCBpc1Byb21pc2UocHJvbWlzZSkgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAnVXNlIHByb2Nlc3MoY3NzKS50aGVuKGNiKSB0byB3b3JrIHdpdGggYXN5bmMgcGx1Z2lucycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0O1xuICAgIH1cblxuICAgIHJ1bihwbHVnaW4pIHtcbiAgICAgICAgdGhpcy5yZXN1bHQubGFzdFBsdWdpbiA9IHBsdWdpbjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpbih0aGlzLnJlc3VsdC5yb290LCB0aGlzLnJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCBwbHVnaW4pO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdHJpbmdpZnkoKSB7XG4gICAgICAgIGlmICggdGhpcy5zdHJpbmdpZmllZCApIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgICAgICAgdGhpcy5zdHJpbmdpZmllZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zeW5jKCk7XG5cbiAgICAgICAgbGV0IG9wdHMgPSB0aGlzLnJlc3VsdC5vcHRzO1xuICAgICAgICBsZXQgc3RyICA9IHN0cmluZ2lmeTtcbiAgICAgICAgaWYgKCBvcHRzLnN5bnRheCApICAgICAgc3RyID0gb3B0cy5zeW50YXguc3RyaW5naWZ5O1xuICAgICAgICBpZiAoIG9wdHMuc3RyaW5naWZpZXIgKSBzdHIgPSBvcHRzLnN0cmluZ2lmaWVyO1xuICAgICAgICBpZiAoIHN0ci5zdHJpbmdpZnkgKSAgICBzdHIgPSBzdHIuc3RyaW5naWZ5O1xuXG4gICAgICAgIGxldCBtYXAgID0gbmV3IE1hcEdlbmVyYXRvcihzdHIsIHRoaXMucmVzdWx0LnJvb3QsIHRoaXMucmVzdWx0Lm9wdHMpO1xuICAgICAgICBsZXQgZGF0YSA9IG1hcC5nZW5lcmF0ZSgpO1xuICAgICAgICB0aGlzLnJlc3VsdC5jc3MgPSBkYXRhWzBdO1xuICAgICAgICB0aGlzLnJlc3VsdC5tYXAgPSBkYXRhWzFdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF6eVJlc3VsdDtcblxuLyoqXG4gKiBAY2FsbGJhY2sgb25GdWxmaWxsZWRcbiAqIEBwYXJhbSB7UmVzdWx0fSByZXN1bHRcbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBvblJlamVjdGVkXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICovXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _jsBase = __webpack_require__(20);
	
	var _sourceMap = __webpack_require__(25);
	
	var _sourceMap2 = _interopRequireDefault(_sourceMap);
	
	var _path = __webpack_require__(36);
	
	var _path2 = _interopRequireDefault(_path);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MapGenerator = function () {
	    function MapGenerator(stringify, root, opts) {
	        _classCallCheck(this, MapGenerator);
	
	        this.stringify = stringify;
	        this.mapOpts = opts.map || {};
	        this.root = root;
	        this.opts = opts;
	    }
	
	    MapGenerator.prototype.isMap = function isMap() {
	        if (typeof this.opts.map !== 'undefined') {
	            return !!this.opts.map;
	        } else {
	            return this.previous().length > 0;
	        }
	    };
	
	    MapGenerator.prototype.previous = function previous() {
	        var _this = this;
	
	        if (!this.previousMaps) {
	            this.previousMaps = [];
	            this.root.walk(function (node) {
	                if (node.source && node.source.input.map) {
	                    var map = node.source.input.map;
	                    if (_this.previousMaps.indexOf(map) === -1) {
	                        _this.previousMaps.push(map);
	                    }
	                }
	            });
	        }
	
	        return this.previousMaps;
	    };
	
	    MapGenerator.prototype.isInline = function isInline() {
	        if (typeof this.mapOpts.inline !== 'undefined') {
	            return this.mapOpts.inline;
	        }
	
	        var annotation = this.mapOpts.annotation;
	        if (typeof annotation !== 'undefined' && annotation !== true) {
	            return false;
	        }
	
	        if (this.previous().length) {
	            return this.previous().some(function (i) {
	                return i.inline;
	            });
	        } else {
	            return true;
	        }
	    };
	
	    MapGenerator.prototype.isSourcesContent = function isSourcesContent() {
	        if (typeof this.mapOpts.sourcesContent !== 'undefined') {
	            return this.mapOpts.sourcesContent;
	        }
	        if (this.previous().length) {
	            return this.previous().some(function (i) {
	                return i.withContent();
	            });
	        } else {
	            return true;
	        }
	    };
	
	    MapGenerator.prototype.clearAnnotation = function clearAnnotation() {
	        if (this.mapOpts.annotation === false) return;
	
	        var node = void 0;
	        for (var i = this.root.nodes.length - 1; i >= 0; i--) {
	            node = this.root.nodes[i];
	            if (node.type !== 'comment') continue;
	            if (node.text.indexOf('# sourceMappingURL=') === 0) {
	                this.root.removeChild(i);
	            }
	        }
	    };
	
	    MapGenerator.prototype.setSourcesContent = function setSourcesContent() {
	        var _this2 = this;
	
	        var already = {};
	        this.root.walk(function (node) {
	            if (node.source) {
	                var from = node.source.input.from;
	                if (from && !already[from]) {
	                    already[from] = true;
	                    var relative = _this2.relative(from);
	                    _this2.map.setSourceContent(relative, node.source.input.css);
	                }
	            }
	        });
	    };
	
	    MapGenerator.prototype.applyPrevMaps = function applyPrevMaps() {
	        for (var _iterator = this.previous(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }
	
	            var prev = _ref;
	
	            var from = this.relative(prev.file);
	            var root = prev.root || _path2.default.dirname(prev.file);
	            var map = void 0;
	
	            if (this.mapOpts.sourcesContent === false) {
	                map = new _sourceMap2.default.SourceMapConsumer(prev.text);
	                if (map.sourcesContent) {
	                    map.sourcesContent = map.sourcesContent.map(function () {
	                        return null;
	                    });
	                }
	            } else {
	                map = prev.consumer();
	            }
	
	            this.map.applySourceMap(map, from, this.relative(root));
	        }
	    };
	
	    MapGenerator.prototype.isAnnotation = function isAnnotation() {
	        if (this.isInline()) {
	            return true;
	        } else if (typeof this.mapOpts.annotation !== 'undefined') {
	            return this.mapOpts.annotation;
	        } else if (this.previous().length) {
	            return this.previous().some(function (i) {
	                return i.annotation;
	            });
	        } else {
	            return true;
	        }
	    };
	
	    MapGenerator.prototype.addAnnotation = function addAnnotation() {
	        var content = void 0;
	
	        if (this.isInline()) {
	            content = 'data:application/json;base64,' + _jsBase.Base64.encode(this.map.toString());
	        } else if (typeof this.mapOpts.annotation === 'string') {
	            content = this.mapOpts.annotation;
	        } else {
	            content = this.outputFile() + '.map';
	        }
	
	        var eol = '\n';
	        if (this.css.indexOf('\r\n') !== -1) eol = '\r\n';
	
	        this.css += eol + '/*# sourceMappingURL=' + content + ' */';
	    };
	
	    MapGenerator.prototype.outputFile = function outputFile() {
	        if (this.opts.to) {
	            return this.relative(this.opts.to);
	        } else if (this.opts.from) {
	            return this.relative(this.opts.from);
	        } else {
	            return 'to.css';
	        }
	    };
	
	    MapGenerator.prototype.generateMap = function generateMap() {
	        this.generateString();
	        if (this.isSourcesContent()) this.setSourcesContent();
	        if (this.previous().length > 0) this.applyPrevMaps();
	        if (this.isAnnotation()) this.addAnnotation();
	
	        if (this.isInline()) {
	            return [this.css];
	        } else {
	            return [this.css, this.map];
	        }
	    };
	
	    MapGenerator.prototype.relative = function relative(file) {
	        if (file.indexOf('<') === 0) return file;
	        if (/^\w+:\/\//.test(file)) return file;
	
	        var from = this.opts.to ? _path2.default.dirname(this.opts.to) : '.';
	
	        if (typeof this.mapOpts.annotation === 'string') {
	            from = _path2.default.dirname(_path2.default.resolve(from, this.mapOpts.annotation));
	        }
	
	        file = _path2.default.relative(from, file);
	        if (_path2.default.sep === '\\') {
	            return file.replace(/\\/g, '/');
	        } else {
	            return file;
	        }
	    };
	
	    MapGenerator.prototype.sourcePath = function sourcePath(node) {
	        if (this.mapOpts.from) {
	            return this.mapOpts.from;
	        } else {
	            return this.relative(node.source.input.from);
	        }
	    };
	
	    MapGenerator.prototype.generateString = function generateString() {
	        var _this3 = this;
	
	        this.css = '';
	        this.map = new _sourceMap2.default.SourceMapGenerator({ file: this.outputFile() });
	
	        var line = 1;
	        var column = 1;
	
	        var lines = void 0,
	            last = void 0;
	        this.stringify(this.root, function (str, node, type) {
	            _this3.css += str;
	
	            if (node && type !== 'end') {
	                if (node.source && node.source.start) {
	                    _this3.map.addMapping({
	                        source: _this3.sourcePath(node),
	                        generated: { line: line, column: column - 1 },
	                        original: {
	                            line: node.source.start.line,
	                            column: node.source.start.column - 1
	                        }
	                    });
	                } else {
	                    _this3.map.addMapping({
	                        source: '<no source>',
	                        original: { line: 1, column: 0 },
	                        generated: { line: line, column: column - 1 }
	                    });
	                }
	            }
	
	            lines = str.match(/\n/g);
	            if (lines) {
	                line += lines.length;
	                last = str.lastIndexOf('\n');
	                column = str.length - last;
	            } else {
	                column += str.length;
	            }
	
	            if (node && type !== 'start') {
	                if (node.source && node.source.end) {
	                    _this3.map.addMapping({
	                        source: _this3.sourcePath(node),
	                        generated: { line: line, column: column - 1 },
	                        original: {
	                            line: node.source.end.line,
	                            column: node.source.end.column
	                        }
	                    });
	                } else {
	                    _this3.map.addMapping({
	                        source: '<no source>',
	                        original: { line: 1, column: 0 },
	                        generated: { line: line, column: column - 1 }
	                    });
	                }
	            }
	        });
	    };
	
	    MapGenerator.prototype.generate = function generate() {
	        this.clearAnnotation();
	
	        if (this.isMap()) {
	            return this.generateMap();
	        } else {
	            var result = '';
	            this.stringify(this.root, function (i) {
	                result += i;
	            });
	            return [result];
	        }
	    };
	
	    return MapGenerator;
	}();
	
	exports.default = MapGenerator;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcC1nZW5lcmF0b3IuZXM2Il0sIm5hbWVzIjpbIk1hcEdlbmVyYXRvciIsInN0cmluZ2lmeSIsInJvb3QiLCJvcHRzIiwibWFwT3B0cyIsIm1hcCIsImlzTWFwIiwicHJldmlvdXMiLCJsZW5ndGgiLCJwcmV2aW91c01hcHMiLCJ3YWxrIiwibm9kZSIsInNvdXJjZSIsImlucHV0IiwiaW5kZXhPZiIsInB1c2giLCJpc0lubGluZSIsImlubGluZSIsImFubm90YXRpb24iLCJzb21lIiwiaSIsImlzU291cmNlc0NvbnRlbnQiLCJzb3VyY2VzQ29udGVudCIsIndpdGhDb250ZW50IiwiY2xlYXJBbm5vdGF0aW9uIiwibm9kZXMiLCJ0eXBlIiwidGV4dCIsInJlbW92ZUNoaWxkIiwic2V0U291cmNlc0NvbnRlbnQiLCJhbHJlYWR5IiwiZnJvbSIsInJlbGF0aXZlIiwic2V0U291cmNlQ29udGVudCIsImNzcyIsImFwcGx5UHJldk1hcHMiLCJwcmV2IiwiZmlsZSIsImRpcm5hbWUiLCJTb3VyY2VNYXBDb25zdW1lciIsImNvbnN1bWVyIiwiYXBwbHlTb3VyY2VNYXAiLCJpc0Fubm90YXRpb24iLCJhZGRBbm5vdGF0aW9uIiwiY29udGVudCIsImVuY29kZSIsInRvU3RyaW5nIiwib3V0cHV0RmlsZSIsImVvbCIsInRvIiwiZ2VuZXJhdGVNYXAiLCJnZW5lcmF0ZVN0cmluZyIsInRlc3QiLCJyZXNvbHZlIiwic2VwIiwicmVwbGFjZSIsInNvdXJjZVBhdGgiLCJTb3VyY2VNYXBHZW5lcmF0b3IiLCJsaW5lIiwiY29sdW1uIiwibGluZXMiLCJsYXN0Iiwic3RyIiwic3RhcnQiLCJhZGRNYXBwaW5nIiwiZ2VuZXJhdGVkIiwib3JpZ2luYWwiLCJtYXRjaCIsImxhc3RJbmRleE9mIiwiZW5kIiwiZ2VuZXJhdGUiLCJyZXN1bHQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsWTtBQUVqQiwwQkFBWUMsU0FBWixFQUF1QkMs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QUtDLE1BQUwsSUFBZUQsS0FBS0MsTUFBTCxDQUFZeUQsR0FBaEMsRUFBc0M7QUFDbEMsMkJBQUtoRSxHQUFMLENBQVMyRCxVQUFULENBQW9CO0FBQ2hCcEQsZ0NBQVcsT0FBSzRDLFVBQUwsQ0FBZ0I3QyxJQUFoQixDQURLO0FBRWhCc0QsbUNBQVcsRUFBRVAsVUFBRixFQUFRQyxRQUFRQSxTQUFTLENBQXpCLEVBRks7QUFHaEJPLGtDQUFXO0FBQ1BSLGtDQUFRL0MsS0FBS0MsTUFBTCxDQUFZeUQsR0FBWixDQUFnQlgsSUFEakI7QUFFUEMsb0NBQVFoRCxLQUFLQyxNQUFMLENBQVl5RCxHQUFaLENBQWdCVjtBQUZqQjtBQUhLLHFCQUFwQjtBQVFILGlCQVRELE1BU087QUFDSCwyQkFBS3RELEdBQUwsQ0FBUzJELFVBQVQsQ0FBb0I7QUFDaEJwRCxnQ0FBVyxhQURLO0FBRWhCc0Qsa0NBQVcsRUFBRVIsTUFBTSxDQUFSLEVBQVdDLFFBQVEsQ0FBbkIsRUFGSztBQUdoQk0sbUNBQVcsRUFBRVAsVUFBRixFQUFRQyxRQUFRQSxTQUFTLENBQXpCO0FBSEsscUJBQXBCO0FBS0g7QUFDSjtBQUNKLFNBakREO0FBa0RILEs7OzJCQUVEVyxRLHVCQUFXO0FBQ1AsYUFBSzlDLGVBQUw7O0FBRUEsWUFBSyxLQUFLbEIsS0FBTCxFQUFMLEVBQW9CO0FBQ2hCLG1CQUFPLEtBQUs0QyxXQUFMLEVBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSXFCLFNBQVMsRUFBYjtBQUNBLGlCQUFLdEUsU0FBTCxDQUFlLEtBQUtDLElBQXBCLEVBQTBCLGFBQUs7QUFDM0JxRSwwQkFBVW5ELENBQVY7QUFDSCxhQUZEO0FBR0EsbUJBQU8sQ0FBQ21ELE1BQUQsQ0FBUDtBQUNIO0FBQ0osSzs7Ozs7a0JBcFFnQnZFLFkiLCJmaWxlIjoibWFwLWdlbmVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2U2NCB9IGZyb20gJ2pzLWJhc2U2NCc7XG5pbXBvcnQgICBtb3ppbGxhICBmcm9tICdzb3VyY2UtbWFwJztcbmltcG9ydCAgIHBhdGggICAgIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBHZW5lcmF0b3Ige1xuXG4gICAgY29uc3RydWN0b3Ioc3RyaW5naWZ5LCByb290LCBvcHRzKSB7XG4gICAgICAgIHRoaXMuc3RyaW5naWZ5ID0gc3RyaW5naWZ5O1xuICAgICAgICB0aGlzLm1hcE9wdHMgICA9IG9wdHMubWFwIHx8IHsgfTtcbiAgICAgICAgdGhpcy5yb290ICAgICAgPSByb290O1xuICAgICAgICB0aGlzLm9wdHMgICAgICA9IG9wdHM7XG4gICAgfVxuXG4gICAgaXNNYXAoKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMub3B0cy5tYXAgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5vcHRzLm1hcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXZpb3VzKCkge1xuICAgICAgICBpZiAoICF0aGlzLnByZXZpb3VzTWFwcyApIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNNYXBzID0gW107XG4gICAgICAgICAgICB0aGlzLnJvb3Qud2Fsayggbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBub2RlLnNvdXJjZSAmJiBub2RlLnNvdXJjZS5pbnB1dC5tYXAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXAgPSBub2RlLnNvdXJjZS5pbnB1dC5tYXA7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5wcmV2aW91c01hcHMuaW5kZXhPZihtYXApID09PSAtMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNNYXBzLnB1c2gobWFwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXNNYXBzO1xuICAgIH1cblxuICAgIGlzSW5saW5lKCkge1xuICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm1hcE9wdHMuaW5saW5lICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcE9wdHMuaW5saW5lO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFubm90YXRpb24gPSB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbjtcbiAgICAgICAgaWYgKCB0eXBlb2YgYW5ub3RhdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYW5ub3RhdGlvbiAhPT0gdHJ1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdGhpcy5wcmV2aW91cygpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZSggaSA9PiBpLmlubGluZSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1NvdXJjZXNDb250ZW50KCkge1xuICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm1hcE9wdHMuc291cmNlc0NvbnRlbnQgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMucHJldmlvdXMoKS5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpLnNvbWUoIGkgPT4gaS53aXRoQ29udGVudCgpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyQW5ub3RhdGlvbigpIHtcbiAgICAgICAgaWYgKCB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbiA9PT0gZmFsc2UgKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5vZGU7XG4gICAgICAgIGZvciAoIGxldCBpID0gdGhpcy5yb290Lm5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tICkge1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMucm9vdC5ub2Rlc1tpXTtcbiAgICAgICAgICAgIGlmICggbm9kZS50eXBlICE9PSAnY29tbWVudCcgKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICggbm9kZS50ZXh0LmluZGV4T2YoJyMgc291cmNlTWFwcGluZ1VSTD0nKSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTb3VyY2VzQ29udGVudCgpIHtcbiAgICAgICAgbGV0IGFscmVhZHkgPSB7IH07XG4gICAgICAgIHRoaXMucm9vdC53YWxrKCBub2RlID0+IHtcbiAgICAgICAgICAgIGlmICggbm9kZS5zb3VyY2UgKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZyb20gPSBub2RlLnNvdXJjZS5pbnB1dC5mcm9tO1xuICAgICAgICAgICAgICAgIGlmICggZnJvbSAmJiAhYWxyZWFkeVtmcm9tXSApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeVtmcm9tXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHRoaXMucmVsYXRpdmUoZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLnNldFNvdXJjZUNvbnRlbnQocmVsYXRpdmUsIG5vZGUuc291cmNlLmlucHV0LmNzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhcHBseVByZXZNYXBzKCkge1xuICAgICAgICBmb3IgKCBsZXQgcHJldiBvZiB0aGlzLnByZXZpb3VzKCkgKSB7XG4gICAgICAgICAgICBsZXQgZnJvbSA9IHRoaXMucmVsYXRpdmUocHJldi5maWxlKTtcbiAgICAgICAgICAgIGxldCByb290ID0gcHJldi5yb290IHx8IHBhdGguZGlybmFtZShwcmV2LmZpbGUpO1xuICAgICAgICAgICAgbGV0IG1hcDtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLm1hcE9wdHMuc291cmNlc0NvbnRlbnQgPT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIG1hcCA9IG5ldyBtb3ppbGxhLlNvdXJjZU1hcENvbnN1bWVyKHByZXYudGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKCBtYXAuc291cmNlc0NvbnRlbnQgKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcC5zb3VyY2VzQ29udGVudCA9IG1hcC5zb3VyY2VzQ29udGVudC5tYXAoICgpID0+IG51bGwgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcCA9IHByZXYuY29uc3VtZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYXAuYXBwbHlTb3VyY2VNYXAobWFwLCBmcm9tLCB0aGlzLnJlbGF0aXZlKHJvb3QpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQW5ub3RhdGlvbigpIHtcbiAgICAgICAgaWYgKCB0aGlzLmlzSW5saW5lKCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICggdGhpcy5wcmV2aW91cygpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZSggaSA9PiBpLmFubm90YXRpb24gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQW5ub3RhdGlvbigpIHtcbiAgICAgICAgbGV0IGNvbnRlbnQ7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzSW5saW5lKCkgKSB7XG4gICAgICAgICAgICBjb250ZW50ID0gJ2RhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArXG4gICAgICAgICAgICAgICAgICAgICAgIEJhc2U2NC5lbmNvZGUoIHRoaXMubWFwLnRvU3RyaW5nKCkgKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgY29udGVudCA9IHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZW50ID0gdGhpcy5vdXRwdXRGaWxlKCkgKyAnLm1hcCc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW9sICAgPSAnXFxuJztcbiAgICAgICAgaWYgKCB0aGlzLmNzcy5pbmRleE9mKCdcXHJcXG4nKSAhPT0gLTEgKSBlb2wgPSAnXFxyXFxuJztcblxuICAgICAgICB0aGlzLmNzcyArPSBlb2wgKyAnLyojIHNvdXJjZU1hcHBpbmdVUkw9JyArIGNvbnRlbnQgKyAnICovJztcbiAgICB9XG5cbiAgICBvdXRwdXRGaWxlKCkge1xuICAgICAgICBpZiAoIHRoaXMub3B0cy50byApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbGF0aXZlKHRoaXMub3B0cy50byk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMub3B0cy5mcm9tICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpdmUodGhpcy5vcHRzLmZyb20pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICd0by5jc3MnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVNYXAoKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVTdHJpbmcoKTtcbiAgICAgICAgaWYgKCB0aGlzLmlzU291cmNlc0NvbnRlbnQoKSApICAgIHRoaXMuc2V0U291cmNlc0NvbnRlbnQoKTtcbiAgICAgICAgaWYgKCB0aGlzLnByZXZpb3VzKCkubGVuZ3RoID4gMCApIHRoaXMuYXBwbHlQcmV2TWFwcygpO1xuICAgICAgICBpZiAoIHRoaXMuaXNBbm5vdGF0aW9uKCkgKSAgICAgICAgdGhpcy5hZGRBbm5vdGF0aW9uKCk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzSW5saW5lKCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuY3NzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5jc3MsIHRoaXMubWFwXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbGF0aXZlKGZpbGUpIHtcbiAgICAgICAgaWYgKCBmaWxlLmluZGV4T2YoJzwnKSA9PT0gMCApIHJldHVybiBmaWxlO1xuICAgICAgICBpZiAoIC9eXFx3KzpcXC9cXC8vLnRlc3QoZmlsZSkgKSByZXR1cm4gZmlsZTtcblxuICAgICAgICBsZXQgZnJvbSA9IHRoaXMub3B0cy50byA/IHBhdGguZGlybmFtZSh0aGlzLm9wdHMudG8pIDogJy4nO1xuXG4gICAgICAgIGlmICggdHlwZW9mIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIGZyb20gPSBwYXRoLmRpcm5hbWUoIHBhdGgucmVzb2x2ZShmcm9tLCB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbikgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGUgPSBwYXRoLnJlbGF0aXZlKGZyb20sIGZpbGUpO1xuICAgICAgICBpZiAoIHBhdGguc2VwID09PSAnXFxcXCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvdXJjZVBhdGgobm9kZSkge1xuICAgICAgICBpZiAoIHRoaXMubWFwT3B0cy5mcm9tICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwT3B0cy5mcm9tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpdmUobm9kZS5zb3VyY2UuaW5wdXQuZnJvbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZVN0cmluZygpIHtcbiAgICAgICAgdGhpcy5jc3MgPSAnJztcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgbW96aWxsYS5Tb3VyY2VNYXBHZW5lcmF0b3IoeyBmaWxlOiB0aGlzLm91dHB1dEZpbGUoKSB9KTtcblxuICAgICAgICBsZXQgbGluZSAgID0gMTtcbiAgICAgICAgbGV0IGNvbHVtbiA9IDE7XG5cbiAgICAgICAgbGV0IGxpbmVzLCBsYXN0O1xuICAgICAgICB0aGlzLnN0cmluZ2lmeSh0aGlzLnJvb3QsIChzdHIsIG5vZGUsIHR5cGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3NzICs9IHN0cjtcblxuICAgICAgICAgICAgaWYgKCBub2RlICYmIHR5cGUgIT09ICdlbmQnICkge1xuICAgICAgICAgICAgICAgIGlmICggbm9kZS5zb3VyY2UgJiYgbm9kZS5zb3VyY2Uuc3RhcnQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICB0aGlzLnNvdXJjZVBhdGgobm9kZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZSwgY29sdW1uOiBjb2x1bW4gLSAxIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiAgIG5vZGUuc291cmNlLnN0YXJ0LmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBub2RlLnNvdXJjZS5zdGFydC5jb2x1bW4gLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICAnPG5vIHNvdXJjZT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICB7IGxpbmU6IDEsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmUsIGNvbHVtbjogY29sdW1uIC0gMSB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGluZXMgPSBzdHIubWF0Y2goL1xcbi9nKTtcbiAgICAgICAgICAgIGlmICggbGluZXMgKSB7XG4gICAgICAgICAgICAgICAgbGluZSAgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxhc3QgICA9IHN0ci5sYXN0SW5kZXhPZignXFxuJyk7XG4gICAgICAgICAgICAgICAgY29sdW1uID0gc3RyLmxlbmd0aCAtIGxhc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbHVtbiArPSBzdHIubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIG5vZGUgJiYgdHlwZSAhPT0gJ3N0YXJ0JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIG5vZGUuc291cmNlICYmIG5vZGUuc291cmNlLmVuZCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICAgIHRoaXMuc291cmNlUGF0aChub2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lLCBjb2x1bW46IGNvbHVtbiAtIDEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6ICAgbm9kZS5zb3VyY2UuZW5kLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBub2RlLnNvdXJjZS5lbmQuY29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAgICAnPG5vIHNvdXJjZT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6ICB7IGxpbmU6IDEsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmUsIGNvbHVtbjogY29sdW1uIC0gMSB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJBbm5vdGF0aW9uKCk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzTWFwKCkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZU1hcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zdHJpbmdpZnkodGhpcy5yb290LCBpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gaTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFtyZXN1bHRdO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _warning = __webpack_require__(44);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Provides the result of the PostCSS transformations.
	 *
	 * A Result instance is returned by {@link LazyResult#then}
	 * or {@link Root#toResult} methods.
	 *
	 * @example
	 * postcss([cssnext]).process(css).then(function (result) {
	 *    console.log(result.css);
	 * });
	 *
	 * @example
	 * var result2 = postcss.parse(css).toResult();
	 */
	var Result = function () {
	
	  /**
	   * @param {Processor} processor - processor used for this transformation.
	   * @param {Root}      root      - Root node after all transformations.
	   * @param {processOptions} opts - options from the {@link Processor#process}
	   *                                or {@link Root#toResult}
	   */
	  function Result(processor, root, opts) {
	    _classCallCheck(this, Result);
	
	    /**
	     * @member {Processor} - The Processor instance used
	     *                       for this transformation.
	     *
	     * @example
	     * for ( let plugin of result.processor.plugins) {
	     *   if ( plugin.postcssPlugin === 'postcss-bad' ) {
	     *     throw 'postcss-good is incompatible with postcss-bad';
	     *   }
	     * });
	     */
	    this.processor = processor;
	    /**
	     * @member {Message[]} - Contains messages from plugins
	     *                       (e.g., warnings or custom messages).
	     *                       Each message should have type
	     *                       and plugin properties.
	     *
	     * @example
	     * postcss.plugin('postcss-min-browser', () => {
	     *   return (root, result) => {
	     *     var browsers = detectMinBrowsersByCanIUse(root);
	     *     result.messages.push({
	     *       type:    'min-browser',
	     *       plugin:  'postcss-min-browser',
	     *       browsers: browsers
	     *     });
	     *   };
	     * });
	     */
	    this.messages = [];
	    /**
	     * @member {Root} - Root node after all transformations.
	     *
	     * @example
	     * root.toResult().root == root;
	     */
	    this.root = root;
	    /**
	     * @member {processOptions} - Options from the {@link Processor#process}
	     *                            or {@link Root#toResult} call
	     *                            that produced this Result instance.
	     *
	     * @example
	     * root.toResult(opts).opts == opts;
	     */
	    this.opts = opts;
	    /**
	     * @member {string} - A CSS string representing of {@link Result#root}.
	     *
	     * @example
	     * postcss.parse('a{}').toResult().css //=> "a{}"
	     */
	    this.css = undefined;
	    /**
	     * @member {SourceMapGenerator} - An instance of `SourceMapGenerator`
	     *                                class from the `source-map` library,
	     *                                representing changes
	     *                                to the {@link Result#root} instance.
	     *
	     * @example
	     * result.map.toJSON() //=> { version: 3, file: 'a.css', … }
	     *
	     * @example
	     * if ( result.map ) {
	     *   fs.writeFileSync(result.opts.to + '.map', result.map.toString());
	     * }
	     */
	    this.map = undefined;
	  }
	
	  /**
	   * Returns for @{link Result#css} content.
	   *
	   * @example
	   * result + '' === result.css
	   *
	   * @return {string} string representing of {@link Result#root}
	   */
	
	
	  Result.prototype.toString = function toString() {
	    return this.css;
	  };
	
	  /**
	   * Creates an instance of {@link Warning} and adds it
	   * to {@link Result#messages}.
	   *
	   * @param {string} text        - warning message
	   * @param {Object} [opts]      - warning options
	   * @param {Node}   opts.node   - CSS node that caused the warning
	   * @param {string} opts.word   - word in CSS source that caused the warning
	   * @param {number} opts.index  - index in CSS node string that caused
	   *                               the warning
	   * @param {string} opts.plugin - name of the plugin that created
	   *                               this warning. {@link Result#warn} fills
	   *                               this property automatically.
	   *
	   * @return {Warning} created warning
	   */
	
	
	  Result.prototype.warn = function warn(text) {
	    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    if (!opts.plugin) {
	      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
	        opts.plugin = this.lastPlugin.postcssPlugin;
	      }
	    }
	
	    var warning = new _warning2.default(text, opts);
	    this.messages.push(warning);
	
	    return warning;
	  };
	
	  /**
	   * Returns warnings from plugins. Filters {@link Warning} instances
	   * from {@link Result#messages}.
	   *
	   * @example
	   * result.warnings().forEach(warn => {
	   *   console.warn(warn.toString());
	   * });
	   *
	   * @return {Warning[]} warnings from plugins
	   */
	
	
	  Result.prototype.warnings = function warnings() {
	    return this.messages.filter(function (i) {
	      return i.type === 'warning';
	    });
	  };
	
	  /**
	   * An alias for the {@link Result#css} property.
	   * Use it with syntaxes that generate non-CSS output.
	   * @type {string}
	   *
	   * @example
	   * result.css === result.content;
	   */
	
	
	  _createClass(Result, [{
	    key: 'content',
	    get: function get() {
	      return this.css;
	    }
	  }]);
	
	  return Result;
	}();
	
	exports.default = Result;
	
	/**
	 * @typedef  {object} Message
	 * @property {string} type   - message type
	 * @property {string} plugin - source PostCSS plugin name
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3VsdC5lczYiXSwibmFtZXMiOlsiUmVzdWx0IiwicHJvY2Vzc29yIiwicm9vdCIsIm9wdHMiLCJtZXNzYWdlcyIsImNzcyIsInVuZGVmaW5lZCIsIm1hcCIsInRvU3RyaW5nIiwid2FybiIsInRleHQiLCJwbHVnaW4iLCJsYXN0UGx1Z2luIiwicG9zdGNzc1BsdWdpbiIsIndhcm5pbmciLCJwdXNoIiwid2FybmluZ3MiLCJmaWx0ZXIiLCJpIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBY01BLE07O0FBRUY7Ozs7OztBQU1BLGtCQUFZQyxTQUFaLEVBQXVCQyxJQUF2QixFQUE2QkMsSUFBN0IsRUFBbUM7QUFBQTs7QUFDL0I7Ozs7Ozs7Ozs7O0FBV0EsU0FBS0YsU0FBTCxHQUFpQkEsU0FBakI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQUtHLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQTs7Ozs7O0FBTUEsU0FBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7Ozs7Ozs7O0FBUUEsU0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7Ozs7OztBQU1BLFNBQUtFLEdBQUwsR0FBV0MsU0FBWDtBQUNBOzs7Ozs7Ozs7Ozs7OztBQWNBLFNBQUtDLEdBQUwsR0FBV0QsU0FBWDtBQUNIOztBQUVEOzs7Ozs7Ozs7O21CQVFBRSxRLHVCQUFXO0FBQ1AsV0FBTyxLQUFLSCxHQUFaO0FBQ0gsRzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQWdCQUksSSxpQkFBS0MsSSxFQUFrQjtBQUFBLFFBQVpQLElBQVksdUVBQUwsRUFBSzs7QUFDbkIsUUFBSyxDQUFDQSxLQUFLUSxNQUFYLEVBQW9CO0FBQ2hCLFVBQUssS0FBS0MsVUFBTCxJQUFtQixLQUFLQSxVQUFMLENBQWdCQyxhQUF4QyxFQUF3RDtBQUNwRFYsYUFBS1EsTUFBTCxHQUFjLEtBQUtDLFVBQUwsQ0FBZ0JDLGFBQTlCO0FBQ0g7QUFDSjs7QUFFRCxRQUFJQyxVQUFVLHNCQUFZSixJQUFaLEVBQWtCUCxJQUFsQixDQUFkO0FBQ0EsU0FBS0MsUUFBTCxDQUFjVyxJQUFkLENBQW1CRCxPQUFuQjs7QUFFQSxXQUFPQSxPQUFQO0FBQ0gsRzs7QUFFRDs7Ozs7Ozs7Ozs7OzttQkFXQUUsUSx1QkFBVztBQUNQLFdBQU8sS0FBS1osUUFBTCxDQUFjYSxNQUFkLENBQXNCO0FBQUEsYUFBS0MsRUFBRUMsSUFBRixLQUFXLFNBQWhCO0FBQUEsS0FBdEIsQ0FBUDtBQUNILEc7O0FBRUQ7Ozs7Ozs7Ozs7Ozt3QkFRYztBQUNWLGFBQU8sS0FBS2QsR0FBWjtBQUNIOzs7Ozs7a0JBSVVMLE07O0FBRWYiLCJmaWxlIjoicmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdhcm5pbmcgZnJvbSAnLi93YXJuaW5nJztcblxuLyoqXG4gKiBQcm92aWRlcyB0aGUgcmVzdWx0IG9mIHRoZSBQb3N0Q1NTIHRyYW5zZm9ybWF0aW9ucy5cbiAqXG4gKiBBIFJlc3VsdCBpbnN0YW5jZSBpcyByZXR1cm5lZCBieSB7QGxpbmsgTGF6eVJlc3VsdCN0aGVufVxuICogb3Ige0BsaW5rIFJvb3QjdG9SZXN1bHR9IG1ldGhvZHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIHBvc3Rjc3MoW2Nzc25leHRdKS5wcm9jZXNzKGNzcykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gKiAgICBjb25zb2xlLmxvZyhyZXN1bHQuY3NzKTtcbiAqIH0pO1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVzdWx0MiA9IHBvc3Rjc3MucGFyc2UoY3NzKS50b1Jlc3VsdCgpO1xuICovXG5jbGFzcyBSZXN1bHQge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQcm9jZXNzb3J9IHByb2Nlc3NvciAtIHByb2Nlc3NvciB1c2VkIGZvciB0aGlzIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um9vdH0gICAgICByb290ICAgICAgLSBSb290IG5vZGUgYWZ0ZXIgYWxsIHRyYW5zZm9ybWF0aW9ucy5cbiAgICAgKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBvcHRzIC0gb3B0aW9ucyBmcm9tIHRoZSB7QGxpbmsgUHJvY2Vzc29yI3Byb2Nlc3N9XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIHtAbGluayBSb290I3RvUmVzdWx0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByb2Nlc3Nvciwgcm9vdCwgb3B0cykge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UHJvY2Vzc29yfSAtIFRoZSBQcm9jZXNzb3IgaW5zdGFuY2UgdXNlZFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgZm9yIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGZvciAoIGxldCBwbHVnaW4gb2YgcmVzdWx0LnByb2Nlc3Nvci5wbHVnaW5zKSB7XG4gICAgICAgICAqICAgaWYgKCBwbHVnaW4ucG9zdGNzc1BsdWdpbiA9PT0gJ3Bvc3Rjc3MtYmFkJyApIHtcbiAgICAgICAgICogICAgIHRocm93ICdwb3N0Y3NzLWdvb2QgaXMgaW5jb21wYXRpYmxlIHdpdGggcG9zdGNzcy1iYWQnO1xuICAgICAgICAgKiAgIH1cbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByb2Nlc3NvciA9IHByb2Nlc3NvcjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge01lc3NhZ2VbXX0gLSBDb250YWlucyBtZXNzYWdlcyBmcm9tIHBsdWdpbnNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIChlLmcuLCB3YXJuaW5ncyBvciBjdXN0b20gbWVzc2FnZXMpLlxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgRWFjaCBtZXNzYWdlIHNob3VsZCBoYXZlIHR5cGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIGFuZCBwbHVnaW4gcHJvcGVydGllcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcG9zdGNzcy5wbHVnaW4oJ3Bvc3Rjc3MtbWluLWJyb3dzZXInLCAoKSA9PiB7XG4gICAgICAgICAqICAgcmV0dXJuIChyb290LCByZXN1bHQpID0+IHtcbiAgICAgICAgICogICAgIHZhciBicm93c2VycyA9IGRldGVjdE1pbkJyb3dzZXJzQnlDYW5JVXNlKHJvb3QpO1xuICAgICAgICAgKiAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgKiAgICAgICB0eXBlOiAgICAnbWluLWJyb3dzZXInLFxuICAgICAgICAgKiAgICAgICBwbHVnaW46ICAncG9zdGNzcy1taW4tYnJvd3NlcicsXG4gICAgICAgICAqICAgICAgIGJyb3dzZXJzOiBicm93c2Vyc1xuICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAqICAgfTtcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtSb290fSAtIFJvb3Qgbm9kZSBhZnRlciBhbGwgdHJhbnNmb3JtYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiByb290LnRvUmVzdWx0KCkucm9vdCA9PSByb290O1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3Byb2Nlc3NPcHRpb25zfSAtIE9wdGlvbnMgZnJvbSB0aGUge0BsaW5rIFByb2Nlc3NvciNwcm9jZXNzfVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciB7QGxpbmsgUm9vdCN0b1Jlc3VsdH0gY2FsbFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IHByb2R1Y2VkIHRoaXMgUmVzdWx0IGluc3RhbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiByb290LnRvUmVzdWx0KG9wdHMpLm9wdHMgPT0gb3B0cztcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gQSBDU1Mgc3RyaW5nIHJlcHJlc2VudGluZyBvZiB7QGxpbmsgUmVzdWx0I3Jvb3R9LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBwb3N0Y3NzLnBhcnNlKCdhe30nKS50b1Jlc3VsdCgpLmNzcyAvLz0+IFwiYXt9XCJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3NzID0gdW5kZWZpbmVkO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7U291cmNlTWFwR2VuZXJhdG9yfSAtIEFuIGluc3RhbmNlIG9mIGBTb3VyY2VNYXBHZW5lcmF0b3JgXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyBmcm9tIHRoZSBgc291cmNlLW1hcGAgbGlicmFyeSxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcHJlc2VudGluZyBjaGFuZ2VzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byB0aGUge0BsaW5rIFJlc3VsdCNyb290fSBpbnN0YW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcmVzdWx0Lm1hcC50b0pTT04oKSAvLz0+IHsgdmVyc2lvbjogMywgZmlsZTogJ2EuY3NzJywg4oCmIH1cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogaWYgKCByZXN1bHQubWFwICkge1xuICAgICAgICAgKiAgIGZzLndyaXRlRmlsZVN5bmMocmVzdWx0Lm9wdHMudG8gKyAnLm1hcCcsIHJlc3VsdC5tYXAudG9TdHJpbmcoKSk7XG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWFwID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZm9yIEB7bGluayBSZXN1bHQjY3NzfSBjb250ZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByZXN1bHQgKyAnJyA9PT0gcmVzdWx0LmNzc1xuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50aW5nIG9mIHtAbGluayBSZXN1bHQjcm9vdH1cbiAgICAgKi9cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3NzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIFdhcm5pbmd9IGFuZCBhZGRzIGl0XG4gICAgICogdG8ge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAgICAgICAgLSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHNdICAgICAgLSB3YXJuaW5nIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgb3B0cy5ub2RlICAgLSBDU1Mgbm9kZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLndvcmQgICAtIHdvcmQgaW4gQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRzLmluZGV4ICAtIGluZGV4IGluIENTUyBub2RlIHN0cmluZyB0aGF0IGNhdXNlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB3YXJuaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMucGx1Z2luIC0gbmFtZSBvZiB0aGUgcGx1Z2luIHRoYXQgY3JlYXRlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgd2FybmluZy4ge0BsaW5rIFJlc3VsdCN3YXJufSBmaWxsc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgcHJvcGVydHkgYXV0b21hdGljYWxseS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dhcm5pbmd9IGNyZWF0ZWQgd2FybmluZ1xuICAgICAqL1xuICAgIHdhcm4odGV4dCwgb3B0cyA9IHsgfSkge1xuICAgICAgICBpZiAoICFvcHRzLnBsdWdpbiApIHtcbiAgICAgICAgICAgIGlmICggdGhpcy5sYXN0UGx1Z2luICYmIHRoaXMubGFzdFBsdWdpbi5wb3N0Y3NzUGx1Z2luICkge1xuICAgICAgICAgICAgICAgIG9wdHMucGx1Z2luID0gdGhpcy5sYXN0UGx1Z2luLnBvc3Rjc3NQbHVnaW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd2FybmluZyA9IG5ldyBXYXJuaW5nKHRleHQsIG9wdHMpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2god2FybmluZyk7XG5cbiAgICAgICAgcmV0dXJuIHdhcm5pbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3YXJuaW5ncyBmcm9tIHBsdWdpbnMuIEZpbHRlcnMge0BsaW5rIFdhcm5pbmd9IGluc3RhbmNlc1xuICAgICAqIGZyb20ge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJlc3VsdC53YXJuaW5ncygpLmZvckVhY2god2FybiA9PiB7XG4gICAgICogICBjb25zb2xlLndhcm4od2Fybi50b1N0cmluZygpKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dhcm5pbmdbXX0gd2FybmluZ3MgZnJvbSBwbHVnaW5zXG4gICAgICovXG4gICAgd2FybmluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzLmZpbHRlciggaSA9PiBpLnR5cGUgPT09ICd3YXJuaW5nJyApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFsaWFzIGZvciB0aGUge0BsaW5rIFJlc3VsdCNjc3N9IHByb3BlcnR5LlxuICAgICAqIFVzZSBpdCB3aXRoIHN5bnRheGVzIHRoYXQgZ2VuZXJhdGUgbm9uLUNTUyBvdXRwdXQuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcmVzdWx0LmNzcyA9PT0gcmVzdWx0LmNvbnRlbnQ7XG4gICAgICovXG4gICAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNzcztcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzdWx0O1xuXG4vKipcbiAqIEB0eXBlZGVmICB7b2JqZWN0fSBNZXNzYWdlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSAgIC0gbWVzc2FnZSB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGx1Z2luIC0gc291cmNlIFBvc3RDU1MgcGx1Z2luIG5hbWVcbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Represents a plugin’s warning. It can be created using {@link Node#warn}.
	 *
	 * @example
	 * if ( decl.important ) {
	 *     decl.warn(result, 'Avoid !important', { word: '!important' });
	 * }
	 */
	var Warning = function () {
	
	  /**
	   * @param {string} text        - warning message
	   * @param {Object} [opts]      - warning options
	   * @param {Node}   opts.node   - CSS node that caused the warning
	   * @param {string} opts.word   - word in CSS source that caused the warning
	   * @param {number} opts.index  - index in CSS node string that caused
	   *                               the warning
	   * @param {string} opts.plugin - name of the plugin that created
	   *                               this warning. {@link Result#warn} fills
	   *                               this property automatically.
	   */
	  function Warning(text) {
	    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    _classCallCheck(this, Warning);
	
	    /**
	     * @member {string} - Type to filter warnings from
	     *                    {@link Result#messages}. Always equal
	     *                    to `"warning"`.
	     *
	     * @example
	     * const nonWarning = result.messages.filter(i => i.type !== 'warning')
	     */
	    this.type = 'warning';
	    /**
	     * @member {string} - The warning message.
	     *
	     * @example
	     * warning.text //=> 'Try to avoid !important'
	     */
	    this.text = text;
	
	    if (opts.node && opts.node.source) {
	      var pos = opts.node.positionBy(opts);
	      /**
	       * @member {number} - Line in the input file
	       *                    with this warning’s source
	       *
	       * @example
	       * warning.line //=> 5
	       */
	      this.line = pos.line;
	      /**
	       * @member {number} - Column in the input file
	       *                    with this warning’s source.
	       *
	       * @example
	       * warning.column //=> 6
	       */
	      this.column = pos.column;
	    }
	
	    for (var opt in opts) {
	      this[opt] = opts[opt];
	    }
	  }
	
	  /**
	   * Returns a warning position and message.
	   *
	   * @example
	   * warning.toString() //=> 'postcss-lint:a.css:10:14: Avoid !important'
	   *
	   * @return {string} warning position and message
	   */
	
	
	  Warning.prototype.toString = function toString() {
	    if (this.node) {
	      return this.node.error(this.text, {
	        plugin: this.plugin,
	        index: this.index,
	        word: this.word
	      }).message;
	    } else if (this.plugin) {
	      return this.plugin + ': ' + this.text;
	    } else {
	      return this.text;
	    }
	  };
	
	  /**
	   * @memberof Warning#
	   * @member {string} plugin - The name of the plugin that created
	   *                           it will fill this property automatically.
	   *                           this warning. When you call {@link Node#warn}
	   *
	   * @example
	   * warning.plugin //=> 'postcss-important'
	   */
	
	  /**
	   * @memberof Warning#
	   * @member {Node} node - Contains the CSS node that caused the warning.
	   *
	   * @example
	   * warning.node.toString() //=> 'color: white !important'
	   */
	
	  return Warning;
	}();
	
	exports.default = Warning;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhcm5pbmcuZXM2Il0sIm5hbWVzIjpbIldhcm5pbmciLCJ0ZXh0Iiwib3B0cyIsInR5cGUiLCJub2RlIiwic291cmNlIiwicG9zIiwicG9zaXRpb25CeSIsImxpbmUiLCJjb2x1bW4iLCJvcHQiLCJ0b1N0cmluZyIsImVycm9yIiwicGx1Z2luIiwiaW5kZXgiLCJ3b3JkIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0lBUU1BLE87O0FBRUY7Ozs7Ozs7Ozs7O0FBV0EsbUJBQVlDLElBQVosRUFBOEI7QUFBQSxRQUFaQyxJQUFZLHVFQUFMLEVBQUs7O0FBQUE7O0FBQzFCOzs7Ozs7OztBQVFBLFNBQUtDLElBQUwsR0FBWSxTQUFaO0FBQ0E7Ozs7OztBQU1BLFNBQUtGLElBQUwsR0FBWUEsSUFBWjs7QUFFQSxRQUFLQyxLQUFLRSxJQUFMLElBQWFGLEtBQUtFLElBQUwsQ0FBVUMsTUFBNUIsRUFBcUM7QUFDakMsVUFBSUMsTUFBVUosS0FBS0UsSUFBTCxDQUFVRyxVQUFWLENBQXFCTCxJQUFyQixDQUFkO0FBQ0E7Ozs7Ozs7QUFPQSxXQUFLTSxJQUFMLEdBQWNGLElBQUlFLElBQWxCO0FBQ0E7Ozs7Ozs7QUFPQSxXQUFLQyxNQUFMLEdBQWNILElBQUlHLE1BQWxCO0FBQ0g7O0FBRUQsU0FBTSxJQUFJQyxHQUFWLElBQWlCUixJQUFqQjtBQUF3QixXQUFLUSxHQUFMLElBQVlSLEtBQUtRLEdBQUwsQ0FBWjtBQUF4QjtBQUNIOztBQUVEOzs7Ozs7Ozs7O29CQVFBQyxRLHVCQUFXO0FBQ1AsUUFBSyxLQUFLUCxJQUFWLEVBQWlCO0FBQ2IsYUFBTyxLQUFLQSxJQUFMLENBQVVRLEtBQVYsQ0FBZ0IsS0FBS1gsSUFBckIsRUFBMkI7QUFDOUJZLGdCQUFRLEtBQUtBLE1BRGlCO0FBRTlCQyxlQUFRLEtBQUtBLEtBRmlCO0FBRzlCQyxjQUFRLEtBQUtBO0FBSGlCLE9BQTNCLEVBSUpDLE9BSkg7QUFLSCxLQU5ELE1BTU8sSUFBSyxLQUFLSCxNQUFWLEVBQW1CO0FBQ3RCLGFBQU8sS0FBS0EsTUFBTCxHQUFjLElBQWQsR0FBcUIsS0FBS1osSUFBakM7QUFDSCxLQUZNLE1BRUE7QUFDSCxhQUFPLEtBQUtBLElBQVo7QUFDSDtBQUNKLEc7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7a0JBVVdELE8iLCJmaWxlIjoid2FybmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmVwcmVzZW50cyBhIHBsdWdpbuKAmXMgd2FybmluZy4gSXQgY2FuIGJlIGNyZWF0ZWQgdXNpbmcge0BsaW5rIE5vZGUjd2Fybn0uXG4gKlxuICogQGV4YW1wbGVcbiAqIGlmICggZGVjbC5pbXBvcnRhbnQgKSB7XG4gKiAgICAgZGVjbC53YXJuKHJlc3VsdCwgJ0F2b2lkICFpbXBvcnRhbnQnLCB7IHdvcmQ6ICchaW1wb3J0YW50JyB9KTtcbiAqIH1cbiAqL1xuY2xhc3MgV2FybmluZyB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAgICAgICAgLSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHNdICAgICAgLSB3YXJuaW5nIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgb3B0cy5ub2RlICAgLSBDU1Mgbm9kZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLndvcmQgICAtIHdvcmQgaW4gQ1NTIHNvdXJjZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRzLmluZGV4ICAtIGluZGV4IGluIENTUyBub2RlIHN0cmluZyB0aGF0IGNhdXNlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB3YXJuaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdHMucGx1Z2luIC0gbmFtZSBvZiB0aGUgcGx1Z2luIHRoYXQgY3JlYXRlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgd2FybmluZy4ge0BsaW5rIFJlc3VsdCN3YXJufSBmaWxsc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgcHJvcGVydHkgYXV0b21hdGljYWxseS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0LCBvcHRzID0geyB9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gVHlwZSB0byBmaWx0ZXIgd2FybmluZ3MgZnJvbVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAge0BsaW5rIFJlc3VsdCNtZXNzYWdlc30uIEFsd2F5cyBlcXVhbFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgdG8gYFwid2FybmluZ1wiYC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY29uc3Qgbm9uV2FybmluZyA9IHJlc3VsdC5tZXNzYWdlcy5maWx0ZXIoaSA9PiBpLnR5cGUgIT09ICd3YXJuaW5nJylcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9ICd3YXJuaW5nJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiB3YXJuaW5nLnRleHQgLy89PiAnVHJ5IHRvIGF2b2lkICFpbXBvcnRhbnQnXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgIGlmICggb3B0cy5ub2RlICYmIG9wdHMubm9kZS5zb3VyY2UgKSB7XG4gICAgICAgICAgICBsZXQgcG9zICAgICA9IG9wdHMubm9kZS5wb3NpdGlvbkJ5KG9wdHMpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gTGluZSBpbiB0aGUgaW5wdXQgZmlsZVxuICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgIHdpdGggdGhpcyB3YXJuaW5n4oCZcyBzb3VyY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogd2FybmluZy5saW5lIC8vPT4gNVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmxpbmUgICA9IHBvcy5saW5lO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IC0gQ29sdW1uIGluIHRoZSBpbnB1dCBmaWxlXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGlzIHdhcm5pbmfigJlzIHNvdXJjZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogd2FybmluZy5jb2x1bW4gLy89PiA2XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY29sdW1uID0gcG9zLmNvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBvcHQgaW4gb3B0cyApIHRoaXNbb3B0XSA9IG9wdHNbb3B0XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgd2FybmluZyBwb3NpdGlvbiBhbmQgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogd2FybmluZy50b1N0cmluZygpIC8vPT4gJ3Bvc3Rjc3MtbGludDphLmNzczoxMDoxNDogQXZvaWQgIWltcG9ydGFudCdcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gd2FybmluZyBwb3NpdGlvbiBhbmQgbWVzc2FnZVxuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBpZiAoIHRoaXMubm9kZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUuZXJyb3IodGhpcy50ZXh0LCB7XG4gICAgICAgICAgICAgICAgcGx1Z2luOiB0aGlzLnBsdWdpbixcbiAgICAgICAgICAgICAgICBpbmRleDogIHRoaXMuaW5kZXgsXG4gICAgICAgICAgICAgICAgd29yZDogICB0aGlzLndvcmRcbiAgICAgICAgICAgIH0pLm1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMucGx1Z2luICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luICsgJzogJyArIHRoaXMudGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgV2FybmluZyNcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHBsdWdpbiAtIFRoZSBuYW1lIG9mIHRoZSBwbHVnaW4gdGhhdCBjcmVhdGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBpdCB3aWxsIGZpbGwgdGhpcyBwcm9wZXJ0eSBhdXRvbWF0aWNhbGx5LlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyB3YXJuaW5nLiBXaGVuIHlvdSBjYWxsIHtAbGluayBOb2RlI3dhcm59XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHdhcm5pbmcucGx1Z2luIC8vPT4gJ3Bvc3Rjc3MtaW1wb3J0YW50J1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFdhcm5pbmcjXG4gICAgICogQG1lbWJlciB7Tm9kZX0gbm9kZSAtIENvbnRhaW5zIHRoZSBDU1Mgbm9kZSB0aGF0IGNhdXNlZCB0aGUgd2FybmluZy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogd2FybmluZy5ub2RlLnRvU3RyaW5nKCkgLy89PiAnY29sb3I6IHdoaXRlICFpbXBvcnRhbnQnXG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2FybmluZztcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = parse;
	
	var _parser = __webpack_require__(46);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	var _input = __webpack_require__(18);
	
	var _input2 = _interopRequireDefault(_input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function parse(css, opts) {
	    if (opts && opts.safe) {
	        throw new Error('Option safe was removed. ' + 'Use parser: require("postcss-safe-parser")');
	    }
	
	    var input = new _input2.default(css, opts);
	
	    var parser = new _parser2.default(input);
	    try {
	        parser.tokenize();
	        parser.loop();
	    } catch (e) {
	        if (e.name === 'CssSyntaxError' && opts && opts.from) {
	            if (/\.scss$/i.test(opts.from)) {
	                e.message += '\nYou tried to parse SCSS with ' + 'the standard CSS parser; ' + 'try again with the postcss-scss parser';
	            } else if (/\.less$/i.test(opts.from)) {
	                e.message += '\nYou tried to parse Less with ' + 'the standard CSS parser; ' + 'try again with the postcss-less parser';
	            }
	        }
	        throw e;
	    }
	
	    return parser.root;
	}
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlLmVzNiJdLCJuYW1lcyI6WyJwYXJzZSIsImNzcyIsIm9wdHMiLCJzYWZlIiwiRXJyb3IiLCJpbnB1dCIsInBhcnNlciIsInRva2VuaXplIiwibG9vcCIsImUiLCJuYW1lIiwiZnJvbSIsInRlc3QiLCJtZXNzYWdlIiwicm9vdCJdLCJtYXBwaW5ncyI6Ijs7O2tCQUd3QkEsSzs7QUFIeEI7Ozs7QUFDQTs7Ozs7O0FBRWUsU0FBU0EsS0FBVCxDQUFlQyxHQUFmLEVBQW9CQyxJQUFwQixFQUEwQjtBQUNyQyxRQUFLQSxRQUFRQSxLQUFLQyxJQUFsQixFQUF5QjtBQUNyQixjQUFNLElBQUlDLEtBQUosQ0FBVSw4QkFDQSw0Q0FEVixDQUFOO0FBRUg7O0FBRUQsUUFBSUMsUUFBUSxvQkFBVUosR0FBVixFQUFlQyxJQUFmLENBQVo7O0FBRUEsUUFBSUksU0FBUyxxQkFBV0QsS0FBWCxDQUFiO0FBQ0EsUUFBSTtBQUNBQyxlQUFPQyxRQUFQO0FBQ0FELGVBQU9FLElBQVA7QUFDSCxLQUhELENBR0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1IsWUFBS0EsRUFBRUMsSUFBRixLQUFXLGdCQUFYLElBQStCUixJQUEvQixJQUF1Q0EsS0FBS1MsSUFBakQsRUFBd0Q7QUFDcEQsZ0JBQUssV0FBV0MsSUFBWCxDQUFnQlYsS0FBS1MsSUFBckIsQ0FBTCxFQUFrQztBQUM5QkYsa0JBQUVJLE9BQUYsSUFBYSxvQ0FDQSwyQkFEQSxHQUVBLHdDQUZiO0FBR0gsYUFKRCxNQUlPLElBQUssV0FBV0QsSUFBWCxDQUFnQlYsS0FBS1MsSUFBckIsQ0FBTCxFQUFrQztBQUNyQ0Ysa0JBQUVJLE9BQUYsSUFBYSxvQ0FDQSwyQkFEQSxHQUVBLHdDQUZiO0FBR0g7QUFDSjtBQUNELGNBQU1KLENBQU47QUFDSDs7QUFFRCxXQUFPSCxPQUFPUSxJQUFkO0FBQ0giLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFyc2VyIGZyb20gJy4vcGFyc2VyJztcbmltcG9ydCBJbnB1dCAgZnJvbSAnLi9pbnB1dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGNzcywgb3B0cykge1xuICAgIGlmICggb3B0cyAmJiBvcHRzLnNhZmUgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT3B0aW9uIHNhZmUgd2FzIHJlbW92ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSBwYXJzZXI6IHJlcXVpcmUoXCJwb3N0Y3NzLXNhZmUtcGFyc2VyXCIpJyk7XG4gICAgfVxuXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KGNzcywgb3B0cyk7XG5cbiAgICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcihpbnB1dCk7XG4gICAgdHJ5IHtcbiAgICAgICAgcGFyc2VyLnRva2VuaXplKCk7XG4gICAgICAgIHBhcnNlci5sb29wKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIGUubmFtZSA9PT0gJ0Nzc1N5bnRheEVycm9yJyAmJiBvcHRzICYmIG9wdHMuZnJvbSApIHtcbiAgICAgICAgICAgIGlmICggL1xcLnNjc3MkL2kudGVzdChvcHRzLmZyb20pICkge1xuICAgICAgICAgICAgICAgIGUubWVzc2FnZSArPSAnXFxuWW91IHRyaWVkIHRvIHBhcnNlIFNDU1Mgd2l0aCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RoZSBzdGFuZGFyZCBDU1MgcGFyc2VyOyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RyeSBhZ2FpbiB3aXRoIHRoZSBwb3N0Y3NzLXNjc3MgcGFyc2VyJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIC9cXC5sZXNzJC9pLnRlc3Qob3B0cy5mcm9tKSApIHtcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2UgKz0gJ1xcbllvdSB0cmllZCB0byBwYXJzZSBMZXNzIHdpdGggJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aGUgc3RhbmRhcmQgQ1NTIHBhcnNlcjsgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cnkgYWdhaW4gd2l0aCB0aGUgcG9zdGNzcy1sZXNzIHBhcnNlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VyLnJvb3Q7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _declaration = __webpack_require__(2);
	
	var _declaration2 = _interopRequireDefault(_declaration);
	
	var _tokenize = __webpack_require__(17);
	
	var _tokenize2 = _interopRequireDefault(_tokenize);
	
	var _comment = __webpack_require__(47);
	
	var _comment2 = _interopRequireDefault(_comment);
	
	var _atRule = __webpack_require__(48);
	
	var _atRule2 = _interopRequireDefault(_atRule);
	
	var _root = __webpack_require__(52);
	
	var _root2 = _interopRequireDefault(_root);
	
	var _rule = __webpack_require__(50);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Parser = function () {
	    function Parser(input) {
	        _classCallCheck(this, Parser);
	
	        this.input = input;
	
	        this.pos = 0;
	        this.root = new _root2.default();
	        this.current = this.root;
	        this.spaces = '';
	        this.semicolon = false;
	
	        this.root.source = { input: input, start: { line: 1, column: 1 } };
	    }
	
	    Parser.prototype.tokenize = function tokenize() {
	        this.tokens = (0, _tokenize2.default)(this.input);
	    };
	
	    Parser.prototype.loop = function loop() {
	        var token = void 0;
	        while (this.pos < this.tokens.length) {
	            token = this.tokens[this.pos];
	
	            switch (token[0]) {
	
	                case 'space':
	                case ';':
	                    this.spaces += token[1];
	                    break;
	
	                case '}':
	                    this.end(token);
	                    break;
	
	                case 'comment':
	                    this.comment(token);
	                    break;
	
	                case 'at-word':
	                    this.atrule(token);
	                    break;
	
	                case '{':
	                    this.emptyRule(token);
	                    break;
	
	                default:
	                    this.other();
	                    break;
	            }
	
	            this.pos += 1;
	        }
	        this.endFile();
	    };
	
	    Parser.prototype.comment = function comment(token) {
	        var node = new _comment2.default();
	        this.init(node, token[2], token[3]);
	        node.source.end = { line: token[4], column: token[5] };
	
	        var text = token[1].slice(2, -2);
	        if (/^\s*$/.test(text)) {
	            node.text = '';
	            node.raws.left = text;
	            node.raws.right = '';
	        } else {
	            var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
	            node.text = match[2];
	            node.raws.left = match[1];
	            node.raws.right = match[3];
	        }
	    };
	
	    Parser.prototype.emptyRule = function emptyRule(token) {
	        var node = new _rule2.default();
	        this.init(node, token[2], token[3]);
	        node.selector = '';
	        node.raws.between = '';
	        this.current = node;
	    };
	
	    Parser.prototype.other = function other() {
	        var token = void 0;
	        var end = false;
	        var type = null;
	        var colon = false;
	        var bracket = null;
	        var brackets = [];
	
	        var start = this.pos;
	        while (this.pos < this.tokens.length) {
	            token = this.tokens[this.pos];
	            type = token[0];
	
	            if (type === '(' || type === '[') {
	                if (!bracket) bracket = token;
	                brackets.push(type === '(' ? ')' : ']');
	            } else if (brackets.length === 0) {
	                if (type === ';') {
	                    if (colon) {
	                        this.decl(this.tokens.slice(start, this.pos + 1));
	                        return;
	                    } else {
	                        break;
	                    }
	                } else if (type === '{') {
	                    this.rule(this.tokens.slice(start, this.pos + 1));
	                    return;
	                } else if (type === '}') {
	                    this.pos -= 1;
	                    end = true;
	                    break;
	                } else if (type === ':') {
	                    colon = true;
	                }
	            } else if (type === brackets[brackets.length - 1]) {
	                brackets.pop();
	                if (brackets.length === 0) bracket = null;
	            }
	
	            this.pos += 1;
	        }
	        if (this.pos === this.tokens.length) {
	            this.pos -= 1;
	            end = true;
	        }
	
	        if (brackets.length > 0) this.unclosedBracket(bracket);
	
	        if (end && colon) {
	            while (this.pos > start) {
	                token = this.tokens[this.pos][0];
	                if (token !== 'space' && token !== 'comment') break;
	                this.pos -= 1;
	            }
	            this.decl(this.tokens.slice(start, this.pos + 1));
	            return;
	        }
	
	        this.unknownWord(start);
	    };
	
	    Parser.prototype.rule = function rule(tokens) {
	        tokens.pop();
	
	        var node = new _rule2.default();
	        this.init(node, tokens[0][2], tokens[0][3]);
	
	        node.raws.between = this.spacesFromEnd(tokens);
	        this.raw(node, 'selector', tokens);
	        this.current = node;
	    };
	
	    Parser.prototype.decl = function decl(tokens) {
	        var node = new _declaration2.default();
	        this.init(node);
	
	        var last = tokens[tokens.length - 1];
	        if (last[0] === ';') {
	            this.semicolon = true;
	            tokens.pop();
	        }
	        if (last[4]) {
	            node.source.end = { line: last[4], column: last[5] };
	        } else {
	            node.source.end = { line: last[2], column: last[3] };
	        }
	
	        while (tokens[0][0] !== 'word') {
	            node.raws.before += tokens.shift()[1];
	        }
	        node.source.start = { line: tokens[0][2], column: tokens[0][3] };
	
	        node.prop = '';
	        while (tokens.length) {
	            var type = tokens[0][0];
	            if (type === ':' || type === 'space' || type === 'comment') {
	                break;
	            }
	            node.prop += tokens.shift()[1];
	        }
	
	        node.raws.between = '';
	
	        var token = void 0;
	        while (tokens.length) {
	            token = tokens.shift();
	
	            if (token[0] === ':') {
	                node.raws.between += token[1];
	                break;
	            } else {
	                node.raws.between += token[1];
	            }
	        }
	
	        if (node.prop[0] === '_' || node.prop[0] === '*') {
	            node.raws.before += node.prop[0];
	            node.prop = node.prop.slice(1);
	        }
	        node.raws.between += this.spacesFromStart(tokens);
	        this.precheckMissedSemicolon(tokens);
	
	        for (var i = tokens.length - 1; i > 0; i--) {
	            token = tokens[i];
	            if (token[1] === '!important') {
	                node.important = true;
	                var string = this.stringFrom(tokens, i);
	                string = this.spacesFromEnd(tokens) + string;
	                if (string !== ' !important') node.raws.important = string;
	                break;
	            } else if (token[1] === 'important') {
	                var cache = tokens.slice(0);
	                var str = '';
	                for (var j = i; j > 0; j--) {
	                    var _type = cache[j][0];
	                    if (str.trim().indexOf('!') === 0 && _type !== 'space') {
	                        break;
	                    }
	                    str = cache.pop()[1] + str;
	                }
	                if (str.trim().indexOf('!') === 0) {
	                    node.important = true;
	                    node.raws.important = str;
	                    tokens = cache;
	                }
	            }
	
	            if (token[0] !== 'space' && token[0] !== 'comment') {
	                break;
	            }
	        }
	
	        this.raw(node, 'value', tokens);
	
	        if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
	    };
	
	    Parser.prototype.atrule = function atrule(token) {
	        var node = new _atRule2.default();
	        node.name = token[1].slice(1);
	        if (node.name === '') {
	            this.unnamedAtrule(node, token);
	        }
	        this.init(node, token[2], token[3]);
	
	        var last = false;
	        var open = false;
	        var params = [];
	
	        this.pos += 1;
	        while (this.pos < this.tokens.length) {
	            token = this.tokens[this.pos];
	
	            if (token[0] === ';') {
	                node.source.end = { line: token[2], column: token[3] };
	                this.semicolon = true;
	                break;
	            } else if (token[0] === '{') {
	                open = true;
	                break;
	            } else if (token[0] === '}') {
	                this.end(token);
	                break;
	            } else {
	                params.push(token);
	            }
	
	            this.pos += 1;
	        }
	        if (this.pos === this.tokens.length) {
	            last = true;
	        }
	
	        node.raws.between = this.spacesFromEnd(params);
	        if (params.length) {
	            node.raws.afterName = this.spacesFromStart(params);
	            this.raw(node, 'params', params);
	            if (last) {
	                token = params[params.length - 1];
	                node.source.end = { line: token[4], column: token[5] };
	                this.spaces = node.raws.between;
	                node.raws.between = '';
	            }
	        } else {
	            node.raws.afterName = '';
	            node.params = '';
	        }
	
	        if (open) {
	            node.nodes = [];
	            this.current = node;
	        }
	    };
	
	    Parser.prototype.end = function end(token) {
	        if (this.current.nodes && this.current.nodes.length) {
	            this.current.raws.semicolon = this.semicolon;
	        }
	        this.semicolon = false;
	
	        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	        this.spaces = '';
	
	        if (this.current.parent) {
	            this.current.source.end = { line: token[2], column: token[3] };
	            this.current = this.current.parent;
	        } else {
	            this.unexpectedClose(token);
	        }
	    };
	
	    Parser.prototype.endFile = function endFile() {
	        if (this.current.parent) this.unclosedBlock();
	        if (this.current.nodes && this.current.nodes.length) {
	            this.current.raws.semicolon = this.semicolon;
	        }
	        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	    };
	
	    // Helpers
	
	    Parser.prototype.init = function init(node, line, column) {
	        this.current.push(node);
	
	        node.source = { start: { line: line, column: column }, input: this.input };
	        node.raws.before = this.spaces;
	        this.spaces = '';
	        if (node.type !== 'comment') this.semicolon = false;
	    };
	
	    Parser.prototype.raw = function raw(node, prop, tokens) {
	        var token = void 0,
	            type = void 0;
	        var length = tokens.length;
	        var value = '';
	        var clean = true;
	        for (var i = 0; i < length; i += 1) {
	            token = tokens[i];
	            type = token[0];
	            if (type === 'comment' || type === 'space' && i === length - 1) {
	                clean = false;
	            } else {
	                value += token[1];
	            }
	        }
	        if (!clean) {
	            var raw = tokens.reduce(function (all, i) {
	                return all + i[1];
	            }, '');
	            node.raws[prop] = { value: value, raw: raw };
	        }
	        node[prop] = value;
	    };
	
	    Parser.prototype.spacesFromEnd = function spacesFromEnd(tokens) {
	        var lastTokenType = void 0;
	        var spaces = '';
	        while (tokens.length) {
	            lastTokenType = tokens[tokens.length - 1][0];
	            if (lastTokenType !== 'space' && lastTokenType !== 'comment') break;
	            spaces = tokens.pop()[1] + spaces;
	        }
	        return spaces;
	    };
	
	    Parser.prototype.spacesFromStart = function spacesFromStart(tokens) {
	        var next = void 0;
	        var spaces = '';
	        while (tokens.length) {
	            next = tokens[0][0];
	            if (next !== 'space' && next !== 'comment') break;
	            spaces += tokens.shift()[1];
	        }
	        return spaces;
	    };
	
	    Parser.prototype.stringFrom = function stringFrom(tokens, from) {
	        var result = '';
	        for (var i = from; i < tokens.length; i++) {
	            result += tokens[i][1];
	        }
	        tokens.splice(from, tokens.length - from);
	        return result;
	    };
	
	    Parser.prototype.colon = function colon(tokens) {
	        var brackets = 0;
	        var token = void 0,
	            type = void 0,
	            prev = void 0;
	        for (var i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            type = token[0];
	
	            if (type === '(') {
	                brackets += 1;
	            } else if (type === ')') {
	                brackets -= 1;
	            } else if (brackets === 0 && type === ':') {
	                if (!prev) {
	                    this.doubleColon(token);
	                } else if (prev[0] === 'word' && prev[1] === 'progid') {
	                    continue;
	                } else {
	                    return i;
	                }
	            }
	
	            prev = token;
	        }
	        return false;
	    };
	
	    // Errors
	
	    Parser.prototype.unclosedBracket = function unclosedBracket(bracket) {
	        throw this.input.error('Unclosed bracket', bracket[2], bracket[3]);
	    };
	
	    Parser.prototype.unknownWord = function unknownWord(start) {
	        var token = this.tokens[start];
	        throw this.input.error('Unknown word', token[2], token[3]);
	    };
	
	    Parser.prototype.unexpectedClose = function unexpectedClose(token) {
	        throw this.input.error('Unexpected }', token[2], token[3]);
	    };
	
	    Parser.prototype.unclosedBlock = function unclosedBlock() {
	        var pos = this.current.source.start;
	        throw this.input.error('Unclosed block', pos.line, pos.column);
	    };
	
	    Parser.prototype.doubleColon = function doubleColon(token) {
	        throw this.input.error('Double colon', token[2], token[3]);
	    };
	
	    Parser.prototype.unnamedAtrule = function unnamedAtrule(node, token) {
	        throw this.input.error('At-rule without name', token[2], token[3]);
	    };
	
	    Parser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
	        // Hook for Safe Parser
	        tokens;
	    };
	
	    Parser.prototype.checkMissedSemicolon = function checkMissedSemicolon(tokens) {
	        var colon = this.colon(tokens);
	        if (colon === false) return;
	
	        var founded = 0;
	        var token = void 0;
	        for (var j = colon - 1; j >= 0; j--) {
	            token = tokens[j];
	            if (token[0] !== 'space') {
	                founded += 1;
	                if (founded === 2) break;
	            }
	        }
	        throw this.input.error('Missed semicolon', token[2], token[3]);
	    };
	
	    return Parser;
	}();
	
	exports.default = Parser;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOlsiUGFyc2VyIiwiaW5wdXQiLCJwb3MiLCJyb290IiwiY3VycmVudCIsInNwYWNlcyIsInNlbWljb2xvbiIsInNvdXJjZSIsInN0YXJ0IiwibGluZSIsImNvbHVtbiIsInRva2VuaXplIiwidG9rZW5zIiwibG9vcCIsInRva2VuIiwibGVuZ3RoIiwiZW5kIiwiY29tbWVudCIsImF0cnVsZSIsImVtcHR5UnVsZSIsIm90aGVyIiwiZW5kRmlsZSIsIm5vZGUiLCJpbml0IiwidGV4dCIsInNsaWNlIiwidGVzdCIsInJhd3MiLCJsZWZ0IiwicmlnaHQiLCJtYXRjaCIsInNlbGVjdG9yIiwiYmV0d2VlbiIsInR5cGUiLCJjb2xvbiIsImJyYWNrZXQiLCJicmFja2V0cyIsInB1c2giLCJkZWNsIiwicnVsZSIsInBvcCIsInVuY2xvc2VkQnJhY2tldCIsInVua25vd25Xb3JkIiwic3BhY2VzRnJvbUVuZCIsInJhdyIsImxhc3QiLCJiZWZvcmUiLCJzaGlmdCIsInByb3AiLCJzcGFjZXNGcm9tU3RhcnQiLCJwcmVjaGVja01pc3NlZFNlbWljb2xvbiIsImkiLCJpbXBvcnRhbnQiLCJzdHJpbmciLCJzdHJpbmdGcm9tIiwiY2FjaGUiLCJzdHIiLCJqIiwidHJpbSIsImluZGV4T2YiLCJ2YWx1ZSIsImNoZWNrTWlzc2VkU2VtaWNvbG9uIiwibmFtZSIsInVubmFtZWRBdHJ1bGUiLCJvcGVuIiwicGFyYW1zIiwiYWZ0ZXJOYW1lIiwibm9kZXMiLCJhZnRlciIsInBhcmVudCIsInVuZXhwZWN0ZWRDbG9zZSIsInVuY2xvc2VkQmxvY2siLCJjbGVhbiIsInJlZHVjZSIsImFsbCIsImxhc3RUb2tlblR5cGUiLCJuZXh0IiwiZnJvbSIsInJlc3VsdCIsInNwbGljZSIsInByZXYiLCJkb3VibGVDb2xvbiIsImVycm9yIiwiZm91bmRlZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7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QVUsS0FBZixFQUF1Qjs7QUFFdkIsWUFBSWlELFVBQVUsQ0FBZDtBQUNBLFlBQUlyRSxjQUFKO0FBQ0EsYUFBTSxJQUFJMkMsSUFBSXZCLFFBQVEsQ0FBdEIsRUFBeUJ1QixLQUFLLENBQTlCLEVBQWlDQSxHQUFqQyxFQUF1QztBQUNuQzNDLG9CQUFRRixPQUFPNkMsQ0FBUCxDQUFSO0FBQ0EsZ0JBQUszQyxNQUFNLENBQU4sTUFBYSxPQUFsQixFQUE0QjtBQUN4QnFFLDJCQUFXLENBQVg7QUFDQSxvQkFBS0EsWUFBWSxDQUFqQixFQUFxQjtBQUN4QjtBQUNKO0FBQ0QsY0FBTSxLQUFLbEYsS0FBTCxDQUFXaUYsS0FBWCxDQUFpQixrQkFBakIsRUFBcUNwRSxNQUFNLENBQU4sQ0FBckMsRUFBK0NBLE1BQU0sQ0FBTixDQUEvQyxDQUFOO0FBQ0gsSzs7Ozs7a0JBaGRnQmQsTSIsImZpbGUiOiJwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVjbGFyYXRpb24gZnJvbSAnLi9kZWNsYXJhdGlvbic7XG5pbXBvcnQgdG9rZW5pemVyICAgZnJvbSAnLi90b2tlbml6ZSc7XG5pbXBvcnQgQ29tbWVudCAgICAgZnJvbSAnLi9jb21tZW50JztcbmltcG9ydCBBdFJ1bGUgICAgICBmcm9tICcuL2F0LXJ1bGUnO1xuaW1wb3J0IFJvb3QgICAgICAgIGZyb20gJy4vcm9vdCc7XG5pbXBvcnQgUnVsZSAgICAgICAgZnJvbSAnLi9ydWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKGlucHV0KSB7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcblxuICAgICAgICB0aGlzLnBvcyAgICAgICA9IDA7XG4gICAgICAgIHRoaXMucm9vdCAgICAgID0gbmV3IFJvb3QoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ICAgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHRoaXMuc3BhY2VzICAgID0gJyc7XG4gICAgICAgIHRoaXMuc2VtaWNvbG9uID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yb290LnNvdXJjZSA9IHsgaW5wdXQsIHN0YXJ0OiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9IH07XG4gICAgfVxuXG4gICAgdG9rZW5pemUoKSB7XG4gICAgICAgIHRoaXMudG9rZW5zID0gdG9rZW5pemVyKHRoaXMuaW5wdXQpO1xuICAgIH1cblxuICAgIGxvb3AoKSB7XG4gICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgd2hpbGUgKCB0aGlzLnBvcyA8IHRoaXMudG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbnNbdGhpcy5wb3NdO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCB0b2tlblswXSApIHtcblxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnOyc6XG4gICAgICAgICAgICAgICAgdGhpcy5zcGFjZXMgKz0gdG9rZW5bMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ30nOlxuICAgICAgICAgICAgICAgIHRoaXMuZW5kKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYXQtd29yZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5hdHJ1bGUodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgICAgICB0aGlzLmVtcHR5UnVsZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlcigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBvcyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5kRmlsZSgpO1xuICAgIH1cblxuICAgIGNvbW1lbnQodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgQ29tbWVudCgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiB0b2tlbls0XSwgY29sdW1uOiB0b2tlbls1XSB9O1xuXG4gICAgICAgIGxldCB0ZXh0ID0gdG9rZW5bMV0uc2xpY2UoMiwgLTIpO1xuICAgICAgICBpZiAoIC9eXFxzKiQvLnRlc3QodGV4dCkgKSB7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSAnJztcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IHRleHQ7XG4gICAgICAgICAgICBub2RlLnJhd3MucmlnaHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRleHQubWF0Y2goL14oXFxzKikoW15dKlteXFxzXSkoXFxzKikkLyk7XG4gICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgbm9kZS5yYXdzLnJpZ2h0ID0gbWF0Y2hbM107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbXB0eVJ1bGUodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgUnVsZSgpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgbm9kZS5zZWxlY3RvciA9ICcnO1xuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgIH1cblxuICAgIG90aGVyKCkge1xuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIGxldCBlbmQgICAgICA9IGZhbHNlO1xuICAgICAgICBsZXQgdHlwZSAgICAgPSBudWxsO1xuICAgICAgICBsZXQgY29sb24gICAgPSBmYWxzZTtcbiAgICAgICAgbGV0IGJyYWNrZXQgID0gbnVsbDtcbiAgICAgICAgbGV0IGJyYWNrZXRzID0gW107XG5cbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5wb3M7XG4gICAgICAgIHdoaWxlICggdGhpcy5wb3MgPCB0aGlzLnRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW3RoaXMucG9zXTtcbiAgICAgICAgICAgIHR5cGUgID0gdG9rZW5bMF07XG5cbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJygnIHx8IHR5cGUgPT09ICdbJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoICFicmFja2V0ICkgYnJhY2tldCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzLnB1c2godHlwZSA9PT0gJygnID8gJyknIDogJ10nKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggYnJhY2tldHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJzsnICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbG9uICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsKHRoaXMudG9rZW5zLnNsaWNlKHN0YXJ0LCB0aGlzLnBvcyArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAneycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnVsZSh0aGlzLnRva2Vucy5zbGljZShzdGFydCwgdGhpcy5wb3MgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICd9JyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09IGJyYWNrZXRzW2JyYWNrZXRzLmxlbmd0aCAtIDFdICkge1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICggYnJhY2tldHMubGVuZ3RoID09PSAwICkgYnJhY2tldCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucG9zICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0aGlzLnBvcyA9PT0gdGhpcy50b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5wb3MgLT0gMTtcbiAgICAgICAgICAgIGVuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGJyYWNrZXRzLmxlbmd0aCA+IDAgKSB0aGlzLnVuY2xvc2VkQnJhY2tldChicmFja2V0KTtcblxuICAgICAgICBpZiAoIGVuZCAmJiBjb2xvbiApIHtcbiAgICAgICAgICAgIHdoaWxlICggdGhpcy5wb3MgPiBzdGFydCApIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW3RoaXMucG9zXVswXTtcbiAgICAgICAgICAgICAgICBpZiAoIHRva2VuICE9PSAnc3BhY2UnICYmIHRva2VuICE9PSAnY29tbWVudCcgKSBicmVhaztcbiAgICAgICAgICAgICAgICB0aGlzLnBvcyAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZWNsKHRoaXMudG9rZW5zLnNsaWNlKHN0YXJ0LCB0aGlzLnBvcyArIDEpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5rbm93bldvcmQoc3RhcnQpO1xuICAgIH1cblxuICAgIHJ1bGUodG9rZW5zKSB7XG4gICAgICAgIHRva2Vucy5wb3AoKTtcblxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBSdWxlKCk7XG4gICAgICAgIHRoaXMuaW5pdChub2RlLCB0b2tlbnNbMF1bMl0sIHRva2Vuc1swXVszXSk7XG5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSB0aGlzLnNwYWNlc0Zyb21FbmQodG9rZW5zKTtcbiAgICAgICAgdGhpcy5yYXcobm9kZSwgJ3NlbGVjdG9yJywgdG9rZW5zKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbm9kZTtcbiAgICB9XG5cbiAgICBkZWNsKHRva2Vucykge1xuICAgICAgICBsZXQgbm9kZSA9IG5ldyBEZWNsYXJhdGlvbigpO1xuICAgICAgICB0aGlzLmluaXQobm9kZSk7XG5cbiAgICAgICAgbGV0IGxhc3QgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoIGxhc3RbMF0gPT09ICc7JyApIHtcbiAgICAgICAgICAgIHRoaXMuc2VtaWNvbG9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRva2Vucy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGxhc3RbNF0gKSB7XG4gICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB7IGxpbmU6IGxhc3RbNF0sIGNvbHVtbjogbGFzdFs1XSB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kID0geyBsaW5lOiBsYXN0WzJdLCBjb2x1bW46IGxhc3RbM10gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICggdG9rZW5zWzBdWzBdICE9PSAnd29yZCcgKSB7XG4gICAgICAgICAgICBub2RlLnJhd3MuYmVmb3JlICs9IHRva2Vucy5zaGlmdCgpWzFdO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuc291cmNlLnN0YXJ0ID0geyBsaW5lOiB0b2tlbnNbMF1bMl0sIGNvbHVtbjogdG9rZW5zWzBdWzNdIH07XG5cbiAgICAgICAgbm9kZS5wcm9wID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGxldCB0eXBlID0gdG9rZW5zWzBdWzBdO1xuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnOicgfHwgdHlwZSA9PT0gJ3NwYWNlJyB8fCB0eXBlID09PSAnY29tbWVudCcgKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnByb3AgKz0gdG9rZW5zLnNoaWZ0KClbMV07XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuXG4gICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgd2hpbGUgKCB0b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKCB0b2tlblswXSA9PT0gJzonICkge1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiArPSB0b2tlblsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggbm9kZS5wcm9wWzBdID09PSAnXycgfHwgbm9kZS5wcm9wWzBdID09PSAnKicgKSB7XG4gICAgICAgICAgICBub2RlLnJhd3MuYmVmb3JlICs9IG5vZGUucHJvcFswXTtcbiAgICAgICAgICAgIG5vZGUucHJvcCA9IG5vZGUucHJvcC5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiArPSB0aGlzLnNwYWNlc0Zyb21TdGFydCh0b2tlbnMpO1xuICAgICAgICB0aGlzLnByZWNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucyk7XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgaWYgKCB0b2tlblsxXSA9PT0gJyFpbXBvcnRhbnQnICkge1xuICAgICAgICAgICAgICAgIG5vZGUuaW1wb3J0YW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgc3RyaW5nID0gdGhpcy5zdHJpbmdGcm9tKHRva2VucywgaSk7XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gdGhpcy5zcGFjZXNGcm9tRW5kKHRva2VucykgKyBzdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCBzdHJpbmcgIT09ICcgIWltcG9ydGFudCcgKSBub2RlLnJhd3MuaW1wb3J0YW50ID0gc3RyaW5nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuWzFdID09PSAnaW1wb3J0YW50Jykge1xuICAgICAgICAgICAgICAgIGxldCBjYWNoZSA9IHRva2Vucy5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBsZXQgc3RyICAgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgaiA9IGk7IGogPiAwOyBqLS0gKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gY2FjaGVbal1bMF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggc3RyLnRyaW0oKS5pbmRleE9mKCchJykgPT09IDAgJiYgdHlwZSAhPT0gJ3NwYWNlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IGNhY2hlLnBvcCgpWzFdICsgc3RyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIHN0ci50cmltKCkuaW5kZXhPZignIScpID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmltcG9ydGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmF3cy5pbXBvcnRhbnQgPSBzdHI7XG4gICAgICAgICAgICAgICAgICAgIHRva2VucyA9IGNhY2hlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0b2tlblswXSAhPT0gJ3NwYWNlJyAmJiB0b2tlblswXSAhPT0gJ2NvbW1lbnQnICkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yYXcobm9kZSwgJ3ZhbHVlJywgdG9rZW5zKTtcblxuICAgICAgICBpZiAoIG5vZGUudmFsdWUuaW5kZXhPZignOicpICE9PSAtMSApIHRoaXMuY2hlY2tNaXNzZWRTZW1pY29sb24odG9rZW5zKTtcbiAgICB9XG5cbiAgICBhdHJ1bGUodG9rZW4pIHtcbiAgICAgICAgbGV0IG5vZGUgID0gbmV3IEF0UnVsZSgpO1xuICAgICAgICBub2RlLm5hbWUgPSB0b2tlblsxXS5zbGljZSgxKTtcbiAgICAgICAgaWYgKCBub2RlLm5hbWUgPT09ICcnICkge1xuICAgICAgICAgICAgdGhpcy51bm5hbWVkQXRydWxlKG5vZGUsIHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcblxuICAgICAgICBsZXQgbGFzdCAgID0gZmFsc2U7XG4gICAgICAgIGxldCBvcGVuICAgPSBmYWxzZTtcbiAgICAgICAgbGV0IHBhcmFtcyA9IFtdO1xuXG4gICAgICAgIHRoaXMucG9zICs9IDE7XG4gICAgICAgIHdoaWxlICggdGhpcy5wb3MgPCB0aGlzLnRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5zW3RoaXMucG9zXTtcblxuICAgICAgICAgICAgaWYgKCB0b2tlblswXSA9PT0gJzsnICkge1xuICAgICAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogdG9rZW5bMl0sIGNvbHVtbjogdG9rZW5bM10gfTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbWljb2xvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0b2tlblswXSA9PT0gJ3snICkge1xuICAgICAgICAgICAgICAgIG9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdG9rZW5bMF0gPT09ICd9Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBvcyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdGhpcy5wb3MgPT09IHRoaXMudG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGxhc3QgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSB0aGlzLnNwYWNlc0Zyb21FbmQocGFyYW1zKTtcbiAgICAgICAgaWYgKCBwYXJhbXMubGVuZ3RoICkge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmFmdGVyTmFtZSA9IHRoaXMuc3BhY2VzRnJvbVN0YXJ0KHBhcmFtcyk7XG4gICAgICAgICAgICB0aGlzLnJhdyhub2RlLCAncGFyYW1zJywgcGFyYW1zKTtcbiAgICAgICAgICAgIGlmICggbGFzdCApIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHBhcmFtc1twYXJhbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kICAgPSB7IGxpbmU6IHRva2VuWzRdLCBjb2x1bW46IHRva2VuWzVdIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zcGFjZXMgICAgICAgPSBub2RlLnJhd3MuYmV0d2VlbjtcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmFmdGVyTmFtZSA9ICcnO1xuICAgICAgICAgICAgbm9kZS5wYXJhbXMgICAgICAgICA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBvcGVuICkge1xuICAgICAgICAgICAgbm9kZS5ub2RlcyAgID0gW107XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5kKHRva2VuKSB7XG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50Lm5vZGVzICYmIHRoaXMuY3VycmVudC5ub2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQucmF3cy5zZW1pY29sb24gPSB0aGlzLnNlbWljb2xvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuY3VycmVudC5yYXdzLmFmdGVyID0gKHRoaXMuY3VycmVudC5yYXdzLmFmdGVyIHx8ICcnKSArIHRoaXMuc3BhY2VzO1xuICAgICAgICB0aGlzLnNwYWNlcyA9ICcnO1xuXG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50LnBhcmVudCApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5zb3VyY2UuZW5kID0geyBsaW5lOiB0b2tlblsyXSwgY29sdW1uOiB0b2tlblszXSB9O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LnBhcmVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudW5leHBlY3RlZENsb3NlKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuZEZpbGUoKSB7XG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50LnBhcmVudCApIHRoaXMudW5jbG9zZWRCbG9jaygpO1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5ub2RlcyAmJiB0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LnJhd3Muc2VtaWNvbG9uID0gdGhpcy5zZW1pY29sb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgPSAodGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgfHwgJycpICsgdGhpcy5zcGFjZXM7XG4gICAgfVxuXG4gICAgLy8gSGVscGVyc1xuXG4gICAgaW5pdChub2RlLCBsaW5lLCBjb2x1bW4pIHtcbiAgICAgICAgdGhpcy5jdXJyZW50LnB1c2gobm9kZSk7XG5cbiAgICAgICAgbm9kZS5zb3VyY2UgPSB7IHN0YXJ0OiB7IGxpbmUsIGNvbHVtbiB9LCBpbnB1dDogdGhpcy5pbnB1dCB9O1xuICAgICAgICBub2RlLnJhd3MuYmVmb3JlID0gdGhpcy5zcGFjZXM7XG4gICAgICAgIHRoaXMuc3BhY2VzID0gJyc7XG4gICAgICAgIGlmICggbm9kZS50eXBlICE9PSAnY29tbWVudCcgKSB0aGlzLnNlbWljb2xvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJhdyhub2RlLCBwcm9wLCB0b2tlbnMpIHtcbiAgICAgICAgbGV0IHRva2VuLCB0eXBlO1xuICAgICAgICBsZXQgbGVuZ3RoID0gdG9rZW5zLmxlbmd0aDtcbiAgICAgICAgbGV0IHZhbHVlICA9ICcnO1xuICAgICAgICBsZXQgY2xlYW4gID0gdHJ1ZTtcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEgKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHR5cGUgID0gdG9rZW5bMF07XG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdjb21tZW50JyB8fCB0eXBlID09PSAnc3BhY2UnICYmIGkgPT09IGxlbmd0aCAtIDEgKSB7XG4gICAgICAgICAgICAgICAgY2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gdG9rZW5bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAhY2xlYW4gKSB7XG4gICAgICAgICAgICBsZXQgcmF3ID0gdG9rZW5zLnJlZHVjZSggKGFsbCwgaSkgPT4gYWxsICsgaVsxXSwgJycpO1xuICAgICAgICAgICAgbm9kZS5yYXdzW3Byb3BdID0geyB2YWx1ZSwgcmF3IH07XG4gICAgICAgIH1cbiAgICAgICAgbm9kZVtwcm9wXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHNwYWNlc0Zyb21FbmQodG9rZW5zKSB7XG4gICAgICAgIGxldCBsYXN0VG9rZW5UeXBlO1xuICAgICAgICBsZXQgc3BhY2VzID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGxhc3RUb2tlblR5cGUgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzBdO1xuICAgICAgICAgICAgaWYgKCBsYXN0VG9rZW5UeXBlICE9PSAnc3BhY2UnICYmXG4gICAgICAgICAgICAgICAgbGFzdFRva2VuVHlwZSAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICBzcGFjZXMgPSB0b2tlbnMucG9wKClbMV0gKyBzcGFjZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwYWNlcztcbiAgICB9XG5cbiAgICBzcGFjZXNGcm9tU3RhcnQodG9rZW5zKSB7XG4gICAgICAgIGxldCBuZXh0O1xuICAgICAgICBsZXQgc3BhY2VzID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIG5leHQgPSB0b2tlbnNbMF1bMF07XG4gICAgICAgICAgICBpZiAoIG5leHQgIT09ICdzcGFjZScgJiYgbmV4dCAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICBzcGFjZXMgKz0gdG9rZW5zLnNoaWZ0KClbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwYWNlcztcbiAgICB9XG5cbiAgICBzdHJpbmdGcm9tKHRva2VucywgZnJvbSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIGZvciAoIGxldCBpID0gZnJvbTsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSB0b2tlbnNbaV1bMV07XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zLnNwbGljZShmcm9tLCB0b2tlbnMubGVuZ3RoIC0gZnJvbSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29sb24odG9rZW5zKSB7XG4gICAgICAgIGxldCBicmFja2V0cyA9IDA7XG4gICAgICAgIGxldCB0b2tlbiwgdHlwZSwgcHJldjtcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB0eXBlICA9IHRva2VuWzBdO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICcoJyApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cyArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJyknICkge1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzIC09IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBicmFja2V0cyA9PT0gMCAmJiB0eXBlID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhcHJldiApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3VibGVDb2xvbih0b2tlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggcHJldlswXSA9PT0gJ3dvcmQnICYmIHByZXZbMV0gPT09ICdwcm9naWQnICkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXYgPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzXG5cbiAgICB1bmNsb3NlZEJyYWNrZXQoYnJhY2tldCkge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmNsb3NlZCBicmFja2V0JywgYnJhY2tldFsyXSwgYnJhY2tldFszXSk7XG4gICAgfVxuXG4gICAgdW5rbm93bldvcmQoc3RhcnQpIHtcbiAgICAgICAgbGV0IHRva2VuID0gdGhpcy50b2tlbnNbc3RhcnRdO1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmtub3duIHdvcmQnLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxuICAgIHVuZXhwZWN0ZWRDbG9zZSh0b2tlbikge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmV4cGVjdGVkIH0nLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxuICAgIHVuY2xvc2VkQmxvY2soKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnJlbnQuc291cmNlLnN0YXJ0O1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmNsb3NlZCBibG9jaycsIHBvcy5saW5lLCBwb3MuY29sdW1uKTtcbiAgICB9XG5cbiAgICBkb3VibGVDb2xvbih0b2tlbikge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdEb3VibGUgY29sb24nLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxuICAgIHVubmFtZWRBdHJ1bGUobm9kZSwgdG9rZW4pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignQXQtcnVsZSB3aXRob3V0IG5hbWUnLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxuICAgIHByZWNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucykge1xuICAgICAgICAvLyBIb29rIGZvciBTYWZlIFBhcnNlclxuICAgICAgICB0b2tlbnM7XG4gICAgfVxuXG4gICAgY2hlY2tNaXNzZWRTZW1pY29sb24odG9rZW5zKSB7XG4gICAgICAgIGxldCBjb2xvbiA9IHRoaXMuY29sb24odG9rZW5zKTtcbiAgICAgICAgaWYgKCBjb2xvbiA9PT0gZmFsc2UgKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGZvdW5kZWQgPSAwO1xuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIGZvciAoIGxldCBqID0gY29sb24gLSAxOyBqID49IDA7IGotLSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2pdO1xuICAgICAgICAgICAgaWYgKCB0b2tlblswXSAhPT0gJ3NwYWNlJyApIHtcbiAgICAgICAgICAgICAgICBmb3VuZGVkICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKCBmb3VuZGVkID09PSAyICkgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignTWlzc2VkIHNlbWljb2xvbicsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	var _node = __webpack_require__(4);
	
	var _node2 = _interopRequireDefault(_node);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a comment between declarations or statements (rule and at-rules).
	 *
	 * Comments inside selectors, at-rule parameters, or declaration values
	 * will be stored in the `raws` properties explained above.
	 *
	 * @extends Node
	 */
	var Comment = function (_Node) {
	    _inherits(Comment, _Node);
	
	    function Comment(defaults) {
	        _classCallCheck(this, Comment);
	
	        var _this = _possibleConstructorReturn(this, _Node.call(this, defaults));
	
	        _this.type = 'comment';
	        return _this;
	    }
	
	    _createClass(Comment, [{
	        key: 'left',
	        get: function get() {
	            (0, _warnOnce2.default)('Comment#left was deprecated. Use Comment#raws.left');
	            return this.raws.left;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Comment#left was deprecated. Use Comment#raws.left');
	            this.raws.left = val;
	        }
	    }, {
	        key: 'right',
	        get: function get() {
	            (0, _warnOnce2.default)('Comment#right was deprecated. Use Comment#raws.right');
	            return this.raws.right;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Comment#right was deprecated. Use Comment#raws.right');
	            this.raws.right = val;
	        }
	
	        /**
	         * @memberof Comment#
	         * @member {string} text - the comment’s text
	         */
	
	        /**
	         * @memberof Comment#
	         * @member {object} raws - Information to generate byte-to-byte equal
	         *                         node string as it was in the origin input.
	         *
	         * Every parser saves its own properties,
	         * but the default CSS parser uses:
	         *
	         * * `before`: the space symbols before the node.
	         * * `left`: the space symbols between `/*` and the comment’s text.
	         * * `right`: the space symbols between the comment’s text.
	         */
	
	    }]);
	
	    return Comment;
	}(_node2.default);
	
	exports.default = Comment;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1lbnQuZXM2Il0sIm5hbWVzIjpbIkNvbW1lbnQiLCJkZWZhdWx0cyIsInR5cGUiLCJyYXdzIiwibGVmdCIsInZhbCIsInJpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7SUFRTUEsTzs7O0FBRUYscUJBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQSxxREFDbEIsaUJBQU1BLFFBQU4sQ0FEa0I7O0FBRWxCLGNBQUtDLElBQUwsR0FBWSxTQUFaO0FBRmtCO0FBR3JCOzs7OzRCQUVVO0FBQ1Asb0NBQVMsb0RBQVQ7QUFDQSxtQkFBTyxLQUFLQyxJQUFMLENBQVVDLElBQWpCO0FBQ0gsUzswQkFFUUMsRyxFQUFLO0FBQ1Ysb0NBQVMsb0RBQVQ7QUFDQSxpQkFBS0YsSUFBTCxDQUFVQyxJQUFWLEdBQWlCQyxHQUFqQjtBQUNIOzs7NEJBRVc7QUFDUixvQ0FBUyxzREFBVDtBQUNBLG1CQUFPLEtBQUtGLElBQUwsQ0FBVUcsS0FBakI7QUFDSCxTOzBCQUVTRCxHLEVBQUs7QUFDWCxvQ0FBUyxzREFBVDtBQUNBLGlCQUFLRixJQUFMLENBQVVHLEtBQVYsR0FBa0JELEdBQWxCO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFjV0wsTyIsImZpbGUiOiJjb21tZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdhcm5PbmNlIGZyb20gJy4vd2Fybi1vbmNlJztcbmltcG9ydCBOb2RlICAgICBmcm9tICcuL25vZGUnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb21tZW50IGJldHdlZW4gZGVjbGFyYXRpb25zIG9yIHN0YXRlbWVudHMgKHJ1bGUgYW5kIGF0LXJ1bGVzKS5cbiAqXG4gKiBDb21tZW50cyBpbnNpZGUgc2VsZWN0b3JzLCBhdC1ydWxlIHBhcmFtZXRlcnMsIG9yIGRlY2xhcmF0aW9uIHZhbHVlc1xuICogd2lsbCBiZSBzdG9yZWQgaW4gdGhlIGByYXdzYCBwcm9wZXJ0aWVzIGV4cGxhaW5lZCBhYm92ZS5cbiAqXG4gKiBAZXh0ZW5kcyBOb2RlXG4gKi9cbmNsYXNzIENvbW1lbnQgZXh0ZW5kcyBOb2RlIHtcblxuICAgIGNvbnN0cnVjdG9yKGRlZmF1bHRzKSB7XG4gICAgICAgIHN1cGVyKGRlZmF1bHRzKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgIH1cblxuICAgIGdldCBsZWZ0KCkge1xuICAgICAgICB3YXJuT25jZSgnQ29tbWVudCNsZWZ0IHdhcyBkZXByZWNhdGVkLiBVc2UgQ29tbWVudCNyYXdzLmxlZnQnKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5sZWZ0O1xuICAgIH1cblxuICAgIHNldCBsZWZ0KHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnQ29tbWVudCNsZWZ0IHdhcyBkZXByZWNhdGVkLiBVc2UgQ29tbWVudCNyYXdzLmxlZnQnKTtcbiAgICAgICAgdGhpcy5yYXdzLmxlZnQgPSB2YWw7XG4gICAgfVxuXG4gICAgZ2V0IHJpZ2h0KCkge1xuICAgICAgICB3YXJuT25jZSgnQ29tbWVudCNyaWdodCB3YXMgZGVwcmVjYXRlZC4gVXNlIENvbW1lbnQjcmF3cy5yaWdodCcpO1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdzLnJpZ2h0O1xuICAgIH1cblxuICAgIHNldCByaWdodCh2YWwpIHtcbiAgICAgICAgd2Fybk9uY2UoJ0NvbW1lbnQjcmlnaHQgd2FzIGRlcHJlY2F0ZWQuIFVzZSBDb21tZW50I3Jhd3MucmlnaHQnKTtcbiAgICAgICAgdGhpcy5yYXdzLnJpZ2h0ID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBDb21tZW50I1xuICAgICAqIEBtZW1iZXIge3N0cmluZ30gdGV4dCAtIHRoZSBjb21tZW504oCZcyB0ZXh0XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgQ29tbWVudCNcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IHJhd3MgLSBJbmZvcm1hdGlvbiB0byBnZW5lcmF0ZSBieXRlLXRvLWJ5dGUgZXF1YWxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlIHN0cmluZyBhcyBpdCB3YXMgaW4gdGhlIG9yaWdpbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIEV2ZXJ5IHBhcnNlciBzYXZlcyBpdHMgb3duIHByb3BlcnRpZXMsXG4gICAgICogYnV0IHRoZSBkZWZhdWx0IENTUyBwYXJzZXIgdXNlczpcbiAgICAgKlxuICAgICAqICogYGJlZm9yZWA6IHRoZSBzcGFjZSBzeW1ib2xzIGJlZm9yZSB0aGUgbm9kZS5cbiAgICAgKiAqIGBsZWZ0YDogdGhlIHNwYWNlIHN5bWJvbHMgYmV0d2VlbiBgLypgIGFuZCB0aGUgY29tbWVudOKAmXMgdGV4dC5cbiAgICAgKiAqIGByaWdodGA6IHRoZSBzcGFjZSBzeW1ib2xzIGJldHdlZW4gdGhlIGNvbW1lbnTigJlzIHRleHQuXG4gICAgICovXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbW1lbnQ7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _container = __webpack_require__(49);
	
	var _container2 = _interopRequireDefault(_container);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents an at-rule.
	 *
	 * If it’s followed in the CSS by a {} block, this node will have
	 * a nodes property representing its children.
	 *
	 * @extends Container
	 *
	 * @example
	 * const root = postcss.parse('@charset "UTF-8"; @media print {}');
	 *
	 * const charset = root.first;
	 * charset.type  //=> 'atrule'
	 * charset.nodes //=> undefined
	 *
	 * const media = root.last;
	 * media.nodes   //=> []
	 */
	var AtRule = function (_Container) {
	    _inherits(AtRule, _Container);
	
	    function AtRule(defaults) {
	        _classCallCheck(this, AtRule);
	
	        var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));
	
	        _this.type = 'atrule';
	        return _this;
	    }
	
	    AtRule.prototype.append = function append() {
	        var _Container$prototype$;
	
	        if (!this.nodes) this.nodes = [];
	
	        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
	            children[_key] = arguments[_key];
	        }
	
	        return (_Container$prototype$ = _Container.prototype.append).call.apply(_Container$prototype$, [this].concat(children));
	    };
	
	    AtRule.prototype.prepend = function prepend() {
	        var _Container$prototype$2;
	
	        if (!this.nodes) this.nodes = [];
	
	        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            children[_key2] = arguments[_key2];
	        }
	
	        return (_Container$prototype$2 = _Container.prototype.prepend).call.apply(_Container$prototype$2, [this].concat(children));
	    };
	
	    _createClass(AtRule, [{
	        key: 'afterName',
	        get: function get() {
	            (0, _warnOnce2.default)('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
	            return this.raws.afterName;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('AtRule#afterName was deprecated. Use AtRule#raws.afterName');
	            this.raws.afterName = val;
	        }
	    }, {
	        key: '_params',
	        get: function get() {
	            (0, _warnOnce2.default)('AtRule#_params was deprecated. Use AtRule#raws.params');
	            return this.raws.params;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('AtRule#_params was deprecated. Use AtRule#raws.params');
	            this.raws.params = val;
	        }
	
	        /**
	         * @memberof AtRule#
	         * @member {string} name - the at-rule’s name immediately follows the `@`
	         *
	         * @example
	         * const root  = postcss.parse('@media print {}');
	         * media.name //=> 'media'
	         * const media = root.first;
	         */
	
	        /**
	         * @memberof AtRule#
	         * @member {string} params - the at-rule’s parameters, the values
	         *                           that follow the at-rule’s name but precede
	         *                           any {} block
	         *
	         * @example
	         * const root  = postcss.parse('@media print, screen {}');
	         * const media = root.first;
	         * media.params //=> 'print, screen'
	         */
	
	        /**
	         * @memberof AtRule#
	         * @member {object} raws - Information to generate byte-to-byte equal
	         *                         node string as it was in the origin input.
	         *
	         * Every parser saves its own properties,
	         * but the default CSS parser uses:
	         *
	         * * `before`: the space symbols before the node. It also stores `*`
	         *   and `_` symbols before the declaration (IE hack).
	         * * `after`: the space symbols after the last child of the node
	         *   to the end of the node.
	         * * `between`: the symbols between the property and value
	         *   for declarations, selector and `{` for rules, or last parameter
	         *   and `{` for at-rules.
	         * * `semicolon`: contains true if the last child has
	         *   an (optional) semicolon.
	         * * `afterName`: the space between the at-rule name and its parameters.
	         *
	         * PostCSS cleans at-rule parameters from comments and extra spaces,
	         * but it stores origin content in raws properties.
	         * As such, if you don’t change a declaration’s value,
	         * PostCSS will use the raw value with comments.
	         *
	         * @example
	         * const root = postcss.parse('  @media\nprint {\n}')
	         * root.first.first.raws //=> { before: '  ',
	         *                       //     between: ' ',
	         *                       //     afterName: '\n',
	         *                       //     after: '\n' }
	         */
	
	    }]);
	
	    return AtRule;
	}(_container2.default);
	
	exports.default = AtRule;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0LXJ1bGUuZXM2Il0sIm5hbWVzIjpbIkF0UnVsZSIsImRlZmF1bHRzIiwidHlwZSIsImFwcGVuZCIsIm5vZGVzIiwiY2hpbGRyZW4iLCJwcmVwZW5kIiwicmF3cyIsImFmdGVyTmFtZSIsInZhbCIsInBhcmFtcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCTUEsTTs7O0FBRUYsb0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQSxxREFDbEIsc0JBQU1BLFFBQU4sQ0FEa0I7O0FBRWxCLGNBQUtDLElBQUwsR0FBWSxRQUFaO0FBRmtCO0FBR3JCOztxQkFFREMsTSxxQkFBb0I7QUFBQTs7QUFDaEIsWUFBSyxDQUFDLEtBQUtDLEtBQVgsRUFBbUIsS0FBS0EsS0FBTCxHQUFhLEVBQWI7O0FBREgsMENBQVZDLFFBQVU7QUFBVkEsb0JBQVU7QUFBQTs7QUFFaEIsZUFBTyw4Q0FBTUYsTUFBTixrREFBZ0JFLFFBQWhCLEVBQVA7QUFDSCxLOztxQkFFREMsTyxzQkFBcUI7QUFBQTs7QUFDakIsWUFBSyxDQUFDLEtBQUtGLEtBQVgsRUFBbUIsS0FBS0EsS0FBTCxHQUFhLEVBQWI7O0FBREYsMkNBQVZDLFFBQVU7QUFBVkEsb0JBQVU7QUFBQTs7QUFFakIsZUFBTywrQ0FBTUMsT0FBTixtREFBaUJELFFBQWpCLEVBQVA7QUFDSCxLOzs7OzRCQUVlO0FBQ1osb0NBQVMsNERBQVQ7QUFDQSxtQkFBTyxLQUFLRSxJQUFMLENBQVVDLFNBQWpCO0FBQ0gsUzswQkFFYUMsRyxFQUFLO0FBQ2Ysb0NBQVMsNERBQVQ7QUFDQSxpQkFBS0YsSUFBTCxDQUFVQyxTQUFWLEdBQXNCQyxHQUF0QjtBQUNIOzs7NEJBRWE7QUFDVixvQ0FBUyx1REFBVDtBQUNBLG1CQUFPLEtBQUtGLElBQUwsQ0FBVUcsTUFBakI7QUFDSCxTOzBCQUVXRCxHLEVBQUs7QUFDYixvQ0FBUyx1REFBVDtBQUNBLGlCQUFLRixJQUFMLENBQVVHLE1BQVYsR0FBbUJELEdBQW5CO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBaUNXVCxNIiwiZmlsZSI6ImF0LXJ1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB3YXJuT25jZSAgZnJvbSAnLi93YXJuLW9uY2UnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gYXQtcnVsZS5cbiAqXG4gKiBJZiBpdOKAmXMgZm9sbG93ZWQgaW4gdGhlIENTUyBieSBhIHt9IGJsb2NrLCB0aGlzIG5vZGUgd2lsbCBoYXZlXG4gKiBhIG5vZGVzIHByb3BlcnR5IHJlcHJlc2VudGluZyBpdHMgY2hpbGRyZW4uXG4gKlxuICogQGV4dGVuZHMgQ29udGFpbmVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdAY2hhcnNldCBcIlVURi04XCI7IEBtZWRpYSBwcmludCB7fScpO1xuICpcbiAqIGNvbnN0IGNoYXJzZXQgPSByb290LmZpcnN0O1xuICogY2hhcnNldC50eXBlICAvLz0+ICdhdHJ1bGUnXG4gKiBjaGFyc2V0Lm5vZGVzIC8vPT4gdW5kZWZpbmVkXG4gKlxuICogY29uc3QgbWVkaWEgPSByb290Lmxhc3Q7XG4gKiBtZWRpYS5ub2RlcyAgIC8vPT4gW11cbiAqL1xuY2xhc3MgQXRSdWxlIGV4dGVuZHMgQ29udGFpbmVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGRlZmF1bHRzKSB7XG4gICAgICAgIHN1cGVyKGRlZmF1bHRzKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0cnVsZSc7XG4gICAgfVxuXG4gICAgYXBwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmICggIXRoaXMubm9kZXMgKSB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHJldHVybiBzdXBlci5hcHBlbmQoLi4uY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIHByZXBlbmQoLi4uY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnByZXBlbmQoLi4uY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIGdldCBhZnRlck5hbWUoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdBdFJ1bGUjYWZ0ZXJOYW1lIHdhcyBkZXByZWNhdGVkLiBVc2UgQXRSdWxlI3Jhd3MuYWZ0ZXJOYW1lJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJhd3MuYWZ0ZXJOYW1lO1xuICAgIH1cblxuICAgIHNldCBhZnRlck5hbWUodmFsKSB7XG4gICAgICAgIHdhcm5PbmNlKCdBdFJ1bGUjYWZ0ZXJOYW1lIHdhcyBkZXByZWNhdGVkLiBVc2UgQXRSdWxlI3Jhd3MuYWZ0ZXJOYW1lJyk7XG4gICAgICAgIHRoaXMucmF3cy5hZnRlck5hbWUgPSB2YWw7XG4gICAgfVxuXG4gICAgZ2V0IF9wYXJhbXMoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdBdFJ1bGUjX3BhcmFtcyB3YXMgZGVwcmVjYXRlZC4gVXNlIEF0UnVsZSNyYXdzLnBhcmFtcycpO1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdzLnBhcmFtcztcbiAgICB9XG5cbiAgICBzZXQgX3BhcmFtcyh2YWwpIHtcbiAgICAgICAgd2Fybk9uY2UoJ0F0UnVsZSNfcGFyYW1zIHdhcyBkZXByZWNhdGVkLiBVc2UgQXRSdWxlI3Jhd3MucGFyYW1zJyk7XG4gICAgICAgIHRoaXMucmF3cy5wYXJhbXMgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIEF0UnVsZSNcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IG5hbWUgLSB0aGUgYXQtcnVsZeKAmXMgbmFtZSBpbW1lZGlhdGVseSBmb2xsb3dzIHRoZSBgQGBcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCAgPSBwb3N0Y3NzLnBhcnNlKCdAbWVkaWEgcHJpbnQge30nKTtcbiAgICAgKiBtZWRpYS5uYW1lIC8vPT4gJ21lZGlhJ1xuICAgICAqIGNvbnN0IG1lZGlhID0gcm9vdC5maXJzdDtcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBBdFJ1bGUjXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBwYXJhbXMgLSB0aGUgYXQtcnVsZeKAmXMgcGFyYW1ldGVycywgdGhlIHZhbHVlc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBmb2xsb3cgdGhlIGF0LXJ1bGXigJlzIG5hbWUgYnV0IHByZWNlZGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFueSB7fSBibG9ja1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ICA9IHBvc3Rjc3MucGFyc2UoJ0BtZWRpYSBwcmludCwgc2NyZWVuIHt9Jyk7XG4gICAgICogY29uc3QgbWVkaWEgPSByb290LmZpcnN0O1xuICAgICAqIG1lZGlhLnBhcmFtcyAvLz0+ICdwcmludCwgc2NyZWVuJ1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIEF0UnVsZSNcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IHJhd3MgLSBJbmZvcm1hdGlvbiB0byBnZW5lcmF0ZSBieXRlLXRvLWJ5dGUgZXF1YWxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlIHN0cmluZyBhcyBpdCB3YXMgaW4gdGhlIG9yaWdpbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIEV2ZXJ5IHBhcnNlciBzYXZlcyBpdHMgb3duIHByb3BlcnRpZXMsXG4gICAgICogYnV0IHRoZSBkZWZhdWx0IENTUyBwYXJzZXIgdXNlczpcbiAgICAgKlxuICAgICAqICogYGJlZm9yZWA6IHRoZSBzcGFjZSBzeW1ib2xzIGJlZm9yZSB0aGUgbm9kZS4gSXQgYWxzbyBzdG9yZXMgYCpgXG4gICAgICogICBhbmQgYF9gIHN5bWJvbHMgYmVmb3JlIHRoZSBkZWNsYXJhdGlvbiAoSUUgaGFjaykuXG4gICAgICogKiBgYWZ0ZXJgOiB0aGUgc3BhY2Ugc3ltYm9scyBhZnRlciB0aGUgbGFzdCBjaGlsZCBvZiB0aGUgbm9kZVxuICAgICAqICAgdG8gdGhlIGVuZCBvZiB0aGUgbm9kZS5cbiAgICAgKiAqIGBiZXR3ZWVuYDogdGhlIHN5bWJvbHMgYmV0d2VlbiB0aGUgcHJvcGVydHkgYW5kIHZhbHVlXG4gICAgICogICBmb3IgZGVjbGFyYXRpb25zLCBzZWxlY3RvciBhbmQgYHtgIGZvciBydWxlcywgb3IgbGFzdCBwYXJhbWV0ZXJcbiAgICAgKiAgIGFuZCBge2AgZm9yIGF0LXJ1bGVzLlxuICAgICAqICogYHNlbWljb2xvbmA6IGNvbnRhaW5zIHRydWUgaWYgdGhlIGxhc3QgY2hpbGQgaGFzXG4gICAgICogICBhbiAob3B0aW9uYWwpIHNlbWljb2xvbi5cbiAgICAgKiAqIGBhZnRlck5hbWVgOiB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgYXQtcnVsZSBuYW1lIGFuZCBpdHMgcGFyYW1ldGVycy5cbiAgICAgKlxuICAgICAqIFBvc3RDU1MgY2xlYW5zIGF0LXJ1bGUgcGFyYW1ldGVycyBmcm9tIGNvbW1lbnRzIGFuZCBleHRyYSBzcGFjZXMsXG4gICAgICogYnV0IGl0IHN0b3JlcyBvcmlnaW4gY29udGVudCBpbiByYXdzIHByb3BlcnRpZXMuXG4gICAgICogQXMgc3VjaCwgaWYgeW91IGRvbuKAmXQgY2hhbmdlIGEgZGVjbGFyYXRpb27igJlzIHZhbHVlLFxuICAgICAqIFBvc3RDU1Mgd2lsbCB1c2UgdGhlIHJhdyB2YWx1ZSB3aXRoIGNvbW1lbnRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnICBAbWVkaWFcXG5wcmludCB7XFxufScpXG4gICAgICogcm9vdC5maXJzdC5maXJzdC5yYXdzIC8vPT4geyBiZWZvcmU6ICcgICcsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBiZXR3ZWVuOiAnICcsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBhZnRlck5hbWU6ICdcXG4nLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgYWZ0ZXI6ICdcXG4nIH1cbiAgICAgKi9cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXRSdWxlO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _declaration = __webpack_require__(2);
	
	var _declaration2 = _interopRequireDefault(_declaration);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	var _comment = __webpack_require__(47);
	
	var _comment2 = _interopRequireDefault(_comment);
	
	var _node = __webpack_require__(4);
	
	var _node2 = _interopRequireDefault(_node);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function cleanSource(nodes) {
	    return nodes.map(function (i) {
	        if (i.nodes) i.nodes = cleanSource(i.nodes);
	        delete i.source;
	        return i;
	    });
	}
	
	/**
	 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
	 * inherit some common methods to help work with their children.
	 *
	 * Note that all containers can store any content. If you write a rule inside
	 * a rule, PostCSS will parse it.
	 *
	 * @extends Node
	 * @abstract
	 */
	
	var Container = function (_Node) {
	    _inherits(Container, _Node);
	
	    function Container() {
	        _classCallCheck(this, Container);
	
	        return _possibleConstructorReturn(this, _Node.apply(this, arguments));
	    }
	
	    Container.prototype.push = function push(child) {
	        child.parent = this;
	        this.nodes.push(child);
	        return this;
	    };
	
	    /**
	     * Iterates through the container’s immediate children,
	     * calling `callback` for each child.
	     *
	     * Returning `false` in the callback will break iteration.
	     *
	     * This method only iterates through the container’s immediate children.
	     * If you need to recursively iterate through all the container’s descendant
	     * nodes, use {@link Container#walk}.
	     *
	     * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
	     * if you are mutating the array of child nodes during iteration.
	     * PostCSS will adjust the current index to match the mutations.
	     *
	     * @param {childIterator} callback - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * const root = postcss.parse('a { color: black; z-index: 1 }');
	     * const rule = root.first;
	     *
	     * for ( let decl of rule.nodes ) {
	     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
	     *     // Cycle will be infinite, because cloneBefore moves the current node
	     *     // to the next index
	     * }
	     *
	     * rule.each(decl => {
	     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
	     *     // Will be executed only for color and z-index
	     * });
	     */
	
	
	    Container.prototype.each = function each(callback) {
	        if (!this.lastEach) this.lastEach = 0;
	        if (!this.indexes) this.indexes = {};
	
	        this.lastEach += 1;
	        var id = this.lastEach;
	        this.indexes[id] = 0;
	
	        if (!this.nodes) return undefined;
	
	        var index = void 0,
	            result = void 0;
	        while (this.indexes[id] < this.nodes.length) {
	            index = this.indexes[id];
	            result = callback(this.nodes[index], index);
	            if (result === false) break;
	
	            this.indexes[id] += 1;
	        }
	
	        delete this.indexes[id];
	
	        return result;
	    };
	
	    /**
	     * Traverses the container’s descendant nodes, calling callback
	     * for each node.
	     *
	     * Like container.each(), this method is safe to use
	     * if you are mutating arrays during iteration.
	     *
	     * If you only need to iterate through the container’s immediate children,
	     * use {@link Container#each}.
	     *
	     * @param {childIterator} callback - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * root.walk(node => {
	     *   // Traverses all descendant nodes.
	     * });
	     */
	
	
	    Container.prototype.walk = function walk(callback) {
	        return this.each(function (child, i) {
	            var result = callback(child, i);
	            if (result !== false && child.walk) {
	                result = child.walk(callback);
	            }
	            return result;
	        });
	    };
	
	    /**
	     * Traverses the container’s descendant nodes, calling callback
	     * for each declaration node.
	     *
	     * If you pass a filter, iteration will only happen over declarations
	     * with matching properties.
	     *
	     * Like {@link Container#each}, this method is safe
	     * to use if you are mutating arrays during iteration.
	     *
	     * @param {string|RegExp} [prop]   - string or regular expression
	     *                                   to filter declarations by property name
	     * @param {childIterator} callback - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * root.walkDecls(decl => {
	     *   checkPropertySupport(decl.prop);
	     * });
	     *
	     * root.walkDecls('border-radius', decl => {
	     *   decl.remove();
	     * });
	     *
	     * root.walkDecls(/^background/, decl => {
	     *   decl.value = takeFirstColorFromGradient(decl.value);
	     * });
	     */
	
	
	    Container.prototype.walkDecls = function walkDecls(prop, callback) {
	        if (!callback) {
	            callback = prop;
	            return this.walk(function (child, i) {
	                if (child.type === 'decl') {
	                    return callback(child, i);
	                }
	            });
	        } else if (prop instanceof RegExp) {
	            return this.walk(function (child, i) {
	                if (child.type === 'decl' && prop.test(child.prop)) {
	                    return callback(child, i);
	                }
	            });
	        } else {
	            return this.walk(function (child, i) {
	                if (child.type === 'decl' && child.prop === prop) {
	                    return callback(child, i);
	                }
	            });
	        }
	    };
	
	    /**
	     * Traverses the container’s descendant nodes, calling callback
	     * for each rule node.
	     *
	     * If you pass a filter, iteration will only happen over rules
	     * with matching selectors.
	     *
	     * Like {@link Container#each}, this method is safe
	     * to use if you are mutating arrays during iteration.
	     *
	     * @param {string|RegExp} [selector] - string or regular expression
	     *                                     to filter rules by selector
	     * @param {childIterator} callback   - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * const selectors = [];
	     * root.walkRules(rule => {
	     *   selectors.push(rule.selector);
	     * });
	     * console.log(`Your CSS uses ${selectors.length} selectors`);
	     */
	
	
	    Container.prototype.walkRules = function walkRules(selector, callback) {
	        if (!callback) {
	            callback = selector;
	
	            return this.walk(function (child, i) {
	                if (child.type === 'rule') {
	                    return callback(child, i);
	                }
	            });
	        } else if (selector instanceof RegExp) {
	            return this.walk(function (child, i) {
	                if (child.type === 'rule' && selector.test(child.selector)) {
	                    return callback(child, i);
	                }
	            });
	        } else {
	            return this.walk(function (child, i) {
	                if (child.type === 'rule' && child.selector === selector) {
	                    return callback(child, i);
	                }
	            });
	        }
	    };
	
	    /**
	     * Traverses the container’s descendant nodes, calling callback
	     * for each at-rule node.
	     *
	     * If you pass a filter, iteration will only happen over at-rules
	     * that have matching names.
	     *
	     * Like {@link Container#each}, this method is safe
	     * to use if you are mutating arrays during iteration.
	     *
	     * @param {string|RegExp} [name]   - string or regular expression
	     *                                   to filter at-rules by name
	     * @param {childIterator} callback - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * root.walkAtRules(rule => {
	     *   if ( isOld(rule.name) ) rule.remove();
	     * });
	     *
	     * let first = false;
	     * root.walkAtRules('charset', rule => {
	     *   if ( !first ) {
	     *     first = true;
	     *   } else {
	     *     rule.remove();
	     *   }
	     * });
	     */
	
	
	    Container.prototype.walkAtRules = function walkAtRules(name, callback) {
	        if (!callback) {
	            callback = name;
	            return this.walk(function (child, i) {
	                if (child.type === 'atrule') {
	                    return callback(child, i);
	                }
	            });
	        } else if (name instanceof RegExp) {
	            return this.walk(function (child, i) {
	                if (child.type === 'atrule' && name.test(child.name)) {
	                    return callback(child, i);
	                }
	            });
	        } else {
	            return this.walk(function (child, i) {
	                if (child.type === 'atrule' && child.name === name) {
	                    return callback(child, i);
	                }
	            });
	        }
	    };
	
	    /**
	     * Traverses the container’s descendant nodes, calling callback
	     * for each comment node.
	     *
	     * Like {@link Container#each}, this method is safe
	     * to use if you are mutating arrays during iteration.
	     *
	     * @param {childIterator} callback - iterator receives each node and index
	     *
	     * @return {false|undefined} returns `false` if iteration was broke
	     *
	     * @example
	     * root.walkComments(comment => {
	     *   comment.remove();
	     * });
	     */
	
	
	    Container.prototype.walkComments = function walkComments(callback) {
	        return this.walk(function (child, i) {
	            if (child.type === 'comment') {
	                return callback(child, i);
	            }
	        });
	    };
	
	    /**
	     * Inserts new nodes to the start of the container.
	     *
	     * @param {...(Node|object|string|Node[])} children - new nodes
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
	     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
	     * rule.append(decl1, decl2);
	     *
	     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
	     * root.append({ selector: 'a' });                       // rule
	     * rule.append({ prop: 'color', value: 'black' });       // declaration
	     * rule.append({ text: 'Comment' })                      // comment
	     *
	     * root.append('a {}');
	     * root.first.append('color: black; z-index: 1');
	     */
	
	
	    Container.prototype.append = function append() {
	        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
	            children[_key] = arguments[_key];
	        }
	
	        for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }
	
	            var child = _ref;
	
	            var nodes = this.normalize(child, this.last);
	            for (var _iterator2 = nodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	                var _ref2;
	
	                if (_isArray2) {
	                    if (_i2 >= _iterator2.length) break;
	                    _ref2 = _iterator2[_i2++];
	                } else {
	                    _i2 = _iterator2.next();
	                    if (_i2.done) break;
	                    _ref2 = _i2.value;
	                }
	
	                var node = _ref2;
	                this.nodes.push(node);
	            }
	        }
	        return this;
	    };
	
	    /**
	     * Inserts new nodes to the end of the container.
	     *
	     * @param {...(Node|object|string|Node[])} children - new nodes
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
	     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
	     * rule.prepend(decl1, decl2);
	     *
	     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
	     * root.append({ selector: 'a' });                       // rule
	     * rule.append({ prop: 'color', value: 'black' });       // declaration
	     * rule.append({ text: 'Comment' })                      // comment
	     *
	     * root.append('a {}');
	     * root.first.append('color: black; z-index: 1');
	     */
	
	
	    Container.prototype.prepend = function prepend() {
	        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            children[_key2] = arguments[_key2];
	        }
	
	        children = children.reverse();
	        for (var _iterator3 = children, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	            var _ref3;
	
	            if (_isArray3) {
	                if (_i3 >= _iterator3.length) break;
	                _ref3 = _iterator3[_i3++];
	            } else {
	                _i3 = _iterator3.next();
	                if (_i3.done) break;
	                _ref3 = _i3.value;
	            }
	
	            var child = _ref3;
	
	            var nodes = this.normalize(child, this.first, 'prepend').reverse();
	            for (var _iterator4 = nodes, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
	                var _ref4;
	
	                if (_isArray4) {
	                    if (_i4 >= _iterator4.length) break;
	                    _ref4 = _iterator4[_i4++];
	                } else {
	                    _i4 = _iterator4.next();
	                    if (_i4.done) break;
	                    _ref4 = _i4.value;
	                }
	
	                var node = _ref4;
	                this.nodes.unshift(node);
	            }for (var id in this.indexes) {
	                this.indexes[id] = this.indexes[id] + nodes.length;
	            }
	        }
	        return this;
	    };
	
	    Container.prototype.cleanRaws = function cleanRaws(keepBetween) {
	        _Node.prototype.cleanRaws.call(this, keepBetween);
	        if (this.nodes) {
	            for (var _iterator5 = this.nodes, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
	                var _ref5;
	
	                if (_isArray5) {
	                    if (_i5 >= _iterator5.length) break;
	                    _ref5 = _iterator5[_i5++];
	                } else {
	                    _i5 = _iterator5.next();
	                    if (_i5.done) break;
	                    _ref5 = _i5.value;
	                }
	
	                var node = _ref5;
	                node.cleanRaws(keepBetween);
	            }
	        }
	    };
	
	    /**
	     * Insert new node before old node within the container.
	     *
	     * @param {Node|number} exist             - child or child’s index.
	     * @param {Node|object|string|Node[]} add - new node
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }));
	     */
	
	
	    Container.prototype.insertBefore = function insertBefore(exist, add) {
	        exist = this.index(exist);
	
	        var type = exist === 0 ? 'prepend' : false;
	        var nodes = this.normalize(add, this.nodes[exist], type).reverse();
	        for (var _iterator6 = nodes, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
	            var _ref6;
	
	            if (_isArray6) {
	                if (_i6 >= _iterator6.length) break;
	                _ref6 = _iterator6[_i6++];
	            } else {
	                _i6 = _iterator6.next();
	                if (_i6.done) break;
	                _ref6 = _i6.value;
	            }
	
	            var node = _ref6;
	            this.nodes.splice(exist, 0, node);
	        }var index = void 0;
	        for (var id in this.indexes) {
	            index = this.indexes[id];
	            if (exist <= index) {
	                this.indexes[id] = index + nodes.length;
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Insert new node after old node within the container.
	     *
	     * @param {Node|number} exist             - child or child’s index
	     * @param {Node|object|string|Node[]} add - new node
	     *
	     * @return {Node} this node for methods chain
	     */
	
	
	    Container.prototype.insertAfter = function insertAfter(exist, add) {
	        exist = this.index(exist);
	
	        var nodes = this.normalize(add, this.nodes[exist]).reverse();
	        for (var _iterator7 = nodes, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
	            var _ref7;
	
	            if (_isArray7) {
	                if (_i7 >= _iterator7.length) break;
	                _ref7 = _iterator7[_i7++];
	            } else {
	                _i7 = _iterator7.next();
	                if (_i7.done) break;
	                _ref7 = _i7.value;
	            }
	
	            var node = _ref7;
	            this.nodes.splice(exist + 1, 0, node);
	        }var index = void 0;
	        for (var id in this.indexes) {
	            index = this.indexes[id];
	            if (exist < index) {
	                this.indexes[id] = index + nodes.length;
	            }
	        }
	
	        return this;
	    };
	
	    Container.prototype.remove = function remove(child) {
	        if (typeof child !== 'undefined') {
	            (0, _warnOnce2.default)('Container#remove is deprecated. ' + 'Use Container#removeChild');
	            this.removeChild(child);
	        } else {
	            _Node.prototype.remove.call(this);
	        }
	        return this;
	    };
	
	    /**
	     * Removes node from the container and cleans the parent properties
	     * from the node and its children.
	     *
	     * @param {Node|number} child - child or child’s index
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * rule.nodes.length  //=> 5
	     * rule.removeChild(decl);
	     * rule.nodes.length  //=> 4
	     * decl.parent        //=> undefined
	     */
	
	
	    Container.prototype.removeChild = function removeChild(child) {
	        child = this.index(child);
	        this.nodes[child].parent = undefined;
	        this.nodes.splice(child, 1);
	
	        var index = void 0;
	        for (var id in this.indexes) {
	            index = this.indexes[id];
	            if (index >= child) {
	                this.indexes[id] = index - 1;
	            }
	        }
	
	        return this;
	    };
	
	    /**
	     * Removes all children from the container
	     * and cleans their parent properties.
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * rule.removeAll();
	     * rule.nodes.length //=> 0
	     */
	
	
	    Container.prototype.removeAll = function removeAll() {
	        for (var _iterator8 = this.nodes, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
	            var _ref8;
	
	            if (_isArray8) {
	                if (_i8 >= _iterator8.length) break;
	                _ref8 = _iterator8[_i8++];
	            } else {
	                _i8 = _iterator8.next();
	                if (_i8.done) break;
	                _ref8 = _i8.value;
	            }
	
	            var node = _ref8;
	            node.parent = undefined;
	        }this.nodes = [];
	        return this;
	    };
	
	    /**
	     * Passes all declaration values within the container that match pattern
	     * through callback, replacing those values with the returned result
	     * of callback.
	     *
	     * This method is useful if you are using a custom unit or function
	     * and need to iterate through all values.
	     *
	     * @param {string|RegExp} pattern      - replace pattern
	     * @param {object} opts                - options to speed up the search
	     * @param {string|string[]} opts.props - an array of property names
	     * @param {string} opts.fast           - string that’s used
	     *                                       to narrow down values and speed up
	                                             the regexp search
	     * @param {function|string} callback   - string to replace pattern
	     *                                       or callback that returns a new
	     *                                       value.
	     *                                       The callback will receive
	     *                                       the same arguments as those
	     *                                       passed to a function parameter
	     *                                       of `String#replace`.
	     *
	     * @return {Node} this node for methods chain
	     *
	     * @example
	     * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
	     *   return 15 * parseInt(string) + 'px';
	     * });
	     */
	
	
	    Container.prototype.replaceValues = function replaceValues(pattern, opts, callback) {
	        if (!callback) {
	            callback = opts;
	            opts = {};
	        }
	
	        this.walkDecls(function (decl) {
	            if (opts.props && opts.props.indexOf(decl.prop) === -1) return;
	            if (opts.fast && decl.value.indexOf(opts.fast) === -1) return;
	
	            decl.value = decl.value.replace(pattern, callback);
	        });
	
	        return this;
	    };
	
	    /**
	     * Returns `true` if callback returns `true`
	     * for all of the container’s children.
	     *
	     * @param {childCondition} condition - iterator returns true or false.
	     *
	     * @return {boolean} is every child pass condition
	     *
	     * @example
	     * const noPrefixes = rule.every(i => i.prop[0] !== '-');
	     */
	
	
	    Container.prototype.every = function every(condition) {
	        return this.nodes.every(condition);
	    };
	
	    /**
	     * Returns `true` if callback returns `true` for (at least) one
	     * of the container’s children.
	     *
	     * @param {childCondition} condition - iterator returns true or false.
	     *
	     * @return {boolean} is some child pass condition
	     *
	     * @example
	     * const hasPrefix = rule.some(i => i.prop[0] === '-');
	     */
	
	
	    Container.prototype.some = function some(condition) {
	        return this.nodes.some(condition);
	    };
	
	    /**
	     * Returns a `child`’s index within the {@link Container#nodes} array.
	     *
	     * @param {Node} child - child of the current container.
	     *
	     * @return {number} child index
	     *
	     * @example
	     * rule.index( rule.nodes[2] ) //=> 2
	     */
	
	
	    Container.prototype.index = function index(child) {
	        if (typeof child === 'number') {
	            return child;
	        } else {
	            return this.nodes.indexOf(child);
	        }
	    };
	
	    /**
	     * The container’s first child.
	     *
	     * @type {Node}
	     *
	     * @example
	     * rule.first == rules.nodes[0];
	     */
	
	
	    Container.prototype.normalize = function normalize(nodes, sample) {
	        var _this2 = this;
	
	        if (typeof nodes === 'string') {
	            var parse = __webpack_require__(45);
	            nodes = cleanSource(parse(nodes).nodes);
	        } else if (!Array.isArray(nodes)) {
	            if (nodes.type === 'root') {
	                nodes = nodes.nodes;
	            } else if (nodes.type) {
	                nodes = [nodes];
	            } else if (nodes.prop) {
	                if (typeof nodes.value === 'undefined') {
	                    throw new Error('Value field is missed in node creation');
	                } else if (typeof nodes.value !== 'string') {
	                    nodes.value = String(nodes.value);
	                }
	                nodes = [new _declaration2.default(nodes)];
	            } else if (nodes.selector) {
	                var Rule = __webpack_require__(50);
	                nodes = [new Rule(nodes)];
	            } else if (nodes.name) {
	                var AtRule = __webpack_require__(48);
	                nodes = [new AtRule(nodes)];
	            } else if (nodes.text) {
	                nodes = [new _comment2.default(nodes)];
	            } else {
	                throw new Error('Unknown node type in node creation');
	            }
	        }
	
	        var processed = nodes.map(function (i) {
	            if (typeof i.raws === 'undefined') i = _this2.rebuild(i);
	
	            if (i.parent) i = i.clone();
	            if (typeof i.raws.before === 'undefined') {
	                if (sample && typeof sample.raws.before !== 'undefined') {
	                    i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
	                }
	            }
	            i.parent = _this2;
	            return i;
	        });
	
	        return processed;
	    };
	
	    Container.prototype.rebuild = function rebuild(node, parent) {
	        var _this3 = this;
	
	        var fix = void 0;
	        if (node.type === 'root') {
	            var Root = __webpack_require__(52);
	            fix = new Root();
	        } else if (node.type === 'atrule') {
	            var AtRule = __webpack_require__(48);
	            fix = new AtRule();
	        } else if (node.type === 'rule') {
	            var Rule = __webpack_require__(50);
	            fix = new Rule();
	        } else if (node.type === 'decl') {
	            fix = new _declaration2.default();
	        } else if (node.type === 'comment') {
	            fix = new _comment2.default();
	        }
	
	        for (var i in node) {
	            if (i === 'nodes') {
	                fix.nodes = node.nodes.map(function (j) {
	                    return _this3.rebuild(j, fix);
	                });
	            } else if (i === 'parent' && parent) {
	                fix.parent = parent;
	            } else if (node.hasOwnProperty(i)) {
	                fix[i] = node[i];
	            }
	        }
	
	        return fix;
	    };
	
	    Container.prototype.eachInside = function eachInside(callback) {
	        (0, _warnOnce2.default)('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
	        return this.walk(callback);
	    };
	
	    Container.prototype.eachDecl = function eachDecl(prop, callback) {
	        (0, _warnOnce2.default)('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
	        return this.walkDecls(prop, callback);
	    };
	
	    Container.prototype.eachRule = function eachRule(selector, callback) {
	        (0, _warnOnce2.default)('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
	        return this.walkRules(selector, callback);
	    };
	
	    Container.prototype.eachAtRule = function eachAtRule(name, callback) {
	        (0, _warnOnce2.default)('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
	        return this.walkAtRules(name, callback);
	    };
	
	    Container.prototype.eachComment = function eachComment(callback) {
	        (0, _warnOnce2.default)('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
	        return this.walkComments(callback);
	    };
	
	    _createClass(Container, [{
	        key: 'first',
	        get: function get() {
	            if (!this.nodes) return undefined;
	            return this.nodes[0];
	        }
	
	        /**
	         * The container’s last child.
	         *
	         * @type {Node}
	         *
	         * @example
	         * rule.last == rule.nodes[rule.nodes.length - 1];
	         */
	
	    }, {
	        key: 'last',
	        get: function get() {
	            if (!this.nodes) return undefined;
	            return this.nodes[this.nodes.length - 1];
	        }
	    }, {
	        key: 'semicolon',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
	            return this.raws.semicolon;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
	            this.raws.semicolon = val;
	        }
	    }, {
	        key: 'after',
	        get: function get() {
	            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
	            return this.raws.after;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
	            this.raws.after = val;
	        }
	
	        /**
	         * @memberof Container#
	         * @member {Node[]} nodes - an array containing the container’s children
	         *
	         * @example
	         * const root = postcss.parse('a { color: black }');
	         * root.nodes.length           //=> 1
	         * root.nodes[0].selector      //=> 'a'
	         * root.nodes[0].nodes[0].prop //=> 'color'
	         */
	
	    }]);
	
	    return Container;
	}(_node2.default);
	
	exports.default = Container;
	
	/**
	 * @callback childCondition
	 * @param {Node} node    - container child
	 * @param {number} index - child index
	 * @param {Node[]} nodes - all container children
	 * @return {boolean}
	 */
	
	/**
	 * @callback childIterator
	 * @param {Node} node    - container child
	 * @param {number} index - child index
	 * @return {false|undefined} returning `false` will break iteration
	 */
	
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lci5lczYiXSwibmFtZXMiOlsiY2xlYW5Tb3VyY2UiLCJub2RlcyIsIm1hcCIsImkiLCJzb3VyY2UiLCJDb250YWluZXIiLCJwdXNoIiwiY2hpbGQiLCJwYXJlbnQiLCJlYWNoIiwiY2FsbGJhY2siLCJsYXN0RWFjaCIsImluZGV4ZXMiLCJpZCIsInVuZGVmaW5lZCIsImluZGV4IiwicmVzdWx0IiwibGVuZ3RoIiwid2FsayIsIndhbGtEZWNscyIsInByb3AiLCJ0eXBlIiwiUmVnRXhwIiwidGVzdCIsIndhbGtSdWxlcyIsInNlbGVjdG9yIiwid2Fsa0F0UnVsZXMiLCJuYW1lIiwid2Fsa0NvbW1lbnRzIiwiYXBwZW5kIiwiY2hpbGRyZW4iLCJub3JtYWxpemUiLCJsYXN0Iiwibm9kZSIsInByZXBlbmQiLCJyZXZlcnNlIiwiZmlyc3QiLCJ1bnNoaWZ0IiwiY2xlYW5SYXdzIiwia2VlcEJldHdlZW4iLCJpbnNlcnRCZWZvcmUiLCJleGlzdCIsImFkZCIsInNwbGljZSIsImluc2VydEFmdGVyIiwicmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmVBbGwiLCJyZXBsYWNlVmFsdWVzIiwicGF0dGVybiIsIm9wdHMiLCJwcm9wcyIsImluZGV4T2YiLCJkZWNsIiwiZmFzdCIsInZhbHVlIiwicmVwbGFjZSIsImV2ZXJ5IiwiY29uZGl0aW9uIiwic29tZSIsInNhbXBsZSIsInBhcnNlIiwicmVxdWlyZSIsIkFycmF5IiwiaXNBcnJheSIsIkVycm9yIiwiU3RyaW5nIiwiUnVsZSIsIkF0UnVsZSIsInRleHQiLCJwcm9jZXNzZWQiLCJyYXdzIiwicmVidWlsZCIsImNsb25lIiwiYmVmb3JlIiwiZml4IiwiUm9vdCIsImoiLCJoYXNPd25Qcm9wZXJ0eSIsImVhY2hJbnNpZGUiLCJlYWNoRGVjbCIsImVhY2hSdWxlIiwiZWFjaEF0UnVsZSIsImVhY2hDb21tZW50Iiwic2VtaWNvbG9uIiwidmFsIiwiYWZ0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFB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UUFBbEIsQ0FBUDtBQUNILEs7Ozs7NEJBekhXO0FBQ1IsZ0JBQUssQ0FBQyxLQUFLVCxLQUFYLEVBQW1CLE9BQU9hLFNBQVA7QUFDbkIsbUJBQU8sS0FBS2IsS0FBTCxDQUFXLENBQVgsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs0QkFRVztBQUNQLGdCQUFLLENBQUMsS0FBS0EsS0FBWCxFQUFtQixPQUFPYSxTQUFQO0FBQ25CLG1CQUFPLEtBQUtiLEtBQUwsQ0FBVyxLQUFLQSxLQUFMLENBQVdnQixNQUFYLEdBQW9CLENBQS9CLENBQVA7QUFDSDs7OzRCQTJHZTtBQUNaLG9DQUFTLHVEQUFUO0FBQ0EsbUJBQU8sS0FBS3NELElBQUwsQ0FBVWEsU0FBakI7QUFDSCxTOzBCQUVhQyxHLEVBQUs7QUFDZixvQ0FBUyx1REFBVDtBQUNBLGlCQUFLZCxJQUFMLENBQVVhLFNBQVYsR0FBc0JDLEdBQXRCO0FBQ0g7Ozs0QkFFVztBQUNSLG9DQUFTLCtDQUFUO0FBQ0EsbUJBQU8sS0FBS2QsSUFBTCxDQUFVZSxLQUFqQjtBQUNILFM7MEJBRVNELEcsRUFBSztBQUNYLG9DQUFTLCtDQUFUO0FBQ0EsaUJBQUtkLElBQUwsQ0FBVWUsS0FBVixHQUFrQkQsR0FBbEI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztrQkFhV2hGLFM7O0FBR2Y7Ozs7Ozs7O0FBUUEiLCJmaWxlIjoiY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlY2xhcmF0aW9uIGZyb20gJy4vZGVjbGFyYXRpb24nO1xuaW1wb3J0IHdhcm5PbmNlICAgIGZyb20gJy4vd2Fybi1vbmNlJztcbmltcG9ydCBDb21tZW50ICAgICBmcm9tICcuL2NvbW1lbnQnO1xuaW1wb3J0IE5vZGUgICAgICAgIGZyb20gJy4vbm9kZSc7XG5cbmZ1bmN0aW9uIGNsZWFuU291cmNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIG5vZGVzLm1hcCggaSA9PiB7XG4gICAgICAgIGlmICggaS5ub2RlcyApIGkubm9kZXMgPSBjbGVhblNvdXJjZShpLm5vZGVzKTtcbiAgICAgICAgZGVsZXRlIGkuc291cmNlO1xuICAgICAgICByZXR1cm4gaTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIFJvb3R9LCB7QGxpbmsgQXRSdWxlfSwgYW5kIHtAbGluayBSdWxlfSBjb250YWluZXIgbm9kZXNcbiAqIGluaGVyaXQgc29tZSBjb21tb24gbWV0aG9kcyB0byBoZWxwIHdvcmsgd2l0aCB0aGVpciBjaGlsZHJlbi5cbiAqXG4gKiBOb3RlIHRoYXQgYWxsIGNvbnRhaW5lcnMgY2FuIHN0b3JlIGFueSBjb250ZW50LiBJZiB5b3Ugd3JpdGUgYSBydWxlIGluc2lkZVxuICogYSBydWxlLCBQb3N0Q1NTIHdpbGwgcGFyc2UgaXQuXG4gKlxuICogQGV4dGVuZHMgTm9kZVxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIE5vZGUge1xuXG4gICAgcHVzaChjaGlsZCkge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLm5vZGVzLnB1c2goY2hpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBjb250YWluZXLigJlzIGltbWVkaWF0ZSBjaGlsZHJlbixcbiAgICAgKiBjYWxsaW5nIGBjYWxsYmFja2AgZm9yIGVhY2ggY2hpbGQuXG4gICAgICpcbiAgICAgKiBSZXR1cm5pbmcgYGZhbHNlYCBpbiB0aGUgY2FsbGJhY2sgd2lsbCBicmVhayBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBvbmx5IGl0ZXJhdGVzIHRocm91Z2ggdGhlIGNvbnRhaW5lcuKAmXMgaW1tZWRpYXRlIGNoaWxkcmVuLlxuICAgICAqIElmIHlvdSBuZWVkIHRvIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgdGhyb3VnaCBhbGwgdGhlIGNvbnRhaW5lcuKAmXMgZGVzY2VuZGFudFxuICAgICAqIG5vZGVzLCB1c2Uge0BsaW5rIENvbnRhaW5lciN3YWxrfS5cbiAgICAgKlxuICAgICAqIFVubGlrZSB0aGUgZm9yIGB7fWAtY3ljbGUgb3IgYEFycmF5I2ZvckVhY2hgIHRoaXMgaXRlcmF0b3IgaXMgc2FmZVxuICAgICAqIGlmIHlvdSBhcmUgbXV0YXRpbmcgdGhlIGFycmF5IG9mIGNoaWxkIG5vZGVzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICogUG9zdENTUyB3aWxsIGFkanVzdCB0aGUgY3VycmVudCBpbmRleCB0byBtYXRjaCB0aGUgbXV0YXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2EgeyBjb2xvcjogYmxhY2s7IHotaW5kZXg6IDEgfScpO1xuICAgICAqIGNvbnN0IHJ1bGUgPSByb290LmZpcnN0O1xuICAgICAqXG4gICAgICogZm9yICggbGV0IGRlY2wgb2YgcnVsZS5ub2RlcyApIHtcbiAgICAgKiAgICAgZGVjbC5jbG9uZUJlZm9yZSh7IHByb3A6ICctd2Via2l0LScgKyBkZWNsLnByb3AgfSk7XG4gICAgICogICAgIC8vIEN5Y2xlIHdpbGwgYmUgaW5maW5pdGUsIGJlY2F1c2UgY2xvbmVCZWZvcmUgbW92ZXMgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAqICAgICAvLyB0byB0aGUgbmV4dCBpbmRleFxuICAgICAqIH1cbiAgICAgKlxuICAgICAqIHJ1bGUuZWFjaChkZWNsID0+IHtcbiAgICAgKiAgICAgZGVjbC5jbG9uZUJlZm9yZSh7IHByb3A6ICctd2Via2l0LScgKyBkZWNsLnByb3AgfSk7XG4gICAgICogICAgIC8vIFdpbGwgYmUgZXhlY3V0ZWQgb25seSBmb3IgY29sb3IgYW5kIHotaW5kZXhcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBlYWNoKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICggIXRoaXMubGFzdEVhY2ggKSB0aGlzLmxhc3RFYWNoID0gMDtcbiAgICAgICAgaWYgKCAhdGhpcy5pbmRleGVzICkgdGhpcy5pbmRleGVzID0geyB9O1xuXG4gICAgICAgIHRoaXMubGFzdEVhY2ggKz0gMTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5sYXN0RWFjaDtcbiAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IDA7XG5cbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgbGV0IGluZGV4LCByZXN1bHQ7XG4gICAgICAgIHdoaWxlICggdGhpcy5pbmRleGVzW2lkXSA8IHRoaXMubm9kZXMubGVuZ3RoICkge1xuICAgICAgICAgICAgaW5kZXggID0gdGhpcy5pbmRleGVzW2lkXTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHRoaXMubm9kZXNbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgICAgICBpZiAoIHJlc3VsdCA9PT0gZmFsc2UgKSBicmVhaztcblxuICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHRoaXMuaW5kZXhlc1tpZF07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmF2ZXJzZXMgdGhlIGNvbnRhaW5lcuKAmXMgZGVzY2VuZGFudCBub2RlcywgY2FsbGluZyBjYWxsYmFja1xuICAgICAqIGZvciBlYWNoIG5vZGUuXG4gICAgICpcbiAgICAgKiBMaWtlIGNvbnRhaW5lci5lYWNoKCksIHRoaXMgbWV0aG9kIGlzIHNhZmUgdG8gdXNlXG4gICAgICogaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIElmIHlvdSBvbmx5IG5lZWQgdG8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBjb250YWluZXLigJlzIGltbWVkaWF0ZSBjaGlsZHJlbixcbiAgICAgKiB1c2Uge0BsaW5rIENvbnRhaW5lciNlYWNofS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgLSBpdGVyYXRvciByZWNlaXZlcyBlYWNoIG5vZGUgYW5kIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtmYWxzZXx1bmRlZmluZWR9IHJldHVybnMgYGZhbHNlYCBpZiBpdGVyYXRpb24gd2FzIGJyb2tlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAgKiAgIC8vIFRyYXZlcnNlcyBhbGwgZGVzY2VuZGFudCBub2Rlcy5cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgIGlmICggcmVzdWx0ICE9PSBmYWxzZSAmJiBjaGlsZC53YWxrICkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNoaWxkLndhbGsoY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHRoZSBjb250YWluZXLigJlzIGRlc2NlbmRhbnQgbm9kZXMsIGNhbGxpbmcgY2FsbGJhY2tcbiAgICAgKiBmb3IgZWFjaCBkZWNsYXJhdGlvbiBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgZGVjbGFyYXRpb25zXG4gICAgICogd2l0aCBtYXRjaGluZyBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogTGlrZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LCB0aGlzIG1ldGhvZCBpcyBzYWZlXG4gICAgICogdG8gdXNlIGlmIHlvdSBhcmUgbXV0YXRpbmcgYXJyYXlzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IFtwcm9wXSAgIC0gc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBmaWx0ZXIgZGVjbGFyYXRpb25zIGJ5IHByb3BlcnR5IG5hbWVcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LndhbGtEZWNscyhkZWNsID0+IHtcbiAgICAgKiAgIGNoZWNrUHJvcGVydHlTdXBwb3J0KGRlY2wucHJvcCk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiByb290LndhbGtEZWNscygnYm9yZGVyLXJhZGl1cycsIGRlY2wgPT4ge1xuICAgICAqICAgZGVjbC5yZW1vdmUoKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHJvb3Qud2Fsa0RlY2xzKC9eYmFja2dyb3VuZC8sIGRlY2wgPT4ge1xuICAgICAqICAgZGVjbC52YWx1ZSA9IHRha2VGaXJzdENvbG9yRnJvbUdyYWRpZW50KGRlY2wudmFsdWUpO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHdhbGtEZWNscyhwcm9wLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gcHJvcDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2RlY2wnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCBwcm9wIGluc3RhbmNlb2YgUmVnRXhwICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnZGVjbCcgJiYgcHJvcC50ZXN0KGNoaWxkLnByb3ApICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnZGVjbCcgJiYgY2hpbGQucHJvcCA9PT0gcHJvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggcnVsZSBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgcnVsZXNcbiAgICAgKiB3aXRoIG1hdGNoaW5nIHNlbGVjdG9ycy5cbiAgICAgKlxuICAgICAqIExpa2Uge0BsaW5rIENvbnRhaW5lciNlYWNofSwgdGhpcyBtZXRob2QgaXMgc2FmZVxuICAgICAqIHRvIHVzZSBpZiB5b3UgYXJlIG11dGF0aW5nIGFycmF5cyBkdXJpbmcgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBbc2VsZWN0b3JdIC0gc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGZpbHRlciBydWxlcyBieSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgICAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgc2VsZWN0b3JzID0gW107XG4gICAgICogcm9vdC53YWxrUnVsZXMocnVsZSA9PiB7XG4gICAgICogICBzZWxlY3RvcnMucHVzaChydWxlLnNlbGVjdG9yKTtcbiAgICAgKiB9KTtcbiAgICAgKiBjb25zb2xlLmxvZyhgWW91ciBDU1MgdXNlcyAke3NlbGVjdG9ycy5sZW5ndGh9IHNlbGVjdG9yc2ApO1xuICAgICAqL1xuICAgIHdhbGtSdWxlcyhzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCAhY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHNlbGVjdG9yO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdydWxlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICggc2VsZWN0b3IgaW5zdGFuY2VvZiBSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdydWxlJyAmJiBzZWxlY3Rvci50ZXN0KGNoaWxkLnNlbGVjdG9yKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ3J1bGUnICYmIGNoaWxkLnNlbGVjdG9yID09PSBzZWxlY3RvciApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggYXQtcnVsZSBub2RlLlxuICAgICAqXG4gICAgICogSWYgeW91IHBhc3MgYSBmaWx0ZXIsIGl0ZXJhdGlvbiB3aWxsIG9ubHkgaGFwcGVuIG92ZXIgYXQtcnVsZXNcbiAgICAgKiB0aGF0IGhhdmUgbWF0Y2hpbmcgbmFtZXMuXG4gICAgICpcbiAgICAgKiBMaWtlIHtAbGluayBDb250YWluZXIjZWFjaH0sIHRoaXMgbWV0aG9kIGlzIHNhZmVcbiAgICAgKiB0byB1c2UgaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gW25hbWVdICAgLSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGZpbHRlciBhdC1ydWxlcyBieSBuYW1lXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC53YWxrQXRSdWxlcyhydWxlID0+IHtcbiAgICAgKiAgIGlmICggaXNPbGQocnVsZS5uYW1lKSApIHJ1bGUucmVtb3ZlKCk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBsZXQgZmlyc3QgPSBmYWxzZTtcbiAgICAgKiByb290LndhbGtBdFJ1bGVzKCdjaGFyc2V0JywgcnVsZSA9PiB7XG4gICAgICogICBpZiAoICFmaXJzdCApIHtcbiAgICAgKiAgICAgZmlyc3QgPSB0cnVlO1xuICAgICAqICAgfSBlbHNlIHtcbiAgICAgKiAgICAgcnVsZS5yZW1vdmUoKTtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrQXRSdWxlcyhuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gbmFtZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhjaGlsZCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIG5hbWUgaW5zdGFuY2VvZiBSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdhdHJ1bGUnICYmIG5hbWUudGVzdChjaGlsZC5uYW1lKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgJiYgY2hpbGQubmFtZSA9PT0gbmFtZSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggY29tbWVudCBub2RlLlxuICAgICAqXG4gICAgICogTGlrZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LCB0aGlzIG1ldGhvZCBpcyBzYWZlXG4gICAgICogdG8gdXNlIGlmIHlvdSBhcmUgbXV0YXRpbmcgYXJyYXlzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LndhbGtDb21tZW50cyhjb21tZW50ID0+IHtcbiAgICAgKiAgIGNvbW1lbnQucmVtb3ZlKCk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgd2Fsa0NvbW1lbnRzKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnY29tbWVudCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBuZXcgbm9kZXMgdG8gdGhlIHN0YXJ0IG9mIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gey4uLihOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdKX0gY2hpbGRyZW4gLSBuZXcgbm9kZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBkZWNsMSA9IHBvc3Rjc3MuZGVjbCh7IHByb3A6ICdjb2xvcicsIHZhbHVlOiAnYmxhY2snIH0pO1xuICAgICAqIGNvbnN0IGRlY2wyID0gcG9zdGNzcy5kZWNsKHsgcHJvcDogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogJ3doaXRlJyB9KTtcbiAgICAgKiBydWxlLmFwcGVuZChkZWNsMSwgZGVjbDIpO1xuICAgICAqXG4gICAgICogcm9vdC5hcHBlbmQoeyBuYW1lOiAnY2hhcnNldCcsIHBhcmFtczogJ1wiVVRGLThcIicgfSk7ICAvLyBhdC1ydWxlXG4gICAgICogcm9vdC5hcHBlbmQoeyBzZWxlY3RvcjogJ2EnIH0pOyAgICAgICAgICAgICAgICAgICAgICAgLy8gcnVsZVxuICAgICAqIHJ1bGUuYXBwZW5kKHsgcHJvcDogJ2NvbG9yJywgdmFsdWU6ICdibGFjaycgfSk7ICAgICAgIC8vIGRlY2xhcmF0aW9uXG4gICAgICogcnVsZS5hcHBlbmQoeyB0ZXh0OiAnQ29tbWVudCcgfSkgICAgICAgICAgICAgICAgICAgICAgLy8gY29tbWVudFxuICAgICAqXG4gICAgICogcm9vdC5hcHBlbmQoJ2Ege30nKTtcbiAgICAgKiByb290LmZpcnN0LmFwcGVuZCgnY29sb3I6IGJsYWNrOyB6LWluZGV4OiAxJyk7XG4gICAgICovXG4gICAgYXBwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgICAgIGZvciAoIGxldCBjaGlsZCBvZiBjaGlsZHJlbiApIHtcbiAgICAgICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGNoaWxkLCB0aGlzLmxhc3QpO1xuICAgICAgICAgICAgZm9yICggbGV0IG5vZGUgb2Ygbm9kZXMgKSB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBuZXcgbm9kZXMgdG8gdGhlIGVuZCBvZiB0aGUgY29udGFpbmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsuLi4oTm9kZXxvYmplY3R8c3RyaW5nfE5vZGVbXSl9IGNoaWxkcmVuIC0gbmV3IG5vZGVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgZGVjbDEgPSBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KTtcbiAgICAgKiBjb25zdCBkZWNsMiA9IHBvc3Rjc3MuZGVjbCh7IHByb3A6ICdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWU6ICd3aGl0ZScgfSk7XG4gICAgICogcnVsZS5wcmVwZW5kKGRlY2wxLCBkZWNsMik7XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCh7IG5hbWU6ICdjaGFyc2V0JywgcGFyYW1zOiAnXCJVVEYtOFwiJyB9KTsgIC8vIGF0LXJ1bGVcbiAgICAgKiByb290LmFwcGVuZCh7IHNlbGVjdG9yOiAnYScgfSk7ICAgICAgICAgICAgICAgICAgICAgICAvLyBydWxlXG4gICAgICogcnVsZS5hcHBlbmQoeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KTsgICAgICAgLy8gZGVjbGFyYXRpb25cbiAgICAgKiBydWxlLmFwcGVuZCh7IHRleHQ6ICdDb21tZW50JyB9KSAgICAgICAgICAgICAgICAgICAgICAvLyBjb21tZW50XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCgnYSB7fScpO1xuICAgICAqIHJvb3QuZmlyc3QuYXBwZW5kKCdjb2xvcjogYmxhY2s7IHotaW5kZXg6IDEnKTtcbiAgICAgKi9cbiAgICBwcmVwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4ucmV2ZXJzZSgpO1xuICAgICAgICBmb3IgKCBsZXQgY2hpbGQgb2YgY2hpbGRyZW4gKSB7XG4gICAgICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShjaGlsZCwgdGhpcy5maXJzdCwgJ3ByZXBlbmQnKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICBmb3IgKCBsZXQgbm9kZSBvZiBub2RlcyApIHRoaXMubm9kZXMudW5zaGlmdChub2RlKTtcbiAgICAgICAgICAgIGZvciAoIGxldCBpZCBpbiB0aGlzLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IHRoaXMuaW5kZXhlc1tpZF0gKyBub2Rlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xlYW5SYXdzKGtlZXBCZXR3ZWVuKSB7XG4gICAgICAgIHN1cGVyLmNsZWFuUmF3cyhrZWVwQmV0d2Vlbik7XG4gICAgICAgIGlmICggdGhpcy5ub2RlcyApIHtcbiAgICAgICAgICAgIGZvciAoIGxldCBub2RlIG9mIHRoaXMubm9kZXMgKSBub2RlLmNsZWFuUmF3cyhrZWVwQmV0d2Vlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgbmV3IG5vZGUgYmVmb3JlIG9sZCBub2RlIHdpdGhpbiB0aGUgY29udGFpbmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOb2RlfG51bWJlcn0gZXhpc3QgICAgICAgICAgICAgLSBjaGlsZCBvciBjaGlsZOKAmXMgaW5kZXguXG4gICAgICogQHBhcmFtIHtOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdfSBhZGQgLSBuZXcgbm9kZVxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gdGhpcyBub2RlIGZvciBtZXRob2RzIGNoYWluXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuaW5zZXJ0QmVmb3JlKGRlY2wsIGRlY2wuY2xvbmUoeyBwcm9wOiAnLXdlYmtpdC0nICsgZGVjbC5wcm9wIH0pKTtcbiAgICAgKi9cbiAgICBpbnNlcnRCZWZvcmUoZXhpc3QsIGFkZCkge1xuICAgICAgICBleGlzdCA9IHRoaXMuaW5kZXgoZXhpc3QpO1xuXG4gICAgICAgIGxldCB0eXBlICA9IGV4aXN0ID09PSAwID8gJ3ByZXBlbmQnIDogZmFsc2U7XG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGFkZCwgdGhpcy5ub2Rlc1tleGlzdF0sIHR5cGUpLnJldmVyc2UoKTtcbiAgICAgICAgZm9yICggbGV0IG5vZGUgb2Ygbm9kZXMgKSB0aGlzLm5vZGVzLnNwbGljZShleGlzdCwgMCwgbm9kZSk7XG5cbiAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICBmb3IgKCBsZXQgaWQgaW4gdGhpcy5pbmRleGVzICkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4ZXNbaWRdO1xuICAgICAgICAgICAgaWYgKCBleGlzdCA8PSBpbmRleCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggKyBub2Rlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgbmV3IG5vZGUgYWZ0ZXIgb2xkIG5vZGUgd2l0aGluIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge05vZGV8bnVtYmVyfSBleGlzdCAgICAgICAgICAgICAtIGNoaWxkIG9yIGNoaWxk4oCZcyBpbmRleFxuICAgICAqIEBwYXJhbSB7Tm9kZXxvYmplY3R8c3RyaW5nfE5vZGVbXX0gYWRkIC0gbmV3IG5vZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqL1xuICAgIGluc2VydEFmdGVyKGV4aXN0LCBhZGQpIHtcbiAgICAgICAgZXhpc3QgPSB0aGlzLmluZGV4KGV4aXN0KTtcblxuICAgICAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShhZGQsIHRoaXMubm9kZXNbZXhpc3RdKS5yZXZlcnNlKCk7XG4gICAgICAgIGZvciAoIGxldCBub2RlIG9mIG5vZGVzICkgdGhpcy5ub2Rlcy5zcGxpY2UoZXhpc3QgKyAxLCAwLCBub2RlKTtcblxuICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgIGZvciAoIGxldCBpZCBpbiB0aGlzLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhlc1tpZF07XG4gICAgICAgICAgICBpZiAoIGV4aXN0IDwgaW5kZXggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IGluZGV4ICsgbm9kZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGNoaWxkKSB7XG4gICAgICAgIGlmICggdHlwZW9mIGNoaWxkICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjcmVtb3ZlIGlzIGRlcHJlY2F0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjcmVtb3ZlQ2hpbGQnKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBub2RlIGZyb20gdGhlIGNvbnRhaW5lciBhbmQgY2xlYW5zIHRoZSBwYXJlbnQgcHJvcGVydGllc1xuICAgICAqIGZyb20gdGhlIG5vZGUgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZXxudW1iZXJ9IGNoaWxkIC0gY2hpbGQgb3IgY2hpbGTigJlzIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5ub2Rlcy5sZW5ndGggIC8vPT4gNVxuICAgICAqIHJ1bGUucmVtb3ZlQ2hpbGQoZGVjbCk7XG4gICAgICogcnVsZS5ub2Rlcy5sZW5ndGggIC8vPT4gNFxuICAgICAqIGRlY2wucGFyZW50ICAgICAgICAvLz0+IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkID0gdGhpcy5pbmRleChjaGlsZCk7XG4gICAgICAgIHRoaXMubm9kZXNbY2hpbGRdLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2Rlcy5zcGxpY2UoY2hpbGQsIDEpO1xuXG4gICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgZm9yICggbGV0IGlkIGluIHRoaXMuaW5kZXhlcyApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5pbmRleGVzW2lkXTtcbiAgICAgICAgICAgIGlmICggaW5kZXggPj0gY2hpbGQgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleGVzW2lkXSA9IGluZGV4IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gdGhlIGNvbnRhaW5lclxuICAgICAqIGFuZCBjbGVhbnMgdGhlaXIgcGFyZW50IHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5yZW1vdmVBbGwoKTtcbiAgICAgKiBydWxlLm5vZGVzLmxlbmd0aCAvLz0+IDBcbiAgICAgKi9cbiAgICByZW1vdmVBbGwoKSB7XG4gICAgICAgIGZvciAoIGxldCBub2RlIG9mIHRoaXMubm9kZXMgKSBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXNzZXMgYWxsIGRlY2xhcmF0aW9uIHZhbHVlcyB3aXRoaW4gdGhlIGNvbnRhaW5lciB0aGF0IG1hdGNoIHBhdHRlcm5cbiAgICAgKiB0aHJvdWdoIGNhbGxiYWNrLCByZXBsYWNpbmcgdGhvc2UgdmFsdWVzIHdpdGggdGhlIHJldHVybmVkIHJlc3VsdFxuICAgICAqIG9mIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIGlmIHlvdSBhcmUgdXNpbmcgYSBjdXN0b20gdW5pdCBvciBmdW5jdGlvblxuICAgICAqIGFuZCBuZWVkIHRvIGl0ZXJhdGUgdGhyb3VnaCBhbGwgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBwYXR0ZXJuICAgICAgLSByZXBsYWNlIHBhdHRlcm5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAgICAgICAgICAgICAgICAtIG9wdGlvbnMgdG8gc3BlZWQgdXAgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBvcHRzLnByb3BzIC0gYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5mYXN0ICAgICAgICAgICAtIHN0cmluZyB0aGF04oCZcyB1c2VkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBuYXJyb3cgZG93biB2YWx1ZXMgYW5kIHNwZWVkIHVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVnZXhwIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb258c3RyaW5nfSBjYWxsYmFjayAgIC0gc3RyaW5nIHRvIHJlcGxhY2UgcGF0dGVyblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgY2FsbGJhY2sgdGhhdCByZXR1cm5zIGEgbmV3XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayB3aWxsIHJlY2VpdmVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aG9zZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIHRvIGEgZnVuY3Rpb24gcGFyYW1ldGVyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBgU3RyaW5nI3JlcGxhY2VgLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gdGhpcyBub2RlIGZvciBtZXRob2RzIGNoYWluXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3QucmVwbGFjZVZhbHVlcygvXFxkK3JlbS8sIHsgZmFzdDogJ3JlbScgfSwgc3RyaW5nID0+IHtcbiAgICAgKiAgIHJldHVybiAxNSAqIHBhcnNlSW50KHN0cmluZykgKyAncHgnO1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHJlcGxhY2VWYWx1ZXMocGF0dGVybiwgb3B0cywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCAhY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgICAgICAgICBvcHRzID0geyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53YWxrRGVjbHMoIGRlY2wgPT4ge1xuICAgICAgICAgICAgaWYgKCBvcHRzLnByb3BzICYmIG9wdHMucHJvcHMuaW5kZXhPZihkZWNsLnByb3ApID09PSAtMSApIHJldHVybjtcbiAgICAgICAgICAgIGlmICggb3B0cy5mYXN0ICAmJiBkZWNsLnZhbHVlLmluZGV4T2Yob3B0cy5mYXN0KSA9PT0gLTEgKSByZXR1cm47XG5cbiAgICAgICAgICAgIGRlY2wudmFsdWUgPSBkZWNsLnZhbHVlLnJlcGxhY2UocGF0dGVybiwgY2FsbGJhY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBjYWxsYmFjayByZXR1cm5zIGB0cnVlYFxuICAgICAqIGZvciBhbGwgb2YgdGhlIGNvbnRhaW5lcuKAmXMgY2hpbGRyZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2NoaWxkQ29uZGl0aW9ufSBjb25kaXRpb24gLSBpdGVyYXRvciByZXR1cm5zIHRydWUgb3IgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBpcyBldmVyeSBjaGlsZCBwYXNzIGNvbmRpdGlvblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBub1ByZWZpeGVzID0gcnVsZS5ldmVyeShpID0+IGkucHJvcFswXSAhPT0gJy0nKTtcbiAgICAgKi9cbiAgICBldmVyeShjb25kaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXMuZXZlcnkoY29uZGl0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBjYWxsYmFjayByZXR1cm5zIGB0cnVlYCBmb3IgKGF0IGxlYXN0KSBvbmVcbiAgICAgKiBvZiB0aGUgY29udGFpbmVy4oCZcyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Y2hpbGRDb25kaXRpb259IGNvbmRpdGlvbiAtIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSBvciBmYWxzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHNvbWUgY2hpbGQgcGFzcyBjb25kaXRpb25cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3QgaGFzUHJlZml4ID0gcnVsZS5zb21lKGkgPT4gaS5wcm9wWzBdID09PSAnLScpO1xuICAgICAqL1xuICAgIHNvbWUoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzLnNvbWUoY29uZGl0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYGNoaWxkYOKAmXMgaW5kZXggd2l0aGluIHRoZSB7QGxpbmsgQ29udGFpbmVyI25vZGVzfSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSBjaGlsZCBvZiB0aGUgY3VycmVudCBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGNoaWxkIGluZGV4XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuaW5kZXgoIHJ1bGUubm9kZXNbMl0gKSAvLz0+IDJcbiAgICAgKi9cbiAgICBpbmRleChjaGlsZCkge1xuICAgICAgICBpZiAoIHR5cGVvZiBjaGlsZCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2Rlcy5pbmRleE9mKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXLigJlzIGZpcnN0IGNoaWxkLlxuICAgICAqXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuZmlyc3QgPT0gcnVsZXMubm9kZXNbMF07XG4gICAgICovXG4gICAgZ2V0IGZpcnN0KCkge1xuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXNbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lcuKAmXMgbGFzdCBjaGlsZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLmxhc3QgPT0gcnVsZS5ub2Rlc1tydWxlLm5vZGVzLmxlbmd0aCAtIDFdO1xuICAgICAqL1xuICAgIGdldCBsYXN0KCkge1xuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXNbdGhpcy5ub2Rlcy5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUobm9kZXMsIHNhbXBsZSkge1xuICAgICAgICBpZiAoIHR5cGVvZiBub2RlcyA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBsZXQgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4gICAgICAgICAgICBub2RlcyA9IGNsZWFuU291cmNlKHBhcnNlKG5vZGVzKS5ub2Rlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoICFBcnJheS5pc0FycmF5KG5vZGVzKSApIHtcbiAgICAgICAgICAgIGlmICggbm9kZXMudHlwZSA9PT0gJ3Jvb3QnICkge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gbm9kZXMubm9kZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy50eXBlICkge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25vZGVzXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnByb3AgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2Ygbm9kZXMudmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGZpZWxkIGlzIG1pc3NlZCBpbiBub2RlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIG5vZGVzLnZhbHVlICE9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMudmFsdWUgPSBTdHJpbmcobm9kZXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlcyA9IFtuZXcgRGVjbGFyYXRpb24obm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnNlbGVjdG9yICkge1xuICAgICAgICAgICAgICAgIGxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJyk7XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbbmV3IFJ1bGUobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLm5hbWUgKSB7XG4gICAgICAgICAgICAgICAgbGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpO1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25ldyBBdFJ1bGUobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnRleHQgKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbbmV3IENvbW1lbnQobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG5vZGUgdHlwZSBpbiBub2RlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvY2Vzc2VkID0gbm9kZXMubWFwKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cyA9PT0gJ3VuZGVmaW5lZCcgKSBpID0gdGhpcy5yZWJ1aWxkKGkpO1xuXG4gICAgICAgICAgICBpZiAoIGkucGFyZW50ICkgaSA9IGkuY2xvbmUoKTtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2FtcGxlICYmIHR5cGVvZiBzYW1wbGUucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICBpLnJhd3MuYmVmb3JlID0gc2FtcGxlLnJhd3MuYmVmb3JlLnJlcGxhY2UoL1teXFxzXS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWQ7XG4gICAgfVxuXG4gICAgcmVidWlsZChub2RlLCBwYXJlbnQpIHtcbiAgICAgICAgbGV0IGZpeDtcbiAgICAgICAgaWYgKCBub2RlLnR5cGUgPT09ICdyb290JyApIHtcbiAgICAgICAgICAgIGxldCBSb290ID0gcmVxdWlyZSgnLi9yb290Jyk7XG4gICAgICAgICAgICBmaXggPSBuZXcgUm9vdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdhdHJ1bGUnICkge1xuICAgICAgICAgICAgbGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpO1xuICAgICAgICAgICAgZml4ID0gbmV3IEF0UnVsZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdydWxlJyApIHtcbiAgICAgICAgICAgIGxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJyk7XG4gICAgICAgICAgICBmaXggPSBuZXcgUnVsZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdkZWNsJyApIHtcbiAgICAgICAgICAgIGZpeCA9IG5ldyBEZWNsYXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgIGZpeCA9IG5ldyBDb21tZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCBsZXQgaSBpbiBub2RlICkge1xuICAgICAgICAgICAgaWYgKCBpID09PSAnbm9kZXMnICkge1xuICAgICAgICAgICAgICAgIGZpeC5ub2RlcyA9IG5vZGUubm9kZXMubWFwKCBqID0+IHRoaXMucmVidWlsZChqLCBmaXgpICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpID09PSAncGFyZW50JyAmJiBwYXJlbnQgKSB7XG4gICAgICAgICAgICAgICAgZml4LnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGUuaGFzT3duUHJvcGVydHkoaSkgKSB7XG4gICAgICAgICAgICAgICAgZml4W2ldID0gbm9kZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaXg7XG4gICAgfVxuXG4gICAgZWFjaEluc2lkZShjYWxsYmFjaykge1xuICAgICAgICB3YXJuT25jZSgnQ29udGFpbmVyI2VhY2hJbnNpZGUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGsgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FsayhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZWFjaERlY2wocHJvcCwgY2FsbGJhY2spIHtcbiAgICAgICAgd2Fybk9uY2UoJ0NvbnRhaW5lciNlYWNoRGVjbCBpcyBkZXByZWNhdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjd2Fsa0RlY2xzIGluc3RlYWQuJyk7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGtEZWNscyhwcm9wLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZWFjaFJ1bGUoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaFJ1bGUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtSdWxlcyBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWxrUnVsZXMoc2VsZWN0b3IsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBlYWNoQXRSdWxlKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaEF0UnVsZSBpcyBkZXByZWNhdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjd2Fsa0F0UnVsZXMgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Fsa0F0UnVsZXMobmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGVhY2hDb21tZW50KGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaENvbW1lbnQgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtDb21tZW50cyBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWxrQ29tbWVudHMoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGdldCBzZW1pY29sb24oKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI3NlbWljb2xvbiBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLnNlbWljb2xvbicpO1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdzLnNlbWljb2xvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VtaWNvbG9uKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNzZW1pY29sb24gaXMgZGVwcmVjYXRlZC4gVXNlIE5vZGUjcmF3cy5zZW1pY29sb24nKTtcbiAgICAgICAgdGhpcy5yYXdzLnNlbWljb2xvbiA9IHZhbDtcbiAgICB9XG5cbiAgICBnZXQgYWZ0ZXIoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI2FmdGVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuYWZ0ZXInKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5hZnRlcjtcbiAgICB9XG5cbiAgICBzZXQgYWZ0ZXIodmFsKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI2FmdGVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuYWZ0ZXInKTtcbiAgICAgICAgdGhpcy5yYXdzLmFmdGVyID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBDb250YWluZXIjXG4gICAgICogQG1lbWJlciB7Tm9kZVtdfSBub2RlcyAtIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNvbnRhaW5lcuKAmXMgY2hpbGRyZW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2EgeyBjb2xvcjogYmxhY2sgfScpO1xuICAgICAqIHJvb3Qubm9kZXMubGVuZ3RoICAgICAgICAgICAvLz0+IDFcbiAgICAgKiByb290Lm5vZGVzWzBdLnNlbGVjdG9yICAgICAgLy89PiAnYSdcbiAgICAgKiByb290Lm5vZGVzWzBdLm5vZGVzWzBdLnByb3AgLy89PiAnY29sb3InXG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udGFpbmVyO1xuXG5cbi8qKlxuICogQGNhbGxiYWNrIGNoaWxkQ29uZGl0aW9uXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgICAgLSBjb250YWluZXIgY2hpbGRcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGNoaWxkIGluZGV4XG4gKiBAcGFyYW0ge05vZGVbXX0gbm9kZXMgLSBhbGwgY29udGFpbmVyIGNoaWxkcmVuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIGNoaWxkSXRlcmF0b3JcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgICAtIGNvbnRhaW5lciBjaGlsZFxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gY2hpbGQgaW5kZXhcbiAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJuaW5nIGBmYWxzZWAgd2lsbCBicmVhayBpdGVyYXRpb25cbiAqL1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _container = __webpack_require__(49);
	
	var _container2 = _interopRequireDefault(_container);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	var _list = __webpack_require__(51);
	
	var _list2 = _interopRequireDefault(_list);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a CSS rule: a selector followed by a declaration block.
	 *
	 * @extends Container
	 *
	 * @example
	 * const root = postcss.parse('a{}');
	 * const rule = root.first;
	 * rule.type       //=> 'rule'
	 * rule.toString() //=> 'a{}'
	 */
	var Rule = function (_Container) {
	    _inherits(Rule, _Container);
	
	    function Rule(defaults) {
	        _classCallCheck(this, Rule);
	
	        var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));
	
	        _this.type = 'rule';
	        if (!_this.nodes) _this.nodes = [];
	        return _this;
	    }
	
	    /**
	     * An array containing the rule’s individual selectors.
	     * Groups of selectors are split at commas.
	     *
	     * @type {string[]}
	     *
	     * @example
	     * const root = postcss.parse('a, b { }');
	     * const rule = root.first;
	     *
	     * rule.selector  //=> 'a, b'
	     * rule.selectors //=> ['a', 'b']
	     *
	     * rule.selectors = ['a', 'strong'];
	     * rule.selector //=> 'a, strong'
	     */
	
	
	    _createClass(Rule, [{
	        key: 'selectors',
	        get: function get() {
	            return _list2.default.comma(this.selector);
	        },
	        set: function set(values) {
	            var match = this.selector ? this.selector.match(/,\s*/) : null;
	            var sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen');
	            this.selector = values.join(sep);
	        }
	    }, {
	        key: '_selector',
	        get: function get() {
	            (0, _warnOnce2.default)('Rule#_selector is deprecated. Use Rule#raws.selector');
	            return this.raws.selector;
	        },
	        set: function set(val) {
	            (0, _warnOnce2.default)('Rule#_selector is deprecated. Use Rule#raws.selector');
	            this.raws.selector = val;
	        }
	
	        /**
	         * @memberof Rule#
	         * @member {string} selector - the rule’s full selector represented
	         *                             as a string
	         *
	         * @example
	         * const root = postcss.parse('a, b { }');
	         * const rule = root.first;
	         * rule.selector //=> 'a, b'
	         */
	
	        /**
	         * @memberof Rule#
	         * @member {object} raws - Information to generate byte-to-byte equal
	         *                         node string as it was in the origin input.
	         *
	         * Every parser saves its own properties,
	         * but the default CSS parser uses:
	         *
	         * * `before`: the space symbols before the node. It also stores `*`
	         *   and `_` symbols before the declaration (IE hack).
	         * * `after`: the space symbols after the last child of the node
	         *   to the end of the node.
	         * * `between`: the symbols between the property and value
	         *   for declarations, selector and `{` for rules, or last parameter
	         *   and `{` for at-rules.
	         * * `semicolon`: contains true if the last child has
	         *   an (optional) semicolon.
	         *
	         * PostCSS cleans selectors from comments and extra spaces,
	         * but it stores origin content in raws properties.
	         * As such, if you don’t change a declaration’s value,
	         * PostCSS will use the raw value with comments.
	         *
	         * @example
	         * const root = postcss.parse('a {\n  color:black\n}')
	         * root.first.first.raws //=> { before: '', between: ' ', after: '\n' }
	         */
	
	    }]);
	
	    return Rule;
	}(_container2.default);
	
	exports.default = Rule;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGUuZXM2Il0sIm5hbWVzIjpbIlJ1bGUiLCJkZWZhdWx0cyIsInR5cGUiLCJub2RlcyIsImNvbW1hIiwic2VsZWN0b3IiLCJ2YWx1ZXMiLCJtYXRjaCIsInNlcCIsInJhdyIsImpvaW4iLCJyYXdzIiwidmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7OztJQVdNQSxJOzs7QUFFRixrQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLHFEQUNsQixzQkFBTUEsUUFBTixDQURrQjs7QUFFbEIsY0FBS0MsSUFBTCxHQUFZLE1BQVo7QUFDQSxZQUFLLENBQUMsTUFBS0MsS0FBWCxFQUFtQixNQUFLQSxLQUFMLEdBQWEsRUFBYjtBQUhEO0FBSXJCOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFnQmdCO0FBQ1osbUJBQU8sZUFBS0MsS0FBTCxDQUFXLEtBQUtDLFFBQWhCLENBQVA7QUFDSCxTOzBCQUVhQyxNLEVBQVE7QUFDbEIsZ0JBQUlDLFFBQVEsS0FBS0YsUUFBTCxHQUFnQixLQUFLQSxRQUFMLENBQWNFLEtBQWQsQ0FBb0IsTUFBcEIsQ0FBaEIsR0FBOEMsSUFBMUQ7QUFDQSxnQkFBSUMsTUFBUUQsUUFBUUEsTUFBTSxDQUFOLENBQVIsR0FBbUIsTUFBTSxLQUFLRSxHQUFMLENBQVMsU0FBVCxFQUFvQixZQUFwQixDQUFyQztBQUNBLGlCQUFLSixRQUFMLEdBQWdCQyxPQUFPSSxJQUFQLENBQVlGLEdBQVosQ0FBaEI7QUFDSDs7OzRCQUVlO0FBQ1osb0NBQVMsc0RBQVQ7QUFDQSxtQkFBTyxLQUFLRyxJQUFMLENBQVVOLFFBQWpCO0FBQ0gsUzswQkFFYU8sRyxFQUFLO0FBQ2Ysb0NBQVMsc0RBQVQ7QUFDQSxpQkFBS0QsSUFBTCxDQUFVTixRQUFWLEdBQXFCTyxHQUFyQjtBQUNIOztBQUVEOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBOEJXWixJIiwiZmlsZSI6InJ1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB3YXJuT25jZSAgZnJvbSAnLi93YXJuLW9uY2UnO1xuaW1wb3J0IGxpc3QgICAgICBmcm9tICcuL2xpc3QnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDU1MgcnVsZTogYSBzZWxlY3RvciBmb2xsb3dlZCBieSBhIGRlY2xhcmF0aW9uIGJsb2NrLlxuICpcbiAqIEBleHRlbmRzIENvbnRhaW5lclxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYXt9Jyk7XG4gKiBjb25zdCBydWxlID0gcm9vdC5maXJzdDtcbiAqIHJ1bGUudHlwZSAgICAgICAvLz0+ICdydWxlJ1xuICogcnVsZS50b1N0cmluZygpIC8vPT4gJ2F7fSdcbiAqL1xuY2xhc3MgUnVsZSBleHRlbmRzIENvbnRhaW5lciB7XG5cbiAgICBjb25zdHJ1Y3RvcihkZWZhdWx0cykge1xuICAgICAgICBzdXBlcihkZWZhdWx0cyk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdydWxlJztcbiAgICAgICAgaWYgKCAhdGhpcy5ub2RlcyApIHRoaXMubm9kZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBjb250YWluaW5nIHRoZSBydWxl4oCZcyBpbmRpdmlkdWFsIHNlbGVjdG9ycy5cbiAgICAgKiBHcm91cHMgb2Ygc2VsZWN0b3JzIGFyZSBzcGxpdCBhdCBjb21tYXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhLCBiIHsgfScpO1xuICAgICAqIGNvbnN0IHJ1bGUgPSByb290LmZpcnN0O1xuICAgICAqXG4gICAgICogcnVsZS5zZWxlY3RvciAgLy89PiAnYSwgYidcbiAgICAgKiBydWxlLnNlbGVjdG9ycyAvLz0+IFsnYScsICdiJ11cbiAgICAgKlxuICAgICAqIHJ1bGUuc2VsZWN0b3JzID0gWydhJywgJ3N0cm9uZyddO1xuICAgICAqIHJ1bGUuc2VsZWN0b3IgLy89PiAnYSwgc3Ryb25nJ1xuICAgICAqL1xuICAgIGdldCBzZWxlY3RvcnMoKSB7XG4gICAgICAgIHJldHVybiBsaXN0LmNvbW1hKHRoaXMuc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RvcnModmFsdWVzKSB7XG4gICAgICAgIGxldCBtYXRjaCA9IHRoaXMuc2VsZWN0b3IgPyB0aGlzLnNlbGVjdG9yLm1hdGNoKC8sXFxzKi8pIDogbnVsbDtcbiAgICAgICAgbGV0IHNlcCAgID0gbWF0Y2ggPyBtYXRjaFswXSA6ICcsJyArIHRoaXMucmF3KCdiZXR3ZWVuJywgJ2JlZm9yZU9wZW4nKTtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IHZhbHVlcy5qb2luKHNlcCk7XG4gICAgfVxuXG4gICAgZ2V0IF9zZWxlY3RvcigpIHtcbiAgICAgICAgd2Fybk9uY2UoJ1J1bGUjX3NlbGVjdG9yIGlzIGRlcHJlY2F0ZWQuIFVzZSBSdWxlI3Jhd3Muc2VsZWN0b3InKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5zZWxlY3RvcjtcbiAgICB9XG5cbiAgICBzZXQgX3NlbGVjdG9yKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnUnVsZSNfc2VsZWN0b3IgaXMgZGVwcmVjYXRlZC4gVXNlIFJ1bGUjcmF3cy5zZWxlY3RvcicpO1xuICAgICAgICB0aGlzLnJhd3Muc2VsZWN0b3IgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFJ1bGUjXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzZWxlY3RvciAtIHRoZSBydWxl4oCZcyBmdWxsIHNlbGVjdG9yIHJlcHJlc2VudGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIGEgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhLCBiIHsgfScpO1xuICAgICAqIGNvbnN0IHJ1bGUgPSByb290LmZpcnN0O1xuICAgICAqIHJ1bGUuc2VsZWN0b3IgLy89PiAnYSwgYidcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBSdWxlI1xuICAgICAqIEBtZW1iZXIge29iamVjdH0gcmF3cyAtIEluZm9ybWF0aW9uIHRvIGdlbmVyYXRlIGJ5dGUtdG8tYnl0ZSBlcXVhbFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgc3RyaW5nIGFzIGl0IHdhcyBpbiB0aGUgb3JpZ2luIGlucHV0LlxuICAgICAqXG4gICAgICogRXZlcnkgcGFyc2VyIHNhdmVzIGl0cyBvd24gcHJvcGVydGllcyxcbiAgICAgKiBidXQgdGhlIGRlZmF1bHQgQ1NTIHBhcnNlciB1c2VzOlxuICAgICAqXG4gICAgICogKiBgYmVmb3JlYDogdGhlIHNwYWNlIHN5bWJvbHMgYmVmb3JlIHRoZSBub2RlLiBJdCBhbHNvIHN0b3JlcyBgKmBcbiAgICAgKiAgIGFuZCBgX2Agc3ltYm9scyBiZWZvcmUgdGhlIGRlY2xhcmF0aW9uIChJRSBoYWNrKS5cbiAgICAgKiAqIGBhZnRlcmA6IHRoZSBzcGFjZSBzeW1ib2xzIGFmdGVyIHRoZSBsYXN0IGNoaWxkIG9mIHRoZSBub2RlXG4gICAgICogICB0byB0aGUgZW5kIG9mIHRoZSBub2RlLlxuICAgICAqICogYGJldHdlZW5gOiB0aGUgc3ltYm9scyBiZXR3ZWVuIHRoZSBwcm9wZXJ0eSBhbmQgdmFsdWVcbiAgICAgKiAgIGZvciBkZWNsYXJhdGlvbnMsIHNlbGVjdG9yIGFuZCBge2AgZm9yIHJ1bGVzLCBvciBsYXN0IHBhcmFtZXRlclxuICAgICAqICAgYW5kIGB7YCBmb3IgYXQtcnVsZXMuXG4gICAgICogKiBgc2VtaWNvbG9uYDogY29udGFpbnMgdHJ1ZSBpZiB0aGUgbGFzdCBjaGlsZCBoYXNcbiAgICAgKiAgIGFuIChvcHRpb25hbCkgc2VtaWNvbG9uLlxuICAgICAqXG4gICAgICogUG9zdENTUyBjbGVhbnMgc2VsZWN0b3JzIGZyb20gY29tbWVudHMgYW5kIGV4dHJhIHNwYWNlcyxcbiAgICAgKiBidXQgaXQgc3RvcmVzIG9yaWdpbiBjb250ZW50IGluIHJhd3MgcHJvcGVydGllcy5cbiAgICAgKiBBcyBzdWNoLCBpZiB5b3UgZG9u4oCZdCBjaGFuZ2UgYSBkZWNsYXJhdGlvbuKAmXMgdmFsdWUsXG4gICAgICogUG9zdENTUyB3aWxsIHVzZSB0aGUgcmF3IHZhbHVlIHdpdGggY29tbWVudHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QgPSBwb3N0Y3NzLnBhcnNlKCdhIHtcXG4gIGNvbG9yOmJsYWNrXFxufScpXG4gICAgICogcm9vdC5maXJzdC5maXJzdC5yYXdzIC8vPT4geyBiZWZvcmU6ICcnLCBiZXR3ZWVuOiAnICcsIGFmdGVyOiAnXFxuJyB9XG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUnVsZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	/**
	 * Contains helpers for safely splitting lists of CSS values,
	 * preserving parentheses and quotes.
	 *
	 * @example
	 * const list = postcss.list;
	 *
	 * @namespace list
	 */
	var list = {
	    split: function split(string, separators, last) {
	        var array = [];
	        var current = '';
	        var split = false;
	
	        var func = 0;
	        var quote = false;
	        var escape = false;
	
	        for (var i = 0; i < string.length; i++) {
	            var letter = string[i];
	
	            if (quote) {
	                if (escape) {
	                    escape = false;
	                } else if (letter === '\\') {
	                    escape = true;
	                } else if (letter === quote) {
	                    quote = false;
	                }
	            } else if (letter === '"' || letter === '\'') {
	                quote = letter;
	            } else if (letter === '(') {
	                func += 1;
	            } else if (letter === ')') {
	                if (func > 0) func -= 1;
	            } else if (func === 0) {
	                if (separators.indexOf(letter) !== -1) split = true;
	            }
	
	            if (split) {
	                if (current !== '') array.push(current.trim());
	                current = '';
	                split = false;
	            } else {
	                current += letter;
	            }
	        }
	
	        if (last || current !== '') array.push(current.trim());
	        return array;
	    },
	
	
	    /**
	     * Safely splits space-separated values (such as those for `background`,
	     * `border-radius`, and other shorthand properties).
	     *
	     * @param {string} string - space-separated values
	     *
	     * @return {string[]} split values
	     *
	     * @example
	     * postcss.list.space('1px calc(10% + 1px)') //=> ['1px', 'calc(10% + 1px)']
	     */
	    space: function space(string) {
	        var spaces = [' ', '\n', '\t'];
	        return list.split(string, spaces);
	    },
	
	
	    /**
	     * Safely splits comma-separated values (such as those for `transition-*`
	     * and `background` properties).
	     *
	     * @param {string} string - comma-separated values
	     *
	     * @return {string[]} split values
	     *
	     * @example
	     * postcss.list.comma('black, linear-gradient(white, black)')
	     * //=> ['black', 'linear-gradient(white, black)']
	     */
	    comma: function comma(string) {
	        var comma = ',';
	        return list.split(string, [comma], true);
	    }
	};
	
	exports.default = list;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpc3QuZXM2Il0sIm5hbWVzIjpbImxpc3QiLCJzcGxpdCIsInN0cmluZyIsInNlcGFyYXRvcnMiLCJsYXN0IiwiYXJyYXkiLCJjdXJyZW50IiwiZnVuYyIsInF1b3RlIiwiZXNjYXBlIiwiaSIsImxlbmd0aCIsImxldHRlciIsImluZGV4T2YiLCJwdXNoIiwidHJpbSIsInNwYWNlIiwic3BhY2VzIiwiY29tbWEiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxJQUFJQSxPQUFPO0FBRVBDLFNBRk8saUJBRURDLE1BRkMsRUFFT0MsVUFGUCxFQUVtQkMsSUFGbkIsRUFFeUI7QUFDNUIsWUFBSUMsUUFBVSxFQUFkO0FBQ0EsWUFBSUMsVUFBVSxFQUFkO0FBQ0EsWUFBSUwsUUFBVSxLQUFkOztBQUVBLFlBQUlNLE9BQVUsQ0FBZDtBQUNBLFlBQUlDLFFBQVUsS0FBZDtBQUNBLFlBQUlDLFNBQVUsS0FBZDs7QUFFQSxhQUFNLElBQUlDLElBQUksQ0FBZCxFQUFpQkEsSUFBSVIsT0FBT1MsTUFBNUIsRUFBb0NELEdBQXBDLEVBQTBDO0FBQ3RDLGdCQUFJRSxTQUFTVixPQUFPUSxDQUFQLENBQWI7O0FBRUEsZ0JBQUtGLEtBQUwsRUFBYTtBQUNULG9CQUFLQyxNQUFMLEVBQWM7QUFDVkEsNkJBQVMsS0FBVDtBQUNILGlCQUZELE1BRU8sSUFBS0csV0FBVyxJQUFoQixFQUF1QjtBQUMxQkgsNkJBQVMsSUFBVDtBQUNILGlCQUZNLE1BRUEsSUFBS0csV0FBV0osS0FBaEIsRUFBd0I7QUFDM0JBLDRCQUFRLEtBQVI7QUFDSDtBQUNKLGFBUkQsTUFRTyxJQUFLSSxXQUFXLEdBQVgsSUFBa0JBLFdBQVcsSUFBbEMsRUFBeUM7QUFDNUNKLHdCQUFRSSxNQUFSO0FBQ0gsYUFGTSxNQUVBLElBQUtBLFdBQVcsR0FBaEIsRUFBc0I7QUFDekJMLHdCQUFRLENBQVI7QUFDSCxhQUZNLE1BRUEsSUFBS0ssV0FBVyxHQUFoQixFQUFzQjtBQUN6QixvQkFBS0wsT0FBTyxDQUFaLEVBQWdCQSxRQUFRLENBQVI7QUFDbkIsYUFGTSxNQUVBLElBQUtBLFNBQVMsQ0FBZCxFQUFrQjtBQUNyQixvQkFBS0osV0FBV1UsT0FBWCxDQUFtQkQsTUFBbkIsTUFBK0IsQ0FBQyxDQUFyQyxFQUF5Q1gsUUFBUSxJQUFSO0FBQzVDOztBQUVELGdCQUFLQSxLQUFMLEVBQWE7QUFDVCxvQkFBS0ssWUFBWSxFQUFqQixFQUFzQkQsTUFBTVMsSUFBTixDQUFXUixRQUFRUyxJQUFSLEVBQVg7QUFDdEJULDBCQUFVLEVBQVY7QUFDQUwsd0JBQVUsS0FBVjtBQUNILGFBSkQsTUFJTztBQUNISywyQkFBV00sTUFBWDtBQUNIO0FBQ0o7O0FBRUQsWUFBS1IsUUFBUUUsWUFBWSxFQUF6QixFQUE4QkQsTUFBTVMsSUFBTixDQUFXUixRQUFRUyxJQUFSLEVBQVg7QUFDOUIsZUFBT1YsS0FBUDtBQUNILEtBM0NNOzs7QUE2Q1A7Ozs7Ozs7Ozs7O0FBV0FXLFNBeERPLGlCQXdERGQsTUF4REMsRUF3RE87QUFDVixZQUFJZSxTQUFTLENBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxJQUFaLENBQWI7QUFDQSxlQUFPakIsS0FBS0MsS0FBTCxDQUFXQyxNQUFYLEVBQW1CZSxNQUFuQixDQUFQO0FBQ0gsS0EzRE07OztBQTZEUDs7Ozs7Ozs7Ozs7O0FBWUFDLFNBekVPLGlCQXlFRGhCLE1BekVDLEVBeUVPO0FBQ1YsWUFBSWdCLFFBQVEsR0FBWjtBQUNBLGVBQU9sQixLQUFLQyxLQUFMLENBQVdDLE1BQVgsRUFBbUIsQ0FBQ2dCLEtBQUQsQ0FBbkIsRUFBNEIsSUFBNUIsQ0FBUDtBQUNIO0FBNUVNLENBQVg7O2tCQWdGZWxCLEkiLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udGFpbnMgaGVscGVycyBmb3Igc2FmZWx5IHNwbGl0dGluZyBsaXN0cyBvZiBDU1MgdmFsdWVzLFxuICogcHJlc2VydmluZyBwYXJlbnRoZXNlcyBhbmQgcXVvdGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsaXN0ID0gcG9zdGNzcy5saXN0O1xuICpcbiAqIEBuYW1lc3BhY2UgbGlzdFxuICovXG5sZXQgbGlzdCA9IHtcblxuICAgIHNwbGl0KHN0cmluZywgc2VwYXJhdG9ycywgbGFzdCkge1xuICAgICAgICBsZXQgYXJyYXkgICA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudCA9ICcnO1xuICAgICAgICBsZXQgc3BsaXQgICA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBmdW5jICAgID0gMDtcbiAgICAgICAgbGV0IHF1b3RlICAgPSBmYWxzZTtcbiAgICAgICAgbGV0IGVzY2FwZSAgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBsZXQgbGV0dGVyID0gc3RyaW5nW2ldO1xuXG4gICAgICAgICAgICBpZiAoIHF1b3RlICkge1xuICAgICAgICAgICAgICAgIGlmICggZXNjYXBlICkge1xuICAgICAgICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsZXR0ZXIgPT09ICdcXFxcJyApIHtcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsZXR0ZXIgPT09IHF1b3RlICkge1xuICAgICAgICAgICAgICAgICAgICBxdW90ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxldHRlciA9PT0gJ1wiJyB8fCBsZXR0ZXIgPT09ICdcXCcnICkge1xuICAgICAgICAgICAgICAgIHF1b3RlID0gbGV0dGVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggbGV0dGVyID09PSAnKCcgKSB7XG4gICAgICAgICAgICAgICAgZnVuYyArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggbGV0dGVyID09PSAnKScgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBmdW5jID4gMCApIGZ1bmMgLT0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZ1bmMgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZXBhcmF0b3JzLmluZGV4T2YobGV0dGVyKSAhPT0gLTEgKSBzcGxpdCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggc3BsaXQgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBjdXJyZW50ICE9PSAnJyApIGFycmF5LnB1c2goY3VycmVudC50cmltKCkpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSAnJztcbiAgICAgICAgICAgICAgICBzcGxpdCAgID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgKz0gbGV0dGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBsYXN0IHx8IGN1cnJlbnQgIT09ICcnICkgYXJyYXkucHVzaChjdXJyZW50LnRyaW0oKSk7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2FmZWx5IHNwbGl0cyBzcGFjZS1zZXBhcmF0ZWQgdmFsdWVzIChzdWNoIGFzIHRob3NlIGZvciBgYmFja2dyb3VuZGAsXG4gICAgICogYGJvcmRlci1yYWRpdXNgLCBhbmQgb3RoZXIgc2hvcnRoYW5kIHByb3BlcnRpZXMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIHNwYWNlLXNlcGFyYXRlZCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ1tdfSBzcGxpdCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcG9zdGNzcy5saXN0LnNwYWNlKCcxcHggY2FsYygxMCUgKyAxcHgpJykgLy89PiBbJzFweCcsICdjYWxjKDEwJSArIDFweCknXVxuICAgICAqL1xuICAgIHNwYWNlKHN0cmluZykge1xuICAgICAgICBsZXQgc3BhY2VzID0gWycgJywgJ1xcbicsICdcXHQnXTtcbiAgICAgICAgcmV0dXJuIGxpc3Quc3BsaXQoc3RyaW5nLCBzcGFjZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTYWZlbHkgc3BsaXRzIGNvbW1hLXNlcGFyYXRlZCB2YWx1ZXMgKHN1Y2ggYXMgdGhvc2UgZm9yIGB0cmFuc2l0aW9uLSpgXG4gICAgICogYW5kIGBiYWNrZ3JvdW5kYCBwcm9wZXJ0aWVzKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBjb21tYS1zZXBhcmF0ZWQgdmFsdWVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gc3BsaXQgdmFsdWVzXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MubGlzdC5jb21tYSgnYmxhY2ssIGxpbmVhci1ncmFkaWVudCh3aGl0ZSwgYmxhY2spJylcbiAgICAgKiAvLz0+IFsnYmxhY2snLCAnbGluZWFyLWdyYWRpZW50KHdoaXRlLCBibGFjayknXVxuICAgICAqL1xuICAgIGNvbW1hKHN0cmluZykge1xuICAgICAgICBsZXQgY29tbWEgPSAnLCc7XG4gICAgICAgIHJldHVybiBsaXN0LnNwbGl0KHN0cmluZywgW2NvbW1hXSwgdHJ1ZSk7XG4gICAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _container = __webpack_require__(49);
	
	var _container2 = _interopRequireDefault(_container);
	
	var _warnOnce = __webpack_require__(3);
	
	var _warnOnce2 = _interopRequireDefault(_warnOnce);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a CSS file and contains all its parsed nodes.
	 *
	 * @extends Container
	 *
	 * @example
	 * const root = postcss.parse('a{color:black} b{z-index:2}');
	 * root.type         //=> 'root'
	 * root.nodes.length //=> 2
	 */
	var Root = function (_Container) {
	    _inherits(Root, _Container);
	
	    function Root(defaults) {
	        _classCallCheck(this, Root);
	
	        var _this = _possibleConstructorReturn(this, _Container.call(this, defaults));
	
	        _this.type = 'root';
	        if (!_this.nodes) _this.nodes = [];
	        return _this;
	    }
	
	    Root.prototype.removeChild = function removeChild(child) {
	        child = this.index(child);
	
	        if (child === 0 && this.nodes.length > 1) {
	            this.nodes[1].raws.before = this.nodes[child].raws.before;
	        }
	
	        return _Container.prototype.removeChild.call(this, child);
	    };
	
	    Root.prototype.normalize = function normalize(child, sample, type) {
	        var nodes = _Container.prototype.normalize.call(this, child);
	
	        if (sample) {
	            if (type === 'prepend') {
	                if (this.nodes.length > 1) {
	                    sample.raws.before = this.nodes[1].raws.before;
	                } else {
	                    delete sample.raws.before;
	                }
	            } else if (this.first !== sample) {
	                for (var _iterator = nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                    var _ref;
	
	                    if (_isArray) {
	                        if (_i >= _iterator.length) break;
	                        _ref = _iterator[_i++];
	                    } else {
	                        _i = _iterator.next();
	                        if (_i.done) break;
	                        _ref = _i.value;
	                    }
	
	                    var node = _ref;
	
	                    node.raws.before = sample.raws.before;
	                }
	            }
	        }
	
	        return nodes;
	    };
	
	    /**
	     * Returns a {@link Result} instance representing the root’s CSS.
	     *
	     * @param {processOptions} [opts] - options with only `to` and `map` keys
	     *
	     * @return {Result} result with current root’s CSS
	     *
	     * @example
	     * const root1 = postcss.parse(css1, { from: 'a.css' });
	     * const root2 = postcss.parse(css2, { from: 'b.css' });
	     * root1.append(root2);
	     * const result = root1.toResult({ to: 'all.css', map: true });
	     */
	
	
	    Root.prototype.toResult = function toResult() {
	        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var LazyResult = __webpack_require__(41);
	        var Processor = __webpack_require__(40);
	
	        var lazy = new LazyResult(new Processor(), this, opts);
	        return lazy.stringify();
	    };
	
	    Root.prototype.remove = function remove(child) {
	        (0, _warnOnce2.default)('Root#remove is deprecated. Use Root#removeChild');
	        this.removeChild(child);
	    };
	
	    Root.prototype.prevMap = function prevMap() {
	        (0, _warnOnce2.default)('Root#prevMap is deprecated. Use Root#source.input.map');
	        return this.source.input.map;
	    };
	
	    /**
	     * @memberof Root#
	     * @member {object} raws - Information to generate byte-to-byte equal
	     *                         node string as it was in the origin input.
	     *
	     * Every parser saves its own properties,
	     * but the default CSS parser uses:
	     *
	     * * `after`: the space symbols after the last child to the end of file.
	     * * `semicolon`: is the last child has an (optional) semicolon.
	     *
	     * @example
	     * postcss.parse('a {}\n').raws //=> { after: '\n' }
	     * postcss.parse('a {}').raws   //=> { after: '' }
	     */
	
	    return Root;
	}(_container2.default);
	
	exports.default = Root;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvb3QuZXM2Il0sIm5hbWVzIjpbIlJvb3QiLCJkZWZhdWx0cyIsInR5cGUiLCJub2RlcyIsInJlbW92ZUNoaWxkIiwiY2hpbGQiLCJpbmRleCIsImxlbmd0aCIsInJhd3MiLCJiZWZvcmUiLCJub3JtYWxpemUiLCJzYW1wbGUiLCJmaXJzdCIsIm5vZGUiLCJ0b1Jlc3VsdCIsIm9wdHMiLCJMYXp5UmVzdWx0IiwicmVxdWlyZSIsIlByb2Nlc3NvciIsImxhenkiLCJzdHJpbmdpZnkiLCJyZW1vdmUiLCJwcmV2TWFwIiwic291cmNlIiwiaW5wdXQiLCJtYXAiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztJQVVNQSxJOzs7QUFFRixrQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLHFEQUNsQixzQkFBTUEsUUFBTixDQURrQjs7QUFFbEIsY0FBS0MsSUFBTCxHQUFZLE1BQVo7QUFDQSxZQUFLLENBQUMsTUFBS0MsS0FBWCxFQUFtQixNQUFLQSxLQUFMLEdBQWEsRUFBYjtBQUhEO0FBSXJCOzttQkFFREMsVyx3QkFBWUMsSyxFQUFPO0FBQ2ZBLGdCQUFRLEtBQUtDLEtBQUwsQ0FBV0QsS0FBWCxDQUFSOztBQUVBLFlBQUtBLFVBQVUsQ0FBVixJQUFlLEtBQUtGLEtBQUwsQ0FBV0ksTUFBWCxHQUFvQixDQUF4QyxFQUE0QztBQUN4QyxpQkFBS0osS0FBTCxDQUFXLENBQVgsRUFBY0ssSUFBZCxDQUFtQkMsTUFBbkIsR0FBNEIsS0FBS04sS0FBTCxDQUFXRSxLQUFYLEVBQWtCRyxJQUFsQixDQUF1QkMsTUFBbkQ7QUFDSDs7QUFFRCxlQUFPLHFCQUFNTCxXQUFOLFlBQWtCQyxLQUFsQixDQUFQO0FBQ0gsSzs7bUJBRURLLFMsc0JBQVVMLEssRUFBT00sTSxFQUFRVCxJLEVBQU07QUFDM0IsWUFBSUMsUUFBUSxxQkFBTU8sU0FBTixZQUFnQkwsS0FBaEIsQ0FBWjs7QUFFQSxZQUFLTSxNQUFMLEVBQWM7QUFDVixnQkFBS1QsU0FBUyxTQUFkLEVBQTBCO0FBQ3RCLG9CQUFLLEtBQUtDLEtBQUwsQ0FBV0ksTUFBWCxHQUFvQixDQUF6QixFQUE2QjtBQUN6QkksMkJBQU9ILElBQVAsQ0FBWUMsTUFBWixHQUFxQixLQUFLTixLQUFMLENBQVcsQ0FBWCxFQUFjSyxJQUFkLENBQW1CQyxNQUF4QztBQUNILGlCQUZELE1BRU87QUFDSCwyQkFBT0UsT0FBT0gsSUFBUCxDQUFZQyxNQUFuQjtBQUNIO0FBQ0osYUFORCxNQU1PLElBQUssS0FBS0csS0FBTCxLQUFlRCxNQUFwQixFQUE2QjtBQUNoQyxxQ0FBa0JSLEtBQWxCLGtIQUEwQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsd0JBQWhCVSxJQUFnQjs7QUFDdEJBLHlCQUFLTCxJQUFMLENBQVVDLE1BQVYsR0FBbUJFLE9BQU9ILElBQVAsQ0FBWUMsTUFBL0I7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsZUFBT04sS0FBUDtBQUNILEs7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzttQkFhQVcsUSx1QkFBcUI7QUFBQSxZQUFaQyxJQUFZLHVFQUFMLEVBQUs7O0FBQ2pCLFlBQUlDLGFBQWFDLFFBQVEsZUFBUixDQUFqQjtBQUNBLFlBQUlDLFlBQWFELFFBQVEsYUFBUixDQUFqQjs7QUFFQSxZQUFJRSxPQUFPLElBQUlILFVBQUosQ0FBZSxJQUFJRSxTQUFKLEVBQWYsRUFBZ0MsSUFBaEMsRUFBc0NILElBQXRDLENBQVg7QUFDQSxlQUFPSSxLQUFLQyxTQUFMLEVBQVA7QUFDSCxLOzttQkFFREMsTSxtQkFBT2hCLEssRUFBTztBQUNWLGdDQUFTLGlEQUFUO0FBQ0EsYUFBS0QsV0FBTCxDQUFpQkMsS0FBakI7QUFDSCxLOzttQkFFRGlCLE8sc0JBQVU7QUFDTixnQ0FBUyx1REFBVDtBQUNBLGVBQU8sS0FBS0MsTUFBTCxDQUFZQyxLQUFaLENBQWtCQyxHQUF6QjtBQUNILEs7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBa0JXekIsSSIsImZpbGUiOiJyb290LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQgd2Fybk9uY2UgIGZyb20gJy4vd2Fybi1vbmNlJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ1NTIGZpbGUgYW5kIGNvbnRhaW5zIGFsbCBpdHMgcGFyc2VkIG5vZGVzLlxuICpcbiAqIEBleHRlbmRzIENvbnRhaW5lclxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYXtjb2xvcjpibGFja30gYnt6LWluZGV4OjJ9Jyk7XG4gKiByb290LnR5cGUgICAgICAgICAvLz0+ICdyb290J1xuICogcm9vdC5ub2Rlcy5sZW5ndGggLy89PiAyXG4gKi9cbmNsYXNzIFJvb3QgZXh0ZW5kcyBDb250YWluZXIge1xuXG4gICAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICAgICAgc3VwZXIoZGVmYXVsdHMpO1xuICAgICAgICB0aGlzLnR5cGUgPSAncm9vdCc7XG4gICAgICAgIGlmICggIXRoaXMubm9kZXMgKSB0aGlzLm5vZGVzID0gW107XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcbiAgICAgICAgY2hpbGQgPSB0aGlzLmluZGV4KGNoaWxkKTtcblxuICAgICAgICBpZiAoIGNoaWxkID09PSAwICYmIHRoaXMubm9kZXMubGVuZ3RoID4gMSApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZXNbMV0ucmF3cy5iZWZvcmUgPSB0aGlzLm5vZGVzW2NoaWxkXS5yYXdzLmJlZm9yZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKGNoaWxkLCBzYW1wbGUsIHR5cGUpIHtcbiAgICAgICAgbGV0IG5vZGVzID0gc3VwZXIubm9ybWFsaXplKGNoaWxkKTtcblxuICAgICAgICBpZiAoIHNhbXBsZSApIHtcbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3ByZXBlbmQnICkge1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy5ub2Rlcy5sZW5ndGggPiAxICkge1xuICAgICAgICAgICAgICAgICAgICBzYW1wbGUucmF3cy5iZWZvcmUgPSB0aGlzLm5vZGVzWzFdLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzYW1wbGUucmF3cy5iZWZvcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy5maXJzdCAhPT0gc2FtcGxlICkge1xuICAgICAgICAgICAgICAgIGZvciAoIGxldCBub2RlIG9mIG5vZGVzICkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJhd3MuYmVmb3JlID0gc2FtcGxlLnJhd3MuYmVmb3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEge0BsaW5rIFJlc3VsdH0gaW5zdGFuY2UgcmVwcmVzZW50aW5nIHRoZSByb2904oCZcyBDU1MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3Byb2Nlc3NPcHRpb25zfSBbb3B0c10gLSBvcHRpb25zIHdpdGggb25seSBgdG9gIGFuZCBgbWFwYCBrZXlzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtSZXN1bHR9IHJlc3VsdCB3aXRoIGN1cnJlbnQgcm9vdOKAmXMgQ1NTXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJvb3QxID0gcG9zdGNzcy5wYXJzZShjc3MxLCB7IGZyb206ICdhLmNzcycgfSk7XG4gICAgICogY29uc3Qgcm9vdDIgPSBwb3N0Y3NzLnBhcnNlKGNzczIsIHsgZnJvbTogJ2IuY3NzJyB9KTtcbiAgICAgKiByb290MS5hcHBlbmQocm9vdDIpO1xuICAgICAqIGNvbnN0IHJlc3VsdCA9IHJvb3QxLnRvUmVzdWx0KHsgdG86ICdhbGwuY3NzJywgbWFwOiB0cnVlIH0pO1xuICAgICAqL1xuICAgIHRvUmVzdWx0KG9wdHMgPSB7IH0pIHtcbiAgICAgICAgbGV0IExhenlSZXN1bHQgPSByZXF1aXJlKCcuL2xhenktcmVzdWx0Jyk7XG4gICAgICAgIGxldCBQcm9jZXNzb3IgID0gcmVxdWlyZSgnLi9wcm9jZXNzb3InKTtcblxuICAgICAgICBsZXQgbGF6eSA9IG5ldyBMYXp5UmVzdWx0KG5ldyBQcm9jZXNzb3IoKSwgdGhpcywgb3B0cyk7XG4gICAgICAgIHJldHVybiBsYXp5LnN0cmluZ2lmeSgpO1xuICAgIH1cblxuICAgIHJlbW92ZShjaGlsZCkge1xuICAgICAgICB3YXJuT25jZSgnUm9vdCNyZW1vdmUgaXMgZGVwcmVjYXRlZC4gVXNlIFJvb3QjcmVtb3ZlQ2hpbGQnKTtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgfVxuXG4gICAgcHJldk1hcCgpIHtcbiAgICAgICAgd2Fybk9uY2UoJ1Jvb3QjcHJldk1hcCBpcyBkZXByZWNhdGVkLiBVc2UgUm9vdCNzb3VyY2UuaW5wdXQubWFwJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5pbnB1dC5tYXA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFJvb3QjXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSByYXdzIC0gSW5mb3JtYXRpb24gdG8gZ2VuZXJhdGUgYnl0ZS10by1ieXRlIGVxdWFsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSBzdHJpbmcgYXMgaXQgd2FzIGluIHRoZSBvcmlnaW4gaW5wdXQuXG4gICAgICpcbiAgICAgKiBFdmVyeSBwYXJzZXIgc2F2ZXMgaXRzIG93biBwcm9wZXJ0aWVzLFxuICAgICAqIGJ1dCB0aGUgZGVmYXVsdCBDU1MgcGFyc2VyIHVzZXM6XG4gICAgICpcbiAgICAgKiAqIGBhZnRlcmA6IHRoZSBzcGFjZSBzeW1ib2xzIGFmdGVyIHRoZSBsYXN0IGNoaWxkIHRvIHRoZSBlbmQgb2YgZmlsZS5cbiAgICAgKiAqIGBzZW1pY29sb25gOiBpcyB0aGUgbGFzdCBjaGlsZCBoYXMgYW4gKG9wdGlvbmFsKSBzZW1pY29sb24uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHBvc3Rjc3MucGFyc2UoJ2Ege31cXG4nKS5yYXdzIC8vPT4geyBhZnRlcjogJ1xcbicgfVxuICAgICAqIHBvc3Rjc3MucGFyc2UoJ2Ege30nKS5yYXdzICAgLy89PiB7IGFmdGVyOiAnJyB9XG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUm9vdDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==


/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	/**
	 * Contains helpers for working with vendor prefixes.
	 *
	 * @example
	 * const vendor = postcss.vendor;
	 *
	 * @namespace vendor
	 */
	var vendor = {
	
	    /**
	     * Returns the vendor prefix extracted from an input string.
	     *
	     * @param {string} prop - string with or without vendor prefix
	     *
	     * @return {string} vendor prefix or empty string
	     *
	     * @example
	     * postcss.vendor.prefix('-moz-tab-size') //=> '-moz-'
	     * postcss.vendor.prefix('tab-size')      //=> ''
	     */
	    prefix: function prefix(prop) {
	        if (prop[0] === '-') {
	            var sep = prop.indexOf('-', 1);
	            return prop.substr(0, sep + 1);
	        } else {
	            return '';
	        }
	    },
	
	
	    /**
	     * Returns the input string stripped of its vendor prefix.
	     *
	     * @param {string} prop - string with or without vendor prefix
	     *
	     * @return {string} string name without vendor prefixes
	     *
	     * @example
	     * postcss.vendor.unprefixed('-moz-tab-size') //=> 'tab-size'
	     */
	    unprefixed: function unprefixed(prop) {
	        if (prop[0] === '-') {
	            var sep = prop.indexOf('-', 1);
	            return prop.substr(sep + 1);
	        } else {
	            return prop;
	        }
	    }
	};
	
	exports.default = vendor;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvci5lczYiXSwibmFtZXMiOlsidmVuZG9yIiwicHJlZml4IiwicHJvcCIsInNlcCIsImluZGV4T2YiLCJzdWJzdHIiLCJ1bnByZWZpeGVkIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7QUFRQSxJQUFJQSxTQUFTOztBQUVUOzs7Ozs7Ozs7OztBQVdBQyxVQWJTLGtCQWFGQyxJQWJFLEVBYUk7QUFDVCxZQUFLQSxLQUFLLENBQUwsTUFBWSxHQUFqQixFQUF1QjtBQUNuQixnQkFBSUMsTUFBTUQsS0FBS0UsT0FBTCxDQUFhLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBVjtBQUNBLG1CQUFPRixLQUFLRyxNQUFMLENBQVksQ0FBWixFQUFlRixNQUFNLENBQXJCLENBQVA7QUFDSCxTQUhELE1BR087QUFDSCxtQkFBTyxFQUFQO0FBQ0g7QUFDSixLQXBCUTs7O0FBc0JUOzs7Ozs7Ozs7O0FBVUFHLGNBaENTLHNCQWdDRUosSUFoQ0YsRUFnQ1E7QUFDYixZQUFLQSxLQUFLLENBQUwsTUFBWSxHQUFqQixFQUF1QjtBQUNuQixnQkFBSUMsTUFBTUQsS0FBS0UsT0FBTCxDQUFhLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBVjtBQUNBLG1CQUFPRixLQUFLRyxNQUFMLENBQVlGLE1BQU0sQ0FBbEIsQ0FBUDtBQUNILFNBSEQsTUFHTztBQUNILG1CQUFPRCxJQUFQO0FBQ0g7QUFDSjtBQXZDUSxDQUFiOztrQkEyQ2VGLE0iLCJmaWxlIjoidmVuZG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb250YWlucyBoZWxwZXJzIGZvciB3b3JraW5nIHdpdGggdmVuZG9yIHByZWZpeGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB2ZW5kb3IgPSBwb3N0Y3NzLnZlbmRvcjtcbiAqXG4gKiBAbmFtZXNwYWNlIHZlbmRvclxuICovXG5sZXQgdmVuZG9yID0ge1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdmVuZG9yIHByZWZpeCBleHRyYWN0ZWQgZnJvbSBhbiBpbnB1dCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIHN0cmluZyB3aXRoIG9yIHdpdGhvdXQgdmVuZG9yIHByZWZpeFxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSB2ZW5kb3IgcHJlZml4IG9yIGVtcHR5IHN0cmluZ1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwb3N0Y3NzLnZlbmRvci5wcmVmaXgoJy1tb3otdGFiLXNpemUnKSAvLz0+ICctbW96LSdcbiAgICAgKiBwb3N0Y3NzLnZlbmRvci5wcmVmaXgoJ3RhYi1zaXplJykgICAgICAvLz0+ICcnXG4gICAgICovXG4gICAgcHJlZml4KHByb3ApIHtcbiAgICAgICAgaWYgKCBwcm9wWzBdID09PSAnLScgKSB7XG4gICAgICAgICAgICBsZXQgc2VwID0gcHJvcC5pbmRleE9mKCctJywgMSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvcC5zdWJzdHIoMCwgc2VwICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5wdXQgc3RyaW5nIHN0cmlwcGVkIG9mIGl0cyB2ZW5kb3IgcHJlZml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgLSBzdHJpbmcgd2l0aCBvciB3aXRob3V0IHZlbmRvciBwcmVmaXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5nIG5hbWUgd2l0aG91dCB2ZW5kb3IgcHJlZml4ZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcG9zdGNzcy52ZW5kb3IudW5wcmVmaXhlZCgnLW1vei10YWItc2l6ZScpIC8vPT4gJ3RhYi1zaXplJ1xuICAgICAqL1xuICAgIHVucHJlZml4ZWQocHJvcCkge1xuICAgICAgICBpZiAoIHByb3BbMF0gPT09ICctJyApIHtcbiAgICAgICAgICAgIGxldCBzZXAgPSBwcm9wLmluZGV4T2YoJy0nLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBwcm9wLnN1YnN0cihzZXAgKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZW5kb3I7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	const
		postcss = __webpack_require__(1),
		main    = __webpack_require__(55);
	
	module.exports = postcss.plugin('postcss-grid-kiss', main);

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	const postcss = __webpack_require__(1);
	
	const {parse}             = __webpack_require__(56);
	const {indentMultiline}   = __webpack_require__(57);
	const {getAlignContent}   = __webpack_require__(58);
	const {getJustifyContent} = __webpack_require__(59);
	const {getAlignSelf}      = __webpack_require__(60);
	const {getJustifySelf}    = __webpack_require__(61);
	const {getGridRows}       = __webpack_require__(62);
	const {getGridCols}       = __webpack_require__(64);
	const {getGridAreas}      = __webpack_require__(65);
	const {getFallback}       = __webpack_require__(66);
	
	
	module.exports = function (options = {}) {
		return function (css, result) {
			css.walkDecls(function (decl) {
				if (decl.prop === 'grid-kiss') {
	
					const input  = parse(decl);
					const grid   = { props: new Map, rule: decl.parent };
					const zones  = [];
					const indent = decl.raws.before.match(/.*$/)[0];
	
					grid.props.set("display", "grid");
					grid.props.set("align-content", getAlignContent(input));
					grid.props.set("justify-content", getJustifyContent(input));
					grid.props.set("grid-template-rows", getGridRows(input));
					grid.props.set("grid-template-columns", getGridCols(input));
					grid.props.set("grid-template-areas", indentMultiline(getGridAreas(input), indent));
	
					// grid properties
					for (let [prop,value] of grid.props) {
						if (value != null){
							decl.cloneBefore({ prop, value });
						}
					}
	
					// zone declarations
					for(let zone of input.zones.filter(zone => zone.selector != null)){
						let props = new Map;
	
						props.set("grid-area", zone.name);
						props.set("justify-self", getJustifySelf(zone));
						props.set("align-self", getAlignSelf(zone));
	
						let rule = postcss.rule({
							selector: `${grid.rule.selector} > ${zone.selector}`,
							source: decl.source
						});
	
						for (let [prop,value] of props) {
							if (value != null){
								rule.append({prop, value});
							}
						}
	
						let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;
						grid.rule.parent.insertAfter(lastRule, rule);
						zones.push({ props, rule, zone })
					}
	
					if(options.fallback){
						const atRule = postcss.atRule({
							name: "supports",
							params: 'not (grid-template-areas:"test")'
						});
	
						const fallback = getFallback({
							zones, grid, input, decl, result
						});
	
						atRule.append(fallback.grid.rule);
						for(let [zone, zoneFallback] of fallback.zones){
							atRule.append(zoneFallback.rule);
						}
	
						let lastRule = zones.length > 0 ? zones[zones.length-1].rule : grid.rule;
						grid.rule.parent.insertAfter(lastRule, atRule);
					}
	
					decl.remove();
				}
			})
		}
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	const {range} = __webpack_require__(57);
	
	const CORNERS_CHARS = /[+┌┐└┘╔╗╚╝]/
	
	function parse(decl){
		const
			rows = getRows(decl.value),
			cols = getCols({ rows }),
			{ colIndexes, rowIndexes } = getCorners({ rows }),
			zones = getZones({ rows, cols, colIndexes, rowIndexes });
	
		return {
			decl, rows, cols, zones, rowIndexes, colIndexes
		};
	}
	
	function getRows(str){
		return str.match(/".*"/g).map(row => row.slice(1, row.length - 1));
	}
	
	function getCols({ rows }){
		let colsLength = rows.reduce((min, row) => row.length < min ? row.length : min, Math.pow(2,31)-1);
		return range(0, colsLength).map(x => rows.map(row => row[x]).join(''));
	}
	
	function getCorners({ rows }){
		let colIndexes = new Set,
		    rowIndexes = new Set;
		rows.forEach((row, rowIndex) => {
			row.split('').forEach((char, colIndex) => {
				if(CORNERS_CHARS.test(char)){
					colIndexes.add(colIndex);
					rowIndexes.add(rowIndex);
				}
			});
		});
	
		colIndexes = Array.from(colIndexes).sort((a,b)=>a-b)
		rowIndexes = Array.from(rowIndexes).sort((a,b)=>a-b)
	
		return { colIndexes, rowIndexes };
	}
	
	function getZones({ rows, cols, colIndexes, rowIndexes }){
		const zones = [];
	
		for(let y=0; y<rowIndexes.length; y+=2){
			for(let x=0; x<colIndexes.length; x+=2){
				let top = rowIndexes[y],
				    left = colIndexes[x];
	
				if(!isInZone({ zones, x:left, y:top }) && (x+1) in colIndexes && (y+1) in rowIndexes){
	
					let bottom, right;
	
					if(CORNERS_CHARS.test(rows[top][left])) {
						// a zone starts here, see how far if goes
						bottom = cols[left].slice(top+1).search(CORNERS_CHARS)+top+1,
						right = rows[top].slice(left+1).search(CORNERS_CHARS)+left+1;
					} else {
						// no zone found, presumed as hole
						bottom = rowIndexes[y+1];
						right = colIndexes[x+1];
					}
	
					let zone = {
						top, bottom, left, right,
						topIndex: y,
						leftIndex: x,
						bottomIndex: rowIndexes.findIndex(rowIndex => rowIndex === bottom),
						rightIndex: colIndexes.findIndex(colIndex => colIndex === right)
					};
					zone.content = rows
						.slice(top+1, bottom)
						.map(row => row.substring(left+1, right))
						.join(" ");
					zone.selector = zone.content.replace(/[^\w]v[^\w]|[^\w#.\[\]]/g, "") || null;
					zone.name = getZoneName({ zone, zones });
	
					zones.push(zone);
				}
			}
		}
	
		return zones;
	}
	
	function getZoneName({ zone, zones }){
		if(!zone.selector) return null;
	
		const zoneNames = new Set(zones.map(z => z.name)),
		      zoneSelectors = new Set(zones.map(z => z.selector)),
			  zoneNamesBySelector = new Map([...zoneSelectors].map(
			  	selector => [selector, zones.find(z => z.selector === selector).name]
			  ));
	
		if(zoneNamesBySelector.has(zone.selector)) {
			return zoneNamesBySelector.get(zone.selector)
		}
	
		let baseName = zone.selector
			.replace(/(\w)([#.\[])/g, "$1_") // .foo#bar.baz[qux] => .foo_bar_baz_qux]
			.replace(/[^\w]/g, ""); // .foo_bar_baz_qux] => foo_baz_baz_qux
	
		let aliasNum = 1,
		    name = baseName;
	
		while(zoneNames.has(name) ){
			name = baseName + aliasNum;
			aliasNum++;
		}
	
		zoneNames.add(name);
		zoneNamesBySelector.set(zone.selector, name);
		return name;
	}
	
	function isInZone({ zones, x, y }){
		return zones.some(zone => x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom);
	}
	
	module.exports = { parse, getRows, getCols, getCorners, getZones, getZoneName, isInZone };

/***/ },
/* 57 */
/***/ function(module, exports) {

	exports.range = function(start, end){
		return [...new Array(end - start).keys()].map(i => i + start)
	}
	
	exports.indentMultiline = function(lines, indent){
		return "\n" + lines.map(line => indent + line).join("\n");
	}

/***/ },
/* 58 */
/***/ function(module, exports) {

	exports.getAlignContent = function({ rows }){
	
		const
			isSpaceRow = row => /^\s*$/.test(row),
	
			hasSpaceRows = rows.some(isSpaceRow),
	
			hasSpaceRowsBeforeContent = isSpaceRow(rows[0]),
	
			hasSpaceRowsAfterContent = isSpaceRow(rows[rows.length-1]),
	
			firstContentRowIndex = rows.findIndex(row => !isSpaceRow(row)),
	
			lastContentRowIndex = rows.length - 1 - rows.slice().reverse().findIndex(row => !isSpaceRow(row)),
	
			hasContent = firstContentRowIndex >= 0 && lastContentRowIndex < rows.length,
	
			hasSpaceRowsBetweenContent = hasContent
				&& rows.slice(firstContentRowIndex, lastContentRowIndex).some(isSpaceRow),
	
			hasDoubleSpaceRowsBetweenContent = hasContent
				&& rows
					.slice(firstContentRowIndex, lastContentRowIndex-1)
					.some((row, index, rows) => isSpaceRow(row) && isSpaceRow(rows[index+1]));
	
		if(!hasSpaceRows)
			return "stretch"
		if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasDoubleSpaceRowsBetweenContent)
			return "space-around"
		if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent && hasSpaceRowsBetweenContent)
			return "space-evenly"
		if(hasSpaceRowsBeforeContent && hasSpaceRowsAfterContent)
			return "center"
		if(hasSpaceRowsBeforeContent)
			return "start"
		if(hasSpaceRowsAfterContent)
			return "end"
		if(hasSpaceRowsBetweenContent)
			return "space-between"
	
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	const {range} = __webpack_require__(57);
	
	exports.getJustifyContent = function({ cols }) {
	
		const
			isSpaceCol = col => /^\s*$/.test(col),
	
			hasSpaceCols = cols.some(isSpaceCol),
	
			hasSpaceColsBeforeContent = isSpaceCol(cols[0]) && isSpaceCol(cols[1]),
	
			hasSpaceRowsAfterContent = isSpaceCol(cols[cols.length-1]) && isSpaceCol(cols[cols.length-2]),
	
			firstContentColIndex = cols.findIndex(col => !isSpaceCol(col)),
	
			lastContentColIndex = cols.length - 1 - cols.slice().reverse().findIndex(col => !isSpaceCol(col)),
	
			hasContent = firstContentColIndex >= 0 && lastContentColIndex < cols.length,
	
		    hasSpaceColsBetweenContent = hasContent
			    && cols
				    .slice(firstContentColIndex, lastContentColIndex-1)
				    .some((col, index, cols) => isSpaceCol(col) && isSpaceCol(cols[index+1])),
	
			hasDoubleSpaceColsBetweenContent = hasContent
				&& cols
					.slice(firstContentColIndex, lastContentColIndex-3)
					.some((col, index, cols) => isSpaceCol(col) && range(1,4).every(i => isSpaceCol(cols[index+i])))
	
	
		if(!hasSpaceCols)
			return "stretch"
		if(hasDoubleSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
			return "space-around"
		if(hasSpaceColsBetweenContent && hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
			return "space-evenly"
		if(hasSpaceColsBetweenContent && !hasSpaceColsBeforeContent && !hasSpaceRowsAfterContent)
			return "space-between"
		if(hasSpaceColsBeforeContent && hasSpaceRowsAfterContent)
			return "center"
		if(hasSpaceColsBeforeContent)
			return "start"
		if(hasSpaceRowsAfterContent)
			return "end"
	
	}

/***/ },
/* 60 */
/***/ function(module, exports) {

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

/***/ },
/* 61 */
/***/ function(module, exports) {

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

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	const {parseDimension} = __webpack_require__(63);
	
	exports.getGridRows = function(input){
	
		const
			{ rows, colIndexes, rowIndexes } = input,
			lastContentColIndex = colIndexes.slice(-1)[0],
		    gridRows = [];
	
		for(let y=0; y<rowIndexes.length; y++){
			let rowDimensionInfo = rows
				.slice(rowIndexes[y]+1, rowIndexes[y+1])
				.map(row => row.substring(lastContentColIndex+1))
				.join(" ");
	
			let dimension = parseDimension(rowDimensionInfo, "vertical");
			if(dimension === null) dimension = "1fr";
			gridRows.push(dimension);
			y++;
		}
	
		input.rowsDim = gridRows;
		return gridRows.join(" ");
	}

/***/ },
/* 63 */
/***/ function(module, exports) {

	const
		REGEX_LENGTH = /^(\d+(?:\.\d+)?)([a-z]{1,4})$/,
	    REGEX_PERCENT = /^(\d+(?:\.\d+)?)%\s*(free|grid|view)?$/,
	    REGEX_DIMENSION = /(\d+(?:\.\d+)?)%?\s*([a-z]{1,4})/
	
	exports.parseDimension = function parseDimension(str, direction){
	
		str = str.trim();
	
		// when no value is specified, row and column sizes are set as `auto`
		if(str.length === 0)
			return null;
	
		if(str === "auto")
			return "1fr";
	
		// non-negative number representing a fraction of the free space in the grid container
		if(!isNaN(str))
			return `${parseFloat(str)}fr`
	
	
		if(REGEX_LENGTH.test(str))
			return str;
	
		if(REGEX_PERCENT.test(str)){
			let [, percentage, referential] = str.match(REGEX_PERCENT);
			switch(referential){
				case "free":
					return `${percentage}fr`
				case "view":
					return `${percentage}${direction === "vertical" ? "vh" : "vw"}`
				case "grid":
				default:
					return `${percentage}%`;
			}
		}
	
		// `> *length*` or `< *length*`: a minimum or maximum value
		if(str.startsWith("<"))
			return `minmax(auto, ${parseDimension(str.substring(1))})`
	
		if(str.startsWith(">"))
			return `minmax(${parseDimension(str.substring(1))}, auto)`
	
		// a range between a minimum and a maximum or `minmax(min, max)`
		let [min, max] = str.split("-")
		if([min, max].every(dim => REGEX_DIMENSION.test(dim))){
			return `minmax(${parseDimension(min)}, ${parseDimension(max)})`
		}
	
		// a keyword representing the largest maximal content contribution of the grid items occupying the grid track
		if(str === "max" || str === "max-content")
			return "max-content"
	
		// a keyword representing the largest minimal content contribution of the grid items occupying the grid track
		if(str === "min" || str === "min-content")
			return "min-content"
	
		// a keyword representing the formula min(max-content, max(auto, *length*)),
		// which is calculated similar to auto (i.e. minmax(auto, max-content)),
		// except that the track size is clamped at argument *length* if it is greater than the auto minimum.
	
		if(str.startsWith("fit"))
			return str.replace(/fit (.*)$/, "fit-content($1)");
	
		return null;
	}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	const {range} = __webpack_require__(57);
	const {parseDimension} = __webpack_require__(63);
	
	exports.getGridCols = function(input){
	
		const { decl, rows, zones, colIndexes, rowIndexes } = input;
		const gridCols = range(0, Math.floor(colIndexes.length / 2)).fill("1fr"); // autofill by default
	
		// match border content
		for(let zone of zones) {
			for (let side of ["top", "bottom"]) {
				let
					borderContent = cleanupDimInput(rows[zone[side]].substring(zone.left, zone.right)),
					colIndexLeft  = colIndexes.indexOf(zone.left),
					colIndexRight = colIndexes.indexOf(zone.right),
					colDim        = parseDimension(borderContent);
	
				if (colDim != null) {
					if (colIndexRight === colIndexLeft + 1) {
						gridCols[Math.floor(colIndexLeft / 2)] = colDim;
					} else {
						throw decl.error(
							`You cannot specify the width of a zone occupying more than one column.`,
							{ plugin: 'postcss-mixins' }
						);
					}
				}
			}
		}
	
		// check the last row
		let lastRow = rows[rowIndexes.slice(-1)[0]+1];
		if(lastRow){
			for(let x=0; x<gridCols.length; x++){
				let content = cleanupDimInput(lastRow.substring(colIndexes[2*x], colIndexes[2*x+1])),
				    colDim  = parseDimension(content);
	
				if (colDim != null) {
					gridCols[x] = colDim;
				}
			}
		}
	
		input.colsDim = gridCols;
		return gridCols.join(" ");
	}
	
	function cleanupDimInput(input){
		return input
			.replace(/[^a-zA-Z0-9()\-\s%,<>]/g, "") // remove anything that is not part of a dimension value
			.replace(/^-+|-+$/g, "") // remove remaining '-' segments but preserve range dimensions
	}

/***/ },
/* 65 */
/***/ function(module, exports) {

	exports.getGridAreas = function({ decl, zones, rowIndexes, colIndexes }){
	
		const areaNames = [];
	
		for(let y = 0; y < rowIndexes.length/2; y++) {
			areaNames[y]=[];
			for (let x = 0; x < colIndexes.length/2; x++) {
				let currentZone = zones.find(
					zone => (rowIndexes[2*y] >= zone.top && rowIndexes[2*y+1] <= zone.bottom)
					&& (colIndexes[2*x] >= zone.left && colIndexes[2*x+1] <= zone.right)
				);
				if(currentZone){
					areaNames[y][x] = currentZone.name || "...";
				} else {
					throw decl.error(
						`Zone has not been found for indexes x:${2*x} y:${2*y}`,
						{ plugin: 'postcss-grid-kiss' }
					);
				}
			}
		}
	
		let longestNameLengthByCol = [];
		for(let y=0; y < areaNames.length; y++){
			for(let x=0; x < areaNames[y].length; x++){
				if(!(x in longestNameLengthByCol)) longestNameLengthByCol[x] = 0;
				let nameLength = areaNames[y][x].length;
				if(nameLength > longestNameLengthByCol[x]){
					longestNameLengthByCol[x] = nameLength;
				}
			}
		}
	
		return areaNames.map(
			row => `"${row.map(
				(name, x) => (name + " ".repeat(longestNameLengthByCol[x])).slice(0, longestNameLengthByCol[x])
			).join(" ")}"`
		)
	
	}

/***/ },
/* 66 */
/***/ function(module, exports) {

	function getFallback({
		zones, grid, decl, result, input
	}){
	
		const { colIndexes, rowIndexes } = input;
		const colsDim = input.colsDim.map(dim => dimensionFallback(dim, { decl, result }));
		const rowsDim = input.rowsDim.map(dim => dimensionFallback(dim, { decl, result }));
	
		let fallback = {
			grid: gridFallback({ colsDim, rowsDim, rule: grid.rule, props: grid.props }),
			zones: new Map
		};
	
		for(let zone of zones){
			fallback.zones.set(zone, zoneFallback({
				zone, colIndexes, rowIndexes, colsDim, rowsDim
			}))
		}
	
		return fallback;
	}
	
	function gridFallback({ rowsDim, colsDim, rule }){
	
		const grid = {
			rule: rule.clone({ nodes: [] }),
			props: new Map
		};
		grid.props.set("position", "relative");
		grid.props.set("display", "block");
	
		if(rowsDim.some(isDimRelative)){
			grid.props.set("width", "100%");
		} else {
			grid.props.set("width",  `calc(${rowsDim.join(" + ")})`);
		}
	
		if(colsDim.some(isDimRelative)){
			grid.props.set("height", "100%");
		} else {
			grid.props.set("height",  `calc(${colsDim.join(" + ")})`);
		}
	
		for (let [prop,value] of grid.props) {
			if (value != null){
				grid.rule.append({ prop, value });
			}
		}
	
		return grid;
	}
	
	function zoneFallback({
		zone: { rule, props, zone },
		rowIndexes, colIndexes, rowsDim, colsDim
	}) {
	
		const fallbackRule = rule.clone({ nodes: [] });
		const fallbackProps = new Map;
	
		fallbackProps.set("position", "absolute");
	
		setVerticalPos({
			fallbackProps, props, rowIndexes, rowsDim, zone
		})
	
		setHorizontalPos({
			colIndexes, colsDim, fallbackProps, props, zone
		})
	
		for (let [prop,value] of fallbackProps) {
			if (value != null){
				fallbackRule.append({ prop, value });
			}
		}
	
		return { props: fallbackProps, rule: fallbackRule };
	}
	
	function dimensionFallback(dim, { decl, result }){
		if(dim.startsWith("minmax(")){
			decl.warn(result, "minmax() operator is not supported in fallback mode. Replaced by 1fr.");
			dim = "1fr";
		}
		if(dim.startsWith("fit-content")){
			decl.warn(result, "fit-content() operator is not supported in fallback mode. Replaced by 1fr.");
			dim = "1fr";
		}
		return dim;
	}
	
	function calcDim(dims, allDims){
		if(dims.length === 0 || dims.length === allDims.length)
			return null; // use default value
	
		if(dims.length === 1 && !isDimRelative(dims[0]))
			return dims[0];
	
		if(dims.every(dim => !isDimRelative(dim))) // all fixed
			return `calc(${dims.join(" + ")})`;
	
		const
			fr = dims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
		    totalFr = allDims.reduce((total, dim) => isDimRelative(dim) ? total + parseInt(dim) : total, 0),
		    allFixedDims = allDims.filter(dim => !isDimRelative(dim)),
			fixedDims = dims.filter(dim => !isDimRelative(dim)),
		    remaining = allFixedDims.length === 0 ? "100%" : `calc(100% - ${allFixedDims.join(" - ")})`;
	
		if(fixedDims.length === 0) { // all relative
			if (fr === totalFr) {
				return remaining;
			}
			return `calc(${remaining} * ${fr} / ${totalFr})`
		}
	
		let sumFixed = fixedDims.length == 1 ? fixedDims[0] : `calc(${fixedDims.join(" + ")})`;
		if (fr === totalFr) {
			return `calc(${sumFixed} + ${remaining})`;
		}
		return `calc(${sumFixed} + calc(${remaining} * ${fr} / ${totalFr}))`;
	
	}
	
	function isDimRelative(dim){
		return dim.endsWith("fr");
	}
	
	function setVerticalPos({
		fallbackProps, props, rowIndexes, rowsDim, zone
	}){
		const alignSelf = props.get("align-self") || "stretch";
		let dims=[];
	
		if(alignSelf === "end"){ // align by bottom
			for(let y=rowIndexes.length-1; y>zone.bottomIndex; y-=2){
				dims.push(rowsDim[Math.floor(y/2)]);
			}
			fallbackProps.set("bottom", calcDim(dims, rowsDim) || "0");
		} else {
			for(let y=0; y<zone.topIndex; y+=2){
				dims.push(rowsDim[Math.floor(y/2)]);
			}
			fallbackProps.set("top", calcDim(dims, rowsDim) || "0");
		}
	
		dims = [];
		for(let y=zone.topIndex; y<zone.bottomIndex; y+=2){
			dims.push(rowsDim[Math.floor(y/2)]);
		}
		const height = calcDim(dims, rowsDim) || "100%";
	
		if(alignSelf === "stretch"){
			fallbackProps.set("height", height);
		} else {
			fallbackProps.set("max-height", height);
		}
	
		if(alignSelf === "center"){
			fallbackProps.set("transform", "translateY(-50%)");
			let top = fallbackProps.get("top"),
			    halfHeight = `calc(${height} / 2)`;
			fallbackProps.set("top", (!top || top === "0") ? halfHeight : `calc(${top} + ${halfHeight})`);
		}
	}
	
	function setHorizontalPos({
		colIndexes, colsDim, fallbackProps, props, zone
	}){
		const justifySelf = props.get("justify-self") || "stretch";
		let dims = [];
	
		if(justifySelf === "end"){ // align by right
			for(let x=colIndexes.length-1; x>zone.rightIndex; x-=2){
				dims.push(colsDim[Math.floor(x/2)]);
			}
			fallbackProps.set("right", calcDim(dims, colsDim) || "0");
		} else {
			for(let x=0; x<zone.leftIndex; x+=2){
				dims.push(colsDim[Math.floor(x/2)]);
			}
			fallbackProps.set("left", calcDim(dims, colsDim) || "0");
		}
	
		dims = [];
		for(let x=zone.leftIndex; x<zone.rightIndex; x+=2){
			dims.push(colsDim[Math.floor(x/2)]);
		}
		const width = calcDim(dims, colsDim) || "100%";
	
		if(justifySelf === "stretch"){
			fallbackProps.set("width", width);
		} else {
			fallbackProps.set("max-width", width);
		}
	
		if(justifySelf === "center"){
			dims = [];
			for(let x=zone.leftIndex; x<zone.rightIndex; x+=2){
				dims.push(colsDim[Math.floor(x/2)]);
			}
	
			let left = fallbackProps.get("left"),
			    halfWidth = `calc(${width} / 2)`;
			fallbackProps.set("left", (!left || left === "0") ? halfWidth : `calc(${left} + ${halfWidth})`);
	
			if(fallbackProps.get("transform") != null){
				fallbackProps.set("transform", "translate(-50%,-50%)");
			} else {
				fallbackProps.set("transform", "translateX(-50%)");
			}
		}
	}
	
	module.exports = { getFallback, zoneFallback, gridFallback}

/***/ },
/* 67 */
/***/ function(module, exports) {

	function format([str]){
		return str.replace(/\n\t/g, "\n").trim();
	}
	
	module.exports = [
	
		{
			name: "Basic website layout",
			html: format`
	<header>
		Header
	</header>
	
	<aside class="sidebar">
		Sidebar
	</aside>
	
	<main>
		Main content
	</main>
	
	<footer>
		Footer
	</footer>
			`,
			css: format`
	body {
		grid-kiss:
			"+------------------------------+      "
			"|           header ↑           | 120px"
			"+------------------------------+      "
			"                                      "
			"+--150px---+  +----- auto -----+      "
			"| .sidebar |  |      main      | auto "
			"+----------+  +----------------+      "
			"                                      "
			"+------------------------------+      "
			"|              ↓               |      "
			"|         → footer ←           | 60px "
			"+------------------------------+      "
	}
	
	header   { background: cyan; }
	.sidebar { background: lime; }
	main     { background: yellow; }
	footer   { background: pink; }
	`
		},
	
		{
			name: "Zones on multiple rows and cols ; alternative style #1",
			css: format`
	#grid {
	    grid-kiss:         
	    "┌──────┐ ┌────────────────┐         "
	    "│      │ │                │  100px  "
	    "│   ↑  │ │     .bar       │         "
	    "│ .baz │ └────────────────┘    -    "    
	    "│   ↓  │ ┌───────┐ ┌──────┐         "
	    "│      │ |       | │  ↑   │  100px  "
	    "└──────┘ └───────┘ │      │         "    
	    "┌────────────────┐ │ .foo │    -    "
	    "│     .qux       │ │  ↓   │         "
	    "│                │ │      │  100px  "
	    "└────────────────┘ └──────┘         "
	    "  100px |  100px  |  100px          "
	    ;
	    grid-gap: 10px 10px;    
	}
	
	#grid > div {
	    border:2px solid black;
	    background-color: #ccc;
	    padding: 0.5em;
	    box-sizing: border-box;
	}
	
	#container {    
	    width: 400px;
	    height: 400px;
	    padding: 1em;
	    box-sizing: border-box;
	}    
	`,
	
			html: format`
	<div id="container">
		<div id="grid">
			<div class="foo">Foo</div>
			<div class="bar">Bar</div>
			<div class="baz">Baz</div>
			<div class="qux">Qux</div>
		</div>	
	</div>
	`
	
		},
	
		{
			name: "Variable fractions of free space ; alternate style #2",
	
			css: format`
	body {
		grid-kiss:
		"╔═10═╗                  ╔═10═╗    "
		"║ .a>║                  ║<.b ║ 3fr"
		"╚════╝                  ╚════╝    "
		"      ╔═20═╗      ╔═20═╗          "
		"      ║ .c ║      ║ .d ║       5fr"
		"      ╚════╝      ╚════╝          "
		"            ╔═30═╗                "
		"            ║ .e ║             7fr"
		"            ╚════╝                "
	}
	
	div {   
	   background: #eee;
	   border: 1px solid #999;
	   padding: 1em;
	   box-sizing: border-box;
	}`,
	
			html: `
	<div class="a">a</div>
	<div class="b">b</div>
	<div class="c">c</div>
	<div class="d">d</div>
	<div class="e">e</div>
	`
	
		}
	
	
	]

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map