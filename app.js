//while true; do node app; done
if (!global.config) {

	global.documentRoot = __dirname;
	global.config = require('./config.json');
	global.fs = require('fs');
	global.coffee = require('coffee-script');
	
	var code = '';
	config.bootstrapper.forEach(function (name) {
		code += fs.readFileSync('src/bootstrapper/' + name) + '\n';
	});
	fs.mkdir('build', function () {
		fs.writeFileSync('build/bootstrapper.js', coffee.compile(code));
		require('./build/bootstrapper');
	});
}
