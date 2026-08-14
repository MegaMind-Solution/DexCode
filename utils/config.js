const path = require("node:path");
const fs = require("node:fs");

(() => {
	const arg = process.argv[2];
	const babelrcpath = path.resolve(__dirname, "../.babelrc");

	try {
		if (fs.existsSync(babelrcpath)) {
			let babelrcText = fs.readFileSync(babelrcpath, "utf-8");
			let babelrc = JSON.parse(babelrcText);

			if (arg === "d") {
				babelrc.compact = false;
			} else if (arg === "p") {
				babelrc.compact = true;
			}

			fs.writeFileSync(babelrcpath, JSON.stringify(babelrc, null, 2), "utf8");
		}
		console.log("DexCode build configuration initialized.");
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();

