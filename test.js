const postcss = require('postcss'),
	  gridkiss = require('./index'),
	  test = require('ava');

const {parseDimension} = require("./src/dimension");

async function process(input){
	return postcss(gridkiss).process(input).then(res => {
		const output = {};
		res.root.walkRules((rule) => {
			output[rule.selector] = {};
			rule.walkDecls((decl) => {
				output[rule.selector][decl.prop] = decl.value;
			})
		});
		//console.log(input, output);
		return output;
	}).catch(err => console.error(err));
}

test("parsing dimensions", t => {
	t.is(parseDimension("1"), "1fr")
	t.is(parseDimension("1px"), "1px")
	t.is(parseDimension("0"), "0fr")
	t.is(parseDimension("10"), "10fr")
	t.is(parseDimension("12.34em"), "12.34em")
	t.is(parseDimension("12.34em - 56.78vmin"), "minmax(12.34em, 56.78vmin)")
	t.is(parseDimension("> 3rem"), "minmax(3rem, auto)")
	t.is(parseDimension("< 10"), "minmax(auto, 10fr)")
	t.is(parseDimension("50%"), "50%")
	t.is(parseDimension("50% grid"), "50%")
	t.is(parseDimension("5.55% free"), "5.55fr")
	t.is(parseDimension("50% view", "horizontal"), "50vw")
	t.is(parseDimension("50% view", "vertical"), "50vh")
})

test('display grid', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "+------+"
		   "| test |"
		   "+------+"
	}`);

	t.is(output["div"]["display"], "grid");
});

test('align-content stretch', async t => {

	let output = await process(
	`div {
		grid-kiss:
		   "+------+"
		   "| test |"
		   "+------+"
	}`);

	t.is(output["div"]["align-content"], "stretch");
})

test('align-content start', async t => {

	let output = await process(
	`div {
		grid-kiss:
		   "        "
		   "+------+"
		   "| test |"
		   "+------+"
	}`);

	t.is(output["div"]["align-content"], "start");
})

test('align-content end', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "+------+"
		   "| test |"
		   "+------+"
		   "        "
	}`);

	t.is(output["div"]["align-content"], "end");
});

test('align-content center', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "        "	   
		   "+------+"
		   "| test |"
		   "+------+"
		   "        "
	}`);

	t.is(output["div"]["align-content"], "center");
});

test('align-content space-between', async t => {
	let output = await process(
	`div {
		grid-kiss:   
		   "+------+"
		   "| foo  |"
		   "+------+"
		   "        "
		   "+------+"
		   "| bar  |"
		   "+------+"
	}`);

	t.is(output["div"]["align-content"], "space-between");
})

test('align-content space-evenly', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "        "	   
		   "+------+"
		   "| foo  |"
		   "+------+"
		   "        "
		   "+------+"
		   "| bar  |"
		   "+------+"
		   "        "
	}`);

	t.is(output["div"]["align-content"], "space-evenly");
})

test('align-content space-around', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "        "
		   "+------+"
		   "| foo  |"
		   "+------+"
		   "        "
		   "        "
		   "+------+"
		   "| bar  |"
		   "+------+"
		   "        "
	}`);

	t.is(output["div"]["align-content"], "space-around");
})

test('justify-content start', async t => {

	let output = await process(
	`div {
		grid-kiss:		   
		   "  +------++------+"
		   "  | foo  || bar  |"
		   "  +------++------+"
	}`);

	t.is(output["div"]["justify-content"], "start");
});

test('justify-content end', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "+-----++-----+  "
		   "| foo || bar |  "
		   "+-----++-----+  "
	}`)

	t.is(output["div"]["justify-content"], "end");
});

test('justify-content center', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "  +------++------+  "
		   "  | foo  || bar  |  "
		   "  +------++------+  "
	}`)

	t.is(output["div"]["justify-content"], "center");
});

test('justify-content space-between', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "+------+  +------+"
		   "| foo  |  | bar  |"
		   "+------+  +------+"
	}`)

	t.is(output["div"]["justify-content"], "space-between");
});

test('justify-content space-evenly', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "  +------+  +------+  "
		   "  | foo  |  | bar  |  "
		   "  +------+  +------+  "
	}`)

	t.is(output["div"]["justify-content"], "space-evenly");
});

test('justify-content space-around', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "  +------+    +------+  "
		   "  | foo  |    | bar  |  "
		   "  +------+    +------+  "
	}`)

	t.is(output["div"]["justify-content"], "space-around");
});

