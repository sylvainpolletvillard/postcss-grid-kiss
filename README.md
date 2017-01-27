#grid-kiss: Keep CSS Grids simple, stupid

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

* [Example](#example)
* [Try it online](#try-it-online)
* [Responsive layouts](#responsive-layouts)
* [Alternative styles](#alternative-styles)
* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)
* [Properties supported](#properties-supported)
* [Documentation](#documentation)
  - [How to draw a grid](#how-to-draw-a-grid)  
  - [Dimensions of rows](#dimensions-of-rows)
  - [Dimensions of columns](#dimensions-of-columns)  
  - [Gaps dimensions](#gaps-dimensions)
  - [Values accepted for dimensions](#values-accepted-for-dimensions)
  - [Horizontal alignment of the grid](#horizontal-alignment-of-the-grid)
  - [Vertical alignment of the grid](#vertical-alignment-of-the-grid)
  - [Horizontal alignment inside a zone](#horizontal-alignment-inside-a-zone)
  - [Vertical alignment inside a zone](#vertical-alignment-inside-a-zone)
  

##Example

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

![example-result](assets/example-result.png)

## [Try it online][playground]

Try the different examples and play with the plugin on the [playground][playground]. Edit the CSS and HTML on the left and the grid will be updated instantly.

You can also try the plugin [on Codepen with this template][codepen] thanks to [@jonathanneal](https://github.com/jonathantneal)

## Responsive layouts

Use different `grid-kiss` declarations in media queries to easily get responsive layouts. It is recommended to start by the grid on small screens, then use media queries to progressively enhance your layouts on wider screens.

![responsive-layouts](assets/responsive-layout.png)

## Alternative styles

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

## Installation

- with [yarn](https://yarnpkg.com/)
```bash
yarn add postcss-grid-kiss --dev
```

- with [npm](https://www.npmjs.com/)
```bash
npm install postcss-grid-kiss --save-dev
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

Read PostCSS documentation for usage with Gulp, Webpack, Grunt or other build systems.

## Options

Grid-kiss comes with a few options you can pass to PostCSS: 
```javascript
postcss([ gridkiss({ ...options }) ])
```

### `fallback` : Fallback for browsers not supporting CSS Grid Layout (default: `false`)

As of December 2016, [CSS Grid Layout][w3c-spec] specification is a Candidate Recommandation and is not widely supported. It is available in Firefox 52 and  Chrome Nightly (and probably in Chrome 57). Maybe March 2017 for Safari (maybe). See [Can I Use][can-i-use] for more information on browser support. Microsoft Edge implements an older and unusable version of this specification. All the major browser editors are currently working on it and we can hope a decent browser support at mid-2017.

In the meantime, Grid-kiss proposes a `fallback` option that tries to simulate CSS Grid Layout with absolute positionning and `calc()` operator. This is a CSS-only fallback that applies only on browsers not supporting CSS Grid Layout, thanks to a `@supports` query.

To add the fallback styles to the output, use the `fallback` option:

```javascript
postcss([ gridkiss({ fallback: true }) ])
```

**With this option, grid layouts are supported on any browser supporting `calc()`, which is like [90% of browsers](http://caniuse.com/#search=calc).** 

Note that a fallback based on absolute positionning is very far from the awesomeness of CSS Grid Layout. **It comes with a few caveats that you have to be aware:**

- Zones with `position: absolute` are out of the flow. This implies that the container will no longer resize based on the zones content. Grid-kiss tries to calculate the total size of the grid when possible. If one of the rows/columns dimensions is `auto` or a fraction of the remaining space (`fr`), the height/width is set to `100%`.
- Zones require the property `box-sizing: border-box` ; otherwise they may overlap because of their padding or border size. Grid-kiss takes care of it, but it may change a bit the dimensions of your zones compared to the grid layout version.
- It is only a fallback for `grid-kiss` declarations. Other Grid Layout properties such as `grid-gap` are not covered by this fallback
- New dimensions properties defined in the Grid layout specification such as `min-content`, `max-content`, `minmax()`, `fit-content` also are not supported
- The CSS output is significally bigger, almost 3x in size

### `screwIE` - ignore fallback for Internet Explorer (default: `false`)

This option is only used when `fallback` option is set to `true`.

Internet Explorer does not support `@supports` 🙄 , so Grid-kiss needs to add another media query hack that is known to run only on IE: `@media screen and (min-width:\0)`. This extends support from **IE9 to IE11**.
 
If you don't care about Internet Explorer support and want to reduce the output size, you can add the `screwIE` option to skip the IE hack: 

```javascript
postcss([ gridkiss({ fallback: true, screwIE: true }) ])
```

### `optimize` - reduce output size (default: `true`)

This option (enabled by default) reduces the size of the output while keeping it readable. It does so by merging grid properties, renaming zone identifiers and reducing `calc()` expressions. For complete minification, use it with [cssnano](http://cssnano.co/).

Set this option to `false` if you prefer a more verbose and descriptive output.

## Properties used in the Grid Layout specification

### on the grid

- `display: grid` ✅
- `grid-template-columns` ✅
- `grid-template-rows` ✅
- `grid-template-areas` ✅
- `grid-column-gap` ❌ [1]
- `grid-row-gap` ❌ [1]
- `grid-gap` ❌ [1]
- `justify-items` ❌ [2] 
- `align-items` ❌ [2]
- `justify-content` ✅
- `align-content` ✅
- `grid-auto-columns` ❌ [3]
- `grid-auto-rows` ❌ [3]
- `grid-auto-flow` ❌ [3]
- `grid` ❌ [4]

[1]: gaps are actually faked as empty zones, so you can define the gap dimension specifically by row/column. See [Gaps Dimensions](#gaps-dimensions)

[2]: `justify-items` and `align-items` are not used on the container level, instead use alignment helpers for each zone

[3]: `grid-auto-columns`, `grid-auto-rows` and `grid-auto-flow` are not used, instead define explicitely all the zones

[4]: `grid-kiss` aims to replace the `grid` property

### on the zones (a.k.a. grid items)

- `grid-column-start` ❌ [5]
- `grid-column-end` ❌ [5]
- `grid-row-start` ❌ [5]
- `grid-row-end` ❌ [5]
- `grid-column` ❌ [5]
- `grid-row` ❌ [5]
- `grid-area` ✅
- `justify-self` ✅
- `align-self` ✅

[5] named areas are used instead of indexes

## Documentation

### How to draw a grid

- Draw the different zones of your grid as shown in the example. You can use some tools like [AsciiFlow](http://asciiflow.com/).
- Inside every zone, write a CSS selector that matches the corresponding element. It can be a `tag` name, a `.class`, an `#id`, or `any.other[valid]#selector`
- The elements matched have to be **direct descendants** of the grid element
- Separate each row by a newline (`\n`) and give the same indentation level to every row
- Make sure each row starts and end by a double quote `"`
- Make sure the zone corners (`+`) are correctly aligned. Every index in the rows where a corner character is found creates a new column.
- Do not hesitate to make large zones with unused space, it may be useful for future modifications
- Use Insert. key and Multi-cursor if supported by your editor to draw and edit your grids easily

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

### Gaps dimensions

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
  - `25% free` => `25fr`
  - `30% grid` => `30%`
  - `5% view` => `5vw` or `5vh`
  
- a non-negative number representing a fraction of the free space in the grid container.
  - `5` => `5fr`
  
- `max` or `max-content`: a keyword representing the largest maximal content contribution of the grid items occupying the grid track

- `min` or `min-content`: a keyword representing the largest minimal content contribution of the grid items occupying the grid track

- a range between a minimum and a maximum or `minmax(min, max)`
  - `100px - 200px` => `minmax(100px, 200px)`

- `> *length*` or `< *length*`: a minimum or maximum value
  - `> 100px` => `minmax(100px, auto)`
  - `< 50%` => `minmax(auto, 50%)`
  
- `fit *length*` or `fit-content(*length*)`: a keyword representing the formula min(max-content, max(auto, *length*)), which is calculated similar to auto (i.e. minmax(auto, max-content)), except that the track size is clamped at argument *length* if it is greater than the auto minimum.
  - `fit 100px` => `fit-content(100px)`
  
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

![justify-content-stretch](assets/grid-justify-content-stretch.png)

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


![justify-content-start](assets/grid-justify-content-start.png)

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
![justify-content-end](assets/grid-justify-content-end.png)

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

![justify-content-center](assets/grid-justify-content-center.png)

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

![justify-content-space-between](assets/grid-justify-content-space-between.png)

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

![justify-content-space-evenly](assets/grid-justify-content-space-evenly.png)

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

![justify-content-space-around](assets/grid-justify-content-space-around.png)

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

![align-content-stretch](assets/grid-align-content-stretch.png)

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

![align-content-start](assets/grid-align-content-start.png)

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

![align-content-end](assets/grid-align-content-end.png)

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

![align-content-center](assets/grid-align-content-center.png)

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

![align-content-space-between](assets/grid-align-content-space-between.png)

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

![align-content-space-evenly](assets/grid-align-content-space-evenly.png)

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

![align-content-space-around](assets/grid-align-content-space-around.png)

### Horizontal alignment inside a zone

Each zone can specify an alignment indicator. When no indicators are specified, defaults are stretch horizontally and vertically.


- `justify-self: start` with `<` or `←`
```
+-------------+    +-------------+  
| .item-a  <  | or | .item-a  ←  |
+-------------+    +-------------+
``` 
![justify-self-start](assets/grid-justify-self-start.png)

- `justify-self: end` with `>` or `→`
```
+-------------+    +-------------+
|  >  .item-a | or |  →  .item-a |
+-------------+    +-------------+
``` 
![justify-self-end](assets/grid-justify-self-end.png)

- `justify-self: stretch` with `<` and `>` or `←` and `→` in this order
```
+--------------+    +--------------+
| < .item-a  > | or | ← .item-a  → |
+--------------+    +--------------+
``` 
![justify-self-stretch](assets/grid-justify-self-stretch.png)

- `justify-self: center` with `>` and `<` or `→` and `←` in this order
```
+--------------+    +--------------+
| > .item-a  < | or | → .item-a  ← |
+--------------+    +--------------+
``` 
![justify-self-center](assets/grid-justify-self-center.png)

### Vertical alignment inside a zone

- `align-self: start` with `^` or `↑`
```
+-------------+    +-------------+
|   .item-a   | or |   .item-a   |
|      ^      |    |      ↑      |
+-------------+    +-------------+
``` 
![align-self-start](assets/grid-align-self-start.png)

- `align-self: end` with ` v ` or `↓`
```
+-------------+    +-------------+
|      v      | or |      ↓      |
|   .item-a   |    |   .item-a   |
+-------------+    +-------------+
``` 
![align-self-end](assets/grid-align-self-end.png)

- `align-self: stretch` with `^` and ` v ` or `↑` and `↓` in this order
```
+-------------+    +-------------+
|      ^      |    |      ↑      |
|   .item-a   | or |   .item-a   |
|      v      |    |      ↓      |
+-------------+    +-------------+
``` 
![align-self-stretch](assets/grid-align-self-stretch.png)

- `align-self: center` with ` v ` and `^` or `↓` and `↑` in this order
```
+-------------+    +-------------+
|      v      |    |      ↓      |
|   .item-a   | or |   .item-a   |
|      ^      |    |      ↑      |
+-------------+    +-------------+
```
![align-self-center](assets/grid-align-self-center.png)

New lines and position of alignement characters do not matter. Just make it visually understandable.


---

Credits for images : [CSS Tricks](https://css-tricks.com/snippets/css/complete-guide-grid/)

[playground]:https://cdn.rawgit.com/sylvainpolletvillard/postcss-grid-kiss/0.6.1/playground/index.html
[codepen]:http://codepen.io/sylvainpv/pen/oBxKWg
[postcss-website]:http://postcss.org/
[w3c-spec]:https://www.w3.org/TR/css-grid-1/
[can-i-use]:http://caniuse.com/#feat=css-grid