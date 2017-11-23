const postcss = require('postcss'),
	  gridkiss = require('./dist/index'),
	  test = require('ava');

const {parseDimension} = require("./dist/dimension");

async function process(input, options){
	return postcss(gridkiss(options)).process(input).then(res => {
		const output = {};
		res.root.walkRules((rule) => {
			if(rule.parent === res.root){
				output[rule.selector] = {};
				rule.walkDecls((decl) => {
					output[rule.selector][decl.prop] = decl.value;
				})
			}
		});
		res.root.walkAtRules((atrule) => {
			output[atrule.name] = { params: atrule.params };
			atrule.walkRules((rule) => {
				output[atrule.name][rule.selector] = {};
				rule.walkDecls((decl) => {
					output[atrule.name][rule.selector][decl.prop] = decl.value;
				})
			});
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
	t.is(parseDimension("calc(20% + 10px)"), "calc(20% + 10px)")
	t.is(parseDimension("calc(20% + 10%)"), "calc(20% + 10%)")
	t.is(parseDimension("min"), "min-content")
	t.is(parseDimension("max"), "max-content")
})

test('display grid', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "+------+"
		   "| test |"
		   "+------+"
	}`, { fallback: true });

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
		   "+------+"
		   "| test |"
		   "+------+"
		   "        "
	}`);

	t.is(output["div"]["align-content"], "start");
})

test('align-content end', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "        "
		   "+------+"
		   "| test |"
		   "+------+"
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
		   "+------++------+  "
		   "| foo  || bar  |  "
		   "+------++------+  "
	}`);

	t.is(output["div"]["justify-content"], "start");
});

test('justify-content end', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "  +-----++-----+"
		   "  | foo || bar |"
		   "  +-----++-----+"
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
	}`, { optimize: false })

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
	}`, { optimize: false })

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
	}`, { optimize: false });

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
	}`, { optimize: false })

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
	}`, { optimize: false })

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
	}`, { optimize: false })

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
	}`, { optimize: false })

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
	}`, { optimize: false })

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
	}`, { optimize: false })

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

test('gaps', async t => {
	let output = await process(
	`div {
		grid-kiss:
		   "+--------------------+        +-----+"
		   "|  .bigzone          |        |.foo |"
		   "+--------------------+        +-----+"
		   "+-----+        +--------------------+"
		   "|.bar |        |  .bigzone2         |"
		   "+-----+        +--------------------+"
		   "| 20% | 10px   | min |  auto  | 10% |"
	}`, { optimize: false });

	t.is(output["div"]["grid-template-columns"], "20% 10px min-content 1fr 10%");

	output = await process(
	`div {
		grid-kiss:
		   "+------+  +------+        "
		   "|      |  |  ^   |        "
		   "|      |  | bar >|   1    "
		   "|  v   |  +------+        "
		   "| baz  |             2    "
		   "|  ^   |  +------+        "
		   "|      |  |  ^   |   3    "
		   "+------+  |      |        "
		   "          | foo  |   4    "
		   "+------+  |      |        "
		   "| < qux|  |  v   |   5    "
		   "|  v   |  |      |        "
		   "+------+  +------+        "
	}`, { optimize: false });
	t.is(output["div"]["grid-template-rows"], "1fr 2fr 3fr 4fr 5fr");

	output = await process(
	`body {
		grid-kiss:
		   "+-----+      +-----+      +-----+  ----"
		   "| .nw |      | .n  |      | .ne | 100px"
		   "+-----+      +-----+      +-----+  ----"
		   "                                   50px"
		   "+-----+      +-----+      +-----+  ----"
		   "| .w  |      |     |      | .e  | 100px"
		   "+-----+      +-----+      +-----+  ----"
		    "                                  50px"
		   "+-----+      +-----+      +-----+  ----"
		   "| .sw |      | .s  |      | .se | 100px"
		   "+-----+      +-----+      +-----+  ----"
		   "|100px| 50px |100px| 50px |100px|      "
	}`, { optimize: false });

	t.is(output["body"]["grid-template-columns"], "100px 50px 100px 50px 100px");
	t.is(output["body"]["grid-template-rows"], "100px 50px 100px 50px 100px");
	t.is(output["body"]["grid-template-areas"],
		`\n\t\t"nw  ... n   ... ne "\n\t\t"... ... ... ... ..."\n\t\t"w   ... ... ... e  "`
		+`\n\t\t"... ... ... ... ..."\n\t\t"sw  ... s   ... se "`);
})