test('grid template rows', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "  +------+  +------+        "
		   "  | foo  |  | bar  |   40px "
		   "  +------+  +------+        "
		   "  +------+  +------+        "
		   "  | bar  |  | foo  |    15% "
		   "  +------+  +------+        "
	}`)

	t.is(output["div"]["grid-template-rows"], "40px 15%");

	output = await process(
	`div {
		grid-kiss:		   
		   "+------+  +------+         "
		   "|      |  | bar  |         "
		   "|      |  +------+         "
		   "| baz  |                   "
		   "|      |  +------+         "
		   "|      |  | foo  | 50% free"
		   "+------+  +------+         "
		   "                           "
		   "+------+  +------+         "
		   "| bar  |  | foo  |   > 20fr"
		   "+------+  +------+         "
	}`)

	t.is(output["div"]["grid-template-rows"], "1fr 50fr minmax(20fr, auto)");

	output = await process(
	`div {
		grid-kiss:		   
		   "+------+  +------+     -   "
		   "|      |  |  ^   |   <10%  "
		   "|      |  | bar >|         "
		   "|  v   |  +------+     -   "
		   "| baz  |                   "
		   "|  ^   |  +------+     -   "
		   "|      |  |  ^   | 50% free"
		   "+------+  |      |     -   "
		   "          | foo  |         "
		   "+------+  |      |     -   "
		   "| < qux|  |  v   |   > 20fr"
		   "|  v   |  |      |         "
		   "+------+  +------+     -   "
	}`);

	t.is(output["div"]["grid-template-rows"], "minmax(auto, 10%) 50fr minmax(20fr, auto)");

});

test('grid template columns', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "  +-50px-+  +------+        "
		   "  | foo  |  | bar  |   40px "
		   "  +------+  +------+        "
		   "  +------+  +-25%--+        "
		   "  | bar  |  | foo  |    15% "
		   "  +------+  +------+        "
	}`)

	t.is(output["div"]["grid-template-columns"], "50px 25%");

	output = await process(
	`div {
		grid-kiss:		   
		   "+----------------+ +-----+"
		   "| foobar         | | baz |"
		   "+----------------+ +100px+"
		   "+-------+ +-20% -+ +-----+"
		   "| bar   | | foo  | | qux |"
		   "+ > 4em + +------+ +-----+"
	}`)

	t.is(output["div"]["grid-template-columns"], "minmax(4em, auto) 20% 100px");

	output = await process(
		`div {
		grid-kiss:		   
		   "+-------------+ +-----+"
		   "|  .bigzone   | |     |"
		   "+-------------+ +-----+"
		   "+-----+ +-------------+"
		   "|     | |  .bigzone2  |"
		   "+-----+ +-------------+"
		   "| 20% | | 60% | | 20% |"
	}`)

	t.is(output["div"]["grid-template-columns"], "20% 60% 20%");

	output = await process(
		`div {
		grid-kiss:		   
		   "+-------------+ +-20%-+"
		   "|  .bigzone   | |     |"
		   "+-------------+ +-----+"
		   "+-----+ +-------------+"
		   "|     | |  .bigzone2  |"
		   "+-20%-+ +-------------+"
		   "        | 60% |        "		   
	}`)

	t.is(output["div"]["grid-template-columns"], "20% 60% 20%");

});

