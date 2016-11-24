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
}

#container {    
    width: 400px;
    height: 400px;
    padding: 1em;
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
}`,

		html: `
<div class="a">a</div>
<div class="b">b</div>
<div class="c">c</div>
<div class="d">d</div>
<div class="e">e</div>
`

	},

	{
		name: "Vertical and horizontal center",

		css: format`
body {
  grid-kiss:
    "+-------+"
    "|   ↓   |"
    "|→ div ←|"
    "|   ↑   |"
    "+-------+"
}

div { 
  border: 1px solid black;
  padding: 1rem;
  overflow: scroll;
  resize: both;
}
`,

		html: `<div> Resize me </div>`
	},

	{
		name: "Responsive layout with media queries",

		css: `
body {
  grid-kiss:
    "+----------+      "
    "|  header  | 80px "
    "+----------+      "
    "                  "
    "+----------+      "
    "|  .bloc1  |      "
    "+----------+      "
    "                  "
    "+----------+      "
    "|  .bloc2  |      "
    "+----------+      "
    "                  "
    "+----------+      "
    "|  .bloc3  |      "
    "+----------+      "
    "                  "
    "+----------+      "
    "|  .bloc4  |      "
    "+----------+      "    
}     

@media (min-width:640px){
  body {
    grid-kiss:
    "+----------------------------+      "
    "|        header              | 120px"
    "+----------------------------+      "
    "                                    "
    "+------------+  +------------+      "
    "|   .bloc1   |  |   .bloc2   |      "
    "+------------+  +------------+      "
    "                                    "
    "+------------+  +------------+      "
    "|   .bloc3   |  |   .bloc4   |      "
    "+------------+  +------------+      "
  }
}

@media (min-width: 960px){
  body {
    grid-kiss:
    "+--------------------------------+       "
    "|             header             | 120px "
    "+--------------------------------+       "
    "                                         "
    "+--------------------------------+       "
    "|             .bloc1             | <6rem "
    "+--------------------------------+       "
    "                                         "
    "+--------+  +--------+  +--------+       "
    "| .bloc2 |  | .bloc3 |  | .bloc4 |       "
    "+--------+  +--------+  +--------+       "
  }
}	
	
header { background: yellow }
.bloc1 { background: blue }
.bloc2 { background: green }
.bloc3 { background: purple }
.bloc4 { background: chocolate }	
	
.bloc {
	text-align:center;
	color: white;
	font-size: 48px;
}	
`,

		html: `
<header>Responsive design layout with media queries</header>	
<div class="bloc bloc1">1</div>
<div class="bloc bloc2">2</div>
<div class="bloc bloc3">3</div>
<div class="bloc bloc4">4</div>
`
	}

]