test('other ascii formats: simple segments', async t => {
	let output = await process(
	`div {
		grid-kiss:
		     "┌──────┐  ┌──────┐      "
		     "│      │  │ bar →│ 200px"
		     "│  ↓   │  └──────┘      "
		     "│ baz  │             -  "
		     "│  ↑   │  ┌──────┐      "
		     "│      │  │  ↑   │ max"
		     "└──────┘  │      │      "
		     "          │ foo  │   -  "
		     "┌──────┐  │      │      "
		     "│ ← qux│  │  ↓   │ 200px"
		     "│  ↓   │  │      │      "
		     "└─20em─┘  └──────┘      "
	}`, { optimize: false });

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
		"grid-template-rows": "200px max-content 200px",
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
	}`, { optimize: false });

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

test('fallback properties with mixed relative/fixed', async t => {
	let output = await process(
	`body {
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
	}`, { fallback: true });

	t.is("supports" in output, true);
	t.is(output["supports"].params, 'not (grid-template-areas:"test")');

	t.deepEqual(output["supports"]["body"], {
		"position": "relative",
		"display": "block",
		"width": "100%",
		"height": "100%"
	})

	t.deepEqual(output["supports"]["body > *"], {
		"position": "absolute",
		"box-sizing": "border-box",
	})

	t.deepEqual(output["supports"]["body > header"], {
		"top":"0",
		"max-height":"120px",
		"left": "0",
		"width":"100%"
	})

	t.deepEqual(output["supports"]["body > .sidebar"], {
		"top":"120px",
		"height":"calc(100% - 180px)",
		"left":"0",
		"width":"150px"
	})

	t.deepEqual(output["supports"]["body > main"], {
		"top":"120px",
		"height":"calc(100% - 180px)",
		"left":"150px",
		"width":"calc(100% - 150px)"
	})

	t.deepEqual(output["supports"]["body > footer"], {
		"bottom":"0",
		"max-height":"60px",
		"left":"50%",
		"max-width":"100%",
		"transform":"translateX(-50%)"
	})

})

test('fallback properties with all fixed', async t => {
	let output = await process(
	`body {
		grid-kiss:
	    "┌──────┐ ┌────────────────┐         "
	    "│      │ │                │  100px  "
	    "│   ↑  │ │    < .bar      │         "
	    "│ .baz │ └────────────────┘    -    "
	    "│   ↓  │ ┌───────┐ ┌──────┐         "
	    "│      │ |       | │      │  100px  "
	    "└──────┘ └───────┘ │  ↓   │         "
	    "┌────────────────┐ │ .foo │    -    "
	    "│     .qux       │ │  ↑   │         "
	    "│    >     <     │ │      │  100px  "
	    "└────────────────┘ └──────┘         "
	    "  100px |  100px  |  100px          "
	    ;
	}`, { browsers: ["ie 11"] });

	t.is("supports" in output, true);
	t.is(output["supports"].params, 'not (grid-template-areas:"test")');
	t.is("media" in output, true);
	t.is(output["media"].params, 'screen and (min-width:0\\0)');

	t.deepEqual(output["supports"]["body"], {
		"position": "relative",
		"display": "block",
		"width": "300px",
		"height": "300px"
	})

	t.deepEqual(output["supports"]["body > *"], {
		"position": "absolute",
		"box-sizing": "border-box",
	})

	t.deepEqual(output["supports"]["body > .baz"], {
		"top":"0",
		"height":"200px",
		"left":"0",
		"width": "100px"
	})

	t.deepEqual(output["supports"]["body > .bar"], {
		"top":"0",
		"height":"100px",
		"left":"100px",
		"max-width": "200px"
	})

	t.deepEqual(output["supports"]["body > .qux"], {
		"top":"200px",
		"height":"100px",
		"left":"100px",
		"max-width":"200px",
		"transform": "translateX(-50%)"
	})

	t.deepEqual(output["supports"]["body > .foo"], {
		"top":"200px",
		"max-height":"200px",
		"left":"200px",
		"transform": "translateY(-50%)",
		"width":"100px"
	})

})

test('fallback properties with all relative', async t => {
	let output = await process(
	`body {
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
	   ;
	}`, { browsers: ["chrome 50"], optimize: false });

	t.is("supports" in output, true);
	t.is(output["supports"].params, 'not (grid-template-areas:"test")');
	t.is("media" in output, false);

	t.deepEqual(output["supports"]["body"], {
		"position": "relative",
		"display": "block",
		"width": "100%",
		"height": "100%"
	})

	t.deepEqual(output["supports"]["body > *"], {
		"position": "absolute",
		"box-sizing": "border-box",
	})

	t.deepEqual(output["supports"]["body > .a"], {
		"top":"0",
		"height":"20%",
		"right":"88.88889%",
		"max-width":"11.11111%",
	})

	t.deepEqual(output["supports"]["body > .b"], {
		"top":"0",
		"height":"20%",
		"left":"88.88889%",
		"max-width":"11.11111%",
	})

	t.deepEqual(output["supports"]["body > .c"], {
		"top":"20%",
		"height":"33.33333%",
		"left":"11.11111%",
		"width":"22.22222%",
	})

	t.deepEqual(output["supports"]["body > .d"], {
		"top":"20%",
		"height":"33.33333%",
		"left":"66.66667%",
		"width":"22.22222%",
	})

	t.deepEqual(output["supports"]["body > .e"], {
		"top":"53.33333%",
		"height":"46.66667%",
		"left":"33.33333%",
		"width":"33.33333%",
	})

})

test("optimize option", async t => {
	let output = await process(
	`div {
	grid-kiss:
	   "+----------------+ +-----+"
	   "|foo#bar.baz[qux]| | baz |"
	   "+----------------+ +100px+"
	   "+------+  +-20% -+ +-----+"
	   "| .bar |  | #foo | | qux |"
	   "+ > 4em+  +------+ +-----+"
}`, { optimize: true })

	t.is(output["div"]["grid-template"], `"a a b" 1fr "c d e" 1fr / minmax(4em, auto) 20% 100px`);
	t.is(output["div > .bar"]["grid-area"], "c" );
	t.is(output["div > baz"]["grid-area"], "b" );
	t.is(output["div > #foo"]["grid-area"], "d" );
	t.is(output["div > qux"]["grid-area"], "e" );
	t.is(output["div > foo#bar.baz[qux]"]["grid-area"], "a" );
})


test("advanced selectors", async t => {

	let output = await process(
	`div {
		grid-kiss:
		   "+-------+"
		   "| :1    |"
		   "+-------+"
		   "         "
		   "+-------+"
		   "| p:2   |"
		   "+-------+"
		   "         "
		   "+-------+"
		   "| Hello |"
		   "+-------+"
	}`, {
			selectorParser: function (selector) {
				if (/[A-Z]/.test(selector[0])) {
					return `[data-component-name='${selector}']`
				}
				else return selector
			}
		});

	t.is("div > *:nth-child(1)" in output, true)
	t.is("div > p:nth-of-type(2)" in output, true)
	t.is("div > [data-component-name='Hello']" in output, true)

})