# grid-kiss: Keep CSS Grids simple, stupid

This is a [PostCSS][postcss-website] plugin aiming to replace the 24 new properties brought by [CSS Grids][w3c-spec] with a single one that you immediately understand when you see it.

<p align="center">
  <a href="https://www.npmjs.com/package/postcss-grid-kiss"><img src="https://img.shields.io/npm/dt/postcss-grid-kiss.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/postcss-grid-kiss"><img src="https://img.shields.io/npm/v/postcss-grid-kiss.svg" alt="Version"></a>
  <a href="https://travis-ci.org/sylvainpolletvillard/postcss-grid-kiss"><img src="https://travis-ci.org/sylvainpolletvillard/postcss-grid-kiss.svg?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/postcss-grid-kiss"><img src="https://img.shields.io/npm/l/postcss-grid-kiss.svg" alt="License"></a>
  <a href="https://gitter.im/sylvainpolletvillard/postcss-grid-kiss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img src="https://badges.gitter.im/sylvainpolletvillard/postcss-grid-kiss.svg" alt="Discuss about this project on gitter"></a>
</p>

Table of contents
-----------------

* [Examples](#examples)
* [Installation](#installation)
* [Usage](#usage)
* [Fallback](#fallback-for-older-browsers)
* [Options](#options)
* [Alternative styles](#alternative-styles)
* [Documentation](#documentation)
  - [How to draw a grid](#how-to-draw-a-grid)
  - [Values accepted for selectors](#values-accepted-for-selectors)  
  - [Dimensions of rows](#dimensions-of-rows)
  - [Dimensions of columns](#dimensions-of-columns)  
  - [Dimensions of gaps](#dimensions-of-gaps)
  - [Values accepted for dimensions](#values-accepted-for-dimensions)
  - [Horizontal alignment of the grid](#horizontal-alignment-of-the-grid)
  - [Vertical alignment of the grid](#vertical-alignment-of-the-grid)
  - [Horizontal alignment inside a zone](#horizontal-alignment-inside-a-zone)
  - [Vertical alignment inside a zone](#vertical-alignment-inside-a-zone)
  

## Examples

### [Try it online][playground]

Try the different examples and play with the plugin on the [playground][playground]. Edit the CSS and HTML on the left and the grid will be updated instantly.

### Basic website layout

```css
body {
	grid-kiss:
		"+-------------------------------+      "
		"|           header ↑            | 120px"
		"+-------------------------------+      "
		"                                       "
		"+-- 30% ---+  +--- auto --------+      "
		"| .sidebar |  |       main      | auto "
		"+----------+  +-----------------+      "
		"                                       "
		"+-------------------------------+      "
		"|              ↓                | 60px "
		"|         → footer ←            |      "
		"+-------------------------------+      "
}
```

is converted to:

```css
body > header {
	grid-area: header;
	align-self: start
}

body > .sidebar {
	grid-area: sidebar
}

body > main {
	grid-area: main
}

body > footer {
	grid-area: footer;
	justify-self: center;
	align-self: end
}

body {
	display: grid;
	align-content: space-between;
	grid-template-rows: 120px 1fr 60px;
	grid-template-columns: 30% 1fr;
	grid-template-areas: 
	"header  header"
	"sidebar main  "
	"footer  footer"
}
```

which displays this kind of grid layout:

![example-result](https://cloud.githubusercontent.com/assets/566536/23096165/41d569d4-f617-11e6-92b3-532b20e750c8.png)

### Responsive layouts

Use different `grid-kiss` declarations in media queries to easily get responsive layouts. It is recommended to start by the grid on small screens, then use media queries to progressively enhance your layouts on wider screens.

![responsive-layout](https://cloud.githubusercontent.com/assets/566536/23096187/4217359e-f617-11e6-8917-4edb017c3cda.png)

## Installation

- with [npm](https://www.npmjs.com/)
```bash
npm install postcss-grid-kiss --save-dev
```

- with [yarn](https://yarnpkg.com/)
```bash
yarn add postcss-grid-kiss --dev
```

## Usage

If you never used PostCSS before, read [PostCSS usage documentation](https://github.com/postcss/postcss#usage) first.

- with command line interface :

```bash
postcss src/your.css --output dist/compiled.css --use postcss-grid-kiss
```

- with Node:
```js
const postcss  = require('postcss'),
      gridkiss = require('postcss-grid-kiss');

postcss([ gridkiss ])
    .process(css, { from: 'src/your.css', to: 'compiled.css' })
    .then(function (result) {
        fs.writeFileSync('compiled.css', result.css);
        if( result.map ) fs.writeFileSync('compiled.css.map', result.map);
    });
```

Read PostCSS documentation to make it work with Webpack, Gulp or your other build system.

## Fallback for older browsers

[CSS Grid Layout][w3c-spec] is a W3C Candidate Recommandation supported in all the evergreen browsers. It is available in Chrome 57, Firefox 52, Safari 10.1, Edge 16 and Opera 44. It is also supported on mobile iOS Safari and Chrome for Android. See [Can I Use][can-i-use] for more information on browser support.

For browsers not supporting CSS Grid Layout, Grid-kiss proposes a *fallback* that use absolute positionning and `calc()` operator. It uses a `@supports` query to only apply on non-supported browsers, and does not involve JavaScript.

**With this fallback, Grid-kiss layouts will work on any browser supporting `calc()`, which is like [95% of browsers](http://caniuse.com/#search=calc).** But you should note that a fallback based on absolute positionning has some limitations:

- It is only a fallback for `grid-kiss` declarations. The reason this fallback works is because of the constraints designed by purpose for grid-kiss layouts. Other Grid Layout properties such as `grid-gap` are not covered by this fallback.
- New dimensions properties defined in the Grid layout specification such as `min-content`, `max-content`, `minmax()`, `fit-content` also are not supported
- Zones with `position: absolute` are out of the flow. This implies that the container will no longer resize based on the zones content. Grid-kiss tries to calculate the total size of the grid when possible. If one of the rows/columns dimensions is `auto` or a fraction of the remaining space (`fr`), the height/width is set to `100%`.
- Grid-kiss adds the property `box-sizing: border-box` to each zone so that they don't overlap because of their padding or border size. If you don't already use this property, it may change a bit the zones dimensions.
- The CSS output is significally bigger, between 2x and 3x in size depending on the targeted browsers

Internet Explorer does not support `@supports` 🙄 , so Grid-kiss needs to add another media query hack that is known to run only on IE: `@media screen and (min-width:0\0)`. This extends support from **IE9 to IE11** at the cost of a bigger output size. If you don't care about Internet Explorer support and want to reduce the output size, you should omit IE in your [browserslist][browserslist].

By default, Grid-kiss is looking in your [browserslist][browserslist] config for the list of supported browsers and automatically deduce what fallbacks are needed for your project by using [Can I Use data][can-i-use]. You can override this automatic detection with the `fallback` option explained below.

## Options

Grid-kiss comes with a few options: 
```javascript
postcss([ gridkiss({ ...options }) ])
```

### `fallback` : add fallback for browsers not supporting CSS Grid Layout 

**Note: it is recommended to use automatic detection through browserslist instead of using this option. See [Fallback](#fallback-for-older-browsers) section.**

If this option is provided, it overrides automatic detection and tells explicitely whether to add or not the fallback styles to the output. 

```javascript
postcss([ gridkiss({ fallback: true }) ]) // always add all fallbacks
postcss([ gridkiss({ fallback: false }) ]) // never add any fallback
```

### `optimize` - reduce output size

This option *(enabled by default)* reduces the size of the output while keeping it readable. It does so by merging grid properties and renaming zone identifiers. For complete minification, use it with [cssnano](http://cssnano.co/).

Set this option to `false` if you prefer a more verbose and descriptive output. Try to toggle the option in the [playground][playground] to compare the outputs.

```javascript
postcss([ gridkiss({ optimize: false }) ])
```

### `selectorParser` - apply custom transforms to zone selectors

This option receives a function that is applied on the selectors you wrote in the zones. This is useful to add your own transforms or selector syntax, for example to use component names in a component-based framework like Vue or React.
```javascript
postcss([ 
  gridkiss({ 
    selectorParser: function (selector) {
      if (/[A-Z]/.test(selector[0])) {
        return `[data-component-name='${selector}']`
      }
      return selector
    }
  }) 
])
 ```

## Alternative styles

These alternative styles for zone syntax are also supported :

 - `┌ ┐ └ ┘` for corners and `│ ─` for segments

 ```css
 div {
 	grid-kiss:		   
 	"┌──────┐  ┌──────┐         "
 	"│      │  │  ↑   │         "
 	"│      │  │ bar →│  200px  "
 	"│  ↓   │  └──────┘         "
 	"│ baz  │              -    "
 	"│  ↑   │  ┌──────┐         "
 	"│      │  │  ↑   │  200px  "
 	"└──────┘  │      │         "
 	"          │ foo  │    -    "
 	"┌──────┐  │      │         "
 	"│ qux  │  │  ↓   │  200px  "
 	"│  ↓   │  │      │         "
 	"└─20em─┘  └──────┘         "
 }
 ```

 - `╔ ╗ ╚ ╝` for corners and `║ ═` for segments

 ```css
 main {
 	grid-kiss:		   
 	"╔═══════╗  ╔════════════════╗      "
 	"║       ║  ║    .article    ║ auto "
 	"║   ↑   ║  ╚════════════════╝      "
 	"║  nav  ║  ╔════╗  ╔════════╗      "
 	"║       ║  ║    ║  ║ aside →║ 240px"
 	"╚═ 25% ═╝  ╚════╝  ╚═ 80em ═╝      "
 }
 ```

## Documentation

### How to draw a grid

- Draw the different zones of your grid as shown in the example. You can use some tools like [AsciiFlow](http://asciiflow.com/).
- Inside every zone, write a selector that matches the corresponding element. See [Values accepted for selectors](#values-accepted-for-selectors)
- The elements matched have to be **direct descendants** of the grid element
- Separate each row by a newline (`\n`) and give the same indentation level to every row
- Make sure each row starts and end by a double quote `"`
- Make sure the zone corners (`+`) are correctly aligned. Every index in the rows where a corner character is found creates a new column.
- Do not hesitate to make large zones with unused space, it may be useful for future modifications
- Use Insert. key and Multi-cursor if supported by your editor to draw and edit your grids easily

### Values accepted for selectors

Inside each zone, you can write a selector to associate a zone to a DOM element. It can be a `tag` name, a `.class`, an `#id`, or `any.other[valid]#selector`.

Since 1.2.0, selectors in zones may use some shortened notations specific to grid-kiss, although using a class is still the recommended method.

- `:1` ⇒ `*:nth-child(1)`
- `button:2` ⇒ `button:nth-of-type(2)`

Since 1.4.0, you can also apply custom transforms and make your own syntax with the `selectorParser` [option](#options)

### Dimensions of rows

Declare the size of a row by writing the dimension **just after the last column of the grid**
```
+------+  +------+ --- 
|  ^   |  | .bar | 40em
|      |  +------+ --- 
| .baz |               
|      |  +------+ --- 
|  v   |  |  ^   | 38em
+------+  |      | --- 
          | .foo |     
+------+  |      | --- 
| .qux |  |  v   | 40em
+------+  +------+ --- 
```

The `-` separators between dimensions are not mandatory, they are only here to make the grid more readable.

### Dimensions of columns

Declare the size of a column by writing the dimension **inside the top or bottom border of a zone**:

```
+-- 640px --+      +----------+
|  selector |  or  | selector |
+-----------+      +---30%----+
```

You cannot set the width of a zone occupying more than one column. This would imply some calculations that may or may not have a solution. As an alternative, you can declare the size of a column **just after the last row of the grid**:

```
+-------------+ +-----+        +-------------+ +-20%-+
|  .bigzone   | |     |        |  .bigzone   | |     |
+-------------+ +-----+        +-------------+ +-----+            
+-----+ +-------------+   or   +-----+ +-------------+
|     | |  .bigzone2  |        |     | |  .bigzone2  |
+-----+ +-------------+        +-20%-+ +-------------+
| 20% | | 60% | | 20% |                | 60% |                 
```

The `|` separators between dimensions are not mandatory, they are only here to make the grid more readable.

### Dimensions of gaps

You can also declare the dimension of spacing between zones the same way you do with rows and columns. These spaces are called *gaps* and act like empty zones. The example below defines gaps of *50px*.

```
+-----+      +-----+      +-----+  ----
| .nw |      | .n  |      | .ne | 100px
+-----+      +-----+      +-----+  ----
                                   50px
+-----+      +-----+      +-----+  ----
| .w  |      |     |      | .e  | 100px
+-----+      +-----+      +-----+  ----
                                   50px
+-----+      +-----+      +-----+  ----
| .sw |      | .s  |      | .se | 100px
+-----+      +-----+      +-----+  ----
|100px| 50px |100px| 50px |100px|      
```

### Values accepted for dimensions

Dimensions can be any of the specified values:

- a non-negative length. 
  - `15px`
  - `4rem`

- a non-negative percentage value, optionally with a context keyword
  - `20%`
  - `25% free` ⇒ `25fr`
  - `30% grid` ⇒ `30%`
  - `5% view` ⇒ `5vw` or `5vh` depending on the direction
  
- a non-negative number representing a fraction of the free space in the grid container.
  - `5` ⇒ `5fr`
  
- `max` or `max-content`: a keyword representing the largest maximal content contribution of the grid items occupying the grid track

- `min` or `min-content`: a keyword representing the largest minimal content contribution of the grid items occupying the grid track

- a range between a minimum and a maximum or `minmax(min, max)`
  - `100px - 200px` ⇒ `minmax(100px, 200px)`

- `> *length*` or `< *length*`: a minimum or maximum value
  - `> 100px` ⇒ `minmax(100px, auto)`
  - `< 50%` ⇒ `minmax(auto, 50%)`
  
- `fit *length*` or `fit-content(*length*)`: a keyword representing the formula min(max-content, max(auto, *length*)), which is calculated similar to auto (i.e. minmax(auto, max-content)), except that the track size is clamped at argument *length* if it is greater than the auto minimum.
  - `fit 100px` ⇒ `fit-content(100px)`
  
- `calc( expr )` : an expression using native [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) CSS function  

- `auto`:  a keyword representing one part of the remaining free space, i.e. `1fr`. When used as a maximum value, it is equal to `max-content`. When used as a minimum value,  it it is equal to `min-content`.

When no value is specified, row and column sizes are set as `auto`

### Horizontal alignment of the grid

Specifies how all the zones are aligned horizontally inside the grid container. Irrelevant if one of the zones fits all the remaining free space.

- `justify-content: stretch`
when there are no two consecutive spaces at the beginning or the end of the rows
```
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
``` 

![grid-justify-content-stretch](https://cloud.githubusercontent.com/assets/566536/23096183/4211e616-f617-11e6-9819-701ef3958093.png)

- `justify-content: start`
when there are two consecutive spaces or more at the end of the rows
```
"+---+ +---+ +---+    "
"| a | | b | | c |    "
"+---+ +---+ +---+    "
"+---+ +---+ +---+    "
"| d | | e | | f |    "
"+---+ +---+ +---+    "
"+---+ +---+ +---+    "
"| g | | h | | i |    "
"+---+ +---+ +---+    "
``` 


![grid-justify-content-start](https://cloud.githubusercontent.com/assets/566536/23096182/4203ebd8-f617-11e6-8972-1ee145bb8359.png)

- `justify-content: end`

when there are two consecutive spaces or more at the beginning of the rows
```
"    +---+ +---+ +---+"
"    | a | | b | | c |"
"    +---+ +---+ +---+"
"    +---+ +---+ +---+"
"    | d | | e | | f |"
"    +---+ +---+ +---+"
"    +---+ +---+ +---+"
"    | g | | h | | i |"
"    +---+ +---+ +---+"
``` 
![grid-justify-content-end](https://cloud.githubusercontent.com/assets/566536/23096179/41fefe70-f617-11e6-9340-c53943440a44.png)

- `justify-content: center`
when there are two consecutive spaces or more at the beginning and the end of the rows
```
"    +---+ +---+ +---+    "
"    | a | | b | | c |    "
"    +---+ +---+ +---+    "
"    +---+ +---+ +---+    "
"    | d | | e | | f |    "
"    +---+ +---+ +---+    "
"    +---+ +---+ +---+    "
"    | g | | h | | i |    "
"    +---+ +---+ +---+    "
```

![grid-justify-content-center](https://cloud.githubusercontent.com/assets/566536/23096177/41fe1078-f617-11e6-94b3-446296152dfc.png)

- `justify-content: space-between`
when there are two consecutive spaces or more between zones
```
"+---+    +---+    +---+"
"| a |    | b |    | c |"
"+---+    +---+    +---+"
"+---+    +---+    +---+"
"| d |    | e |    | f |"
"+---+    +---+    +---+"
"+---+    +---+    +---+"
"| g |    | h |    | i |"
"+---+    +---+    +---+"
```

![grid-justify-content-space-between](https://cloud.githubusercontent.com/assets/566536/23096180/41ffe254-f617-11e6-8caf-2a4cc2ca467b.png)

- `justify-content: space-evenly`
when there are two consecutive spaces or more at the beginning and the end of the rows, and exactly two consecutive spaces between zones
```
"    +---+  +---+  +---+    "
"    | a |  | b |  | c |    "
"    +---+  +---+  +---+    "
"    +---+  +---+  +---+    "
"    | d |  | e |  | f |    "
"    +---+  +---+  +---+    "
"    +---+  +---+  +---+    "
"    | g |  | h |  | i |    "
"    +---+  +---+  +---+    "
```

![grid-justify-content-space-evenly](https://cloud.githubusercontent.com/assets/566536/23096181/4201ba70-f617-11e6-8b9a-5f86ca80b423.png)

- `justify-content: space-around`
when there are two consecutive spaces or more at the beginning and the end of the rows, and four consecutive spaces or more between zones
```
"  +---+    +---+    +---+  "
"  | a |    | b |    | c |  "
"  +---+    +---+    +---+  "
"  +---+    +---+    +---+  "
"  | d |    | e |    | f |  "
"  +---+    +---+    +---+  "
"  +---+    +---+    +---+  "
"  | g |    | h |    | i |  "
"  +---+    +---+    +---+  "
```

![grid-justify-content-space-around](https://cloud.githubusercontent.com/assets/566536/23096178/41febbea-f617-11e6-92aa-e68ef32e7d54.png)

### Vertical alignment of the grid

Specifies how all the zones are aligned vertically inside the grid container. Irrelevant if one of the zones fits all the remaining free space.

- `align content: stretch`
when no space rows
```
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
``` 

![grid-align-content-stretch](https://cloud.githubusercontent.com/assets/566536/23096172/41e9bc04-f617-11e6-9de4-a0906fa68a7e.png)

-  `align-content: start`
when at least one space row at the end
```
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
"                 "
"                 "
``` 

![grid-align-content-start](https://cloud.githubusercontent.com/assets/566536/23096171/41e983f6-f617-11e6-8e8c-89425ca2c76c.png)

- `align-content: end`
when at least one space row at the beginning
```
"                 "
"                 "
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
``` 

![grid-align-content-end](https://cloud.githubusercontent.com/assets/566536/23096167/41d703e8-f617-11e6-928b-ef29645c132a.png)

- `align-content: center`
when at least one space row at the beginning and one space row at the end

```
"                 "
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
"                 "
```

![grid-align-content-center](https://cloud.githubusercontent.com/assets/566536/23096166/41d67752-f617-11e6-96c7-61f8ba81f4a9.png)

- `align-content: space-between`
when there is one space row between zones

```
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"                 "
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"                 "
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
```

![grid-align-content-space-between](https://cloud.githubusercontent.com/assets/566536/23096168/41d7ea74-f617-11e6-861a-963f87debf74.png)

- `align-content: space-evenly`
when there is one space row at the beginning, at the end and between zones

```
"                 "
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"                 "
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"                 "
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
"                 "
```

![grid-align-content-space-evenly](https://cloud.githubusercontent.com/assets/566536/23096169/41d855cc-f617-11e6-883d-712654b4d4b8.png)

- `align-content: space-around`
when there is one space row at the beginning and at the end, and two space rows between zones

```
"                 "
"+---+ +---+ +---+"
"| a | | b | | c |"
"+---+ +---+ +---+"
"                 "
"                 "
"+---+ +---+ +---+"
"| d | | e | | f |"
"+---+ +---+ +---+"
"                 "
"                 "
"+---+ +---+ +---+"
"| g | | h | | i |"
"+---+ +---+ +---+"
"                 "
```

![grid-align-content-space-around](https://cloud.githubusercontent.com/assets/566536/23096170/41dc894e-f617-11e6-836f-ec22738413fd.png)

### Horizontal alignment inside a zone

Each zone can specify an alignment indicator. When no indicators are specified, defaults are stretch horizontally and vertically.


- `justify-self: start` with `<` or `←`
```
+-------------+    +-------------+  
| .item-a  <  | or | .item-a  ←  |
+-------------+    +-------------+
``` 
![grid-justify-self-start](https://cloud.githubusercontent.com/assets/566536/23096186/4213332c-f617-11e6-9fb1-13e46b932364.png)

- `justify-self: end` with `>` or `→`
```
+-------------+    +-------------+
|  >  .item-a | or |  →  .item-a |
+-------------+    +-------------+
``` 
![grid-justify-self-end](https://cloud.githubusercontent.com/assets/566536/23096185/42121c8a-f617-11e6-830d-2be797b6c71a.png)

- `justify-self: stretch` with `<` and `>` or `←` and `→` in this order
```
+--------------+    +--------------+
| < .item-a  > | or | ← .item-a  → |
+--------------+    +--------------+
``` 
![grid-justify-self-stretch](https://cloud.githubusercontent.com/assets/566536/23096188/42182026-f617-11e6-9ee0-8f43f2065562.png)

- `justify-self: center` with `>` and `<` or `→` and `←` in this order
```
+--------------+    +--------------+
| > .item-a  < | or | → .item-a  ← |
+--------------+    +--------------+
``` 
![grid-justify-self-center](https://cloud.githubusercontent.com/assets/566536/23096184/4211f75a-f617-11e6-9f7c-0e2a5dc959e7.png)

### Vertical alignment inside a zone

- `align-self: start` with `^` or `↑`
```
+-------------+    +-------------+
|   .item-a   | or |   .item-a   |
|      ^      |    |      ↑      |
+-------------+    +-------------+
``` 
![grid-align-self-start](https://cloud.githubusercontent.com/assets/566536/23096175/41ecd68c-f617-11e6-91bb-37789cd16c32.png)

- `align-self: end` with ` v ` or `↓`
```
+-------------+    +-------------+
|      v      | or |      ↓      |
|   .item-a   |    |   .item-a   |
+-------------+    +-------------+
``` 
![grid-align-self-end](https://cloud.githubusercontent.com/assets/566536/23096174/41ebf460-f617-11e6-9f6a-70c7ea8e4c1f.png)

- `align-self: stretch` with `^` and ` v ` or `↑` and `↓` in this order
```
+-------------+    +-------------+
|      ^      |    |      ↑      |
|   .item-a   | or |   .item-a   |
|      v      |    |      ↓      |
+-------------+    +-------------+
``` 
![grid-align-self-stretch](https://cloud.githubusercontent.com/assets/566536/23096176/41f05fa0-f617-11e6-8841-f353256e0b3a.png)

- `align-self: center` with ` v ` and `^` or `↓` and `↑` in this order
```
+-------------+    +-------------+
|      v      |    |      ↓      |
|   .item-a   | or |   .item-a   |
|      ^      |    |      ↑      |
+-------------+    +-------------+
```
![grid-align-self-center](https://cloud.githubusercontent.com/assets/566536/23096173/41eaf966-f617-11e6-91c1-251888ee903b.png)

New lines and position of alignement characters do not matter. Just make it visually understandable.


---

Credits for images : [CSS Tricks](https://css-tricks.com/snippets/css/complete-guide-grid/)

[playground]:https://sylvainpolletvillard.github.io/grid-kiss-playground/index.html
[codepen]:http://codepen.io/sylvainpv/pen/oBxKWg
[postcss-website]:http://postcss.org/
[w3c-spec]:https://www.w3.org/TR/css-grid-1/
[can-i-use]:http://caniuse.com/#feat=css-grid
[browserslist]:https://github.com/ai/browserslist
