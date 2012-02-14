var files = ["header", "o_O", "eventize", "property", "binding", "helpers", "bindings", "klass", "collection"]
var fs = require("fs")

var js = files.map(function(file) {
	return fs.readFileSync("./lib/" + file + ".js")
})

fs.writeFileSync("o_O.js", "!function() {\n\n" + js.join("\n\n") + "\n\n}();")