test('grid template areas', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "+------+  +------+         "
		   "|      |  | bar  |         "
		   "|      |  +------+         "
		   "| baz  |                   "
		   "|      |  +------+         "
		   "|      |  | foo  | 50% free"
		   "+------+  +------+         "
		   "                           "
		   "+------+  +------+         "
		   "| bar  |  | foo  |   > 20fr"
		   "+------+  +------+         "
	}`)

	t.is(output["div"]["grid-template-areas"], `\n\t\t"baz bar"\n\t\t"baz foo"\n\t\t"bar foo"`);
	t.is(output["div > bar"]["grid-area"], "bar" );
	t.is(output["div > baz"]["grid-area"], "baz" );
	t.is(output["div > foo"]["grid-area"], "foo" );

	output = await process(
	`div {
		grid-kiss:		   
		   "+----------------+ +-----+"
		   "|foo#bar.baz[qux]| | baz |"
		   "+----------------+ +100px+"
		   "+------+  +-20% -+ +-----+"
		   "| .bar |  | #foo | | qux |"
		   "+ > 4em+  +------+ +-----+"
	}`)

	t.is(output["div"]["grid-template-areas"],
		`\n\t\t"foo_bar_baz_qux foo_bar_baz_qux baz"\n\t\t"bar             foo             qux"`);
	t.is(output["div > .bar"]["grid-area"], "bar" );
	t.is(output["div > baz"]["grid-area"], "baz" );
	t.is(output["div > #foo"]["grid-area"], "foo" );
	t.is(output["div > qux"]["grid-area"], "qux" );
	t.is(output["div > foo#bar.baz[qux]"]["grid-area"], "foo_bar_baz_qux" );

});

test('zone align-self', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		   "+------+  +------+         "
		   "|      |  |  ^   |         "
		   "|      |  | bar >|         "
		   "|  v   |  +------+         "
		   "| baz  |                   "
		   "|  ^   |  +------+         "
		   "|      |  |  ^   | 50% free"
		   "+------+  |      |         "
		   "          | foo  |         "
		   "+------+  |      |         "
		   "| < qux|  |  v   |   > 20fr"
		   "|  v   |  |      |         "
		   "+------+  +------+         "
	}`);

	t.is(output["div > baz"]["align-self"], "center");
	t.is(output["div > bar"]["align-self"], "start");
	t.is(output["div > qux"]["align-self"], "end");
	t.is(output["div > foo"]["align-self"], "stretch");

});

test('other ascii formats: simple segments', async t => {
	let output = await process(
	`div {
		grid-kiss:		   
		     "┌──────┐  ┌──────┐      "
		     "│      │  │ bar →│ 200px"
		     "│  ↓   │  └──────┘      "
		     "│ baz  │             -  "
		     "│  ↑   │  ┌──────┐      "
		     "│      │  │  ↑   │ 200px"
		     "└──────┘  │      │      "
		     "          │ foo  │   -  "
		     "┌──────┐  │      │      "
		     "│ ← qux│  │  ↓   │ 200px"
		     "│  ↓   │  │      │      "
		     "└─20em─┘  └──────┘      "
	}`);

	t.deepEqual(output["div > baz"], {
		"grid-area":"baz",
		"align-self":"center"
	})
	t.deepEqual(output["div > bar"], {
		"grid-area":"bar",
		"justify-self":"end"
	})
	t.deepEqual(output["div > foo"], {
		"grid-area":"foo",
		"align-self":"stretch"
	})
	t.deepEqual(output["div > qux"], {
		"grid-area":"qux",
		"justify-self":"start",
		"align-self":"end"
	})
	t.deepEqual(output["div"], {
		"display": "grid",
		"align-content": "stretch",
		"justify-content": "space-between",
		"grid-template-rows": "200px 200px 200px",
		"grid-template-columns": "20em 1fr",
		"grid-template-areas": '\n\t\t"baz bar"\n\t\t"baz foo"\n\t\t"qux foo"'
	})
});

test('other ascii formats: double segments', async t => {
	let output = await process(
	`main {
		grid-kiss:
		"╔═══════╗  ╔════════════════╗      "
		"║       ║  ║    .article    ║      "
		"║       ║  ╚════════════════╝      "
		"║  nav  ║  ╔════╗  ╔════════╗      "
		"║       ║  ║    ║  ║ aside  ║ 320px"
		"╚═200px═╝  ╚════╝  ╚════════╝      "
	}`);

	t.deepEqual(output["main > nav"], {
		"grid-area":"nav"
	})
	t.deepEqual(output["main > .article"], {
		"grid-area":"article"
	})
	t.deepEqual(output["main > aside"], {
		"grid-area":"aside"
	})
	t.deepEqual(output["main"], {
		"display": "grid",
		"align-content": "stretch",
		"justify-content": "space-between",
		"grid-template-rows": "1fr 320px",
		"grid-template-columns": "200px 1fr 1fr",
		"grid-template-areas": '\n\t\t"nav article article"\n\t\t"nav ...     aside  "'
	})
});