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
		name: "Alternative style #1",
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

	}


]