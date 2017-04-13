var saas = require('node-sass');
var path = require('path');

module.exports.act = function(buffer, encoding, callback) {
	var options = this.options();
	var runtime = this;
	// set cacheable flag
	this.cacheable();


	options.filename = this.source;

	// set @import path
	// console.log(runtime.sourceParsed.dir);
	// var path = path.resolve(runtime.sourceParsed.dir, p);

	saas.render({
		data: buffer.toString(),
		includePaths: [runtime.sourceParsed.dir]
	}, function (e, result) {
		if(e) {
			bone.log.warn('bone-act-saas', 'Error msg:'+e.message);
			bone.log.warn('bone-act-saas', 'Error info:\r\n'+JSON.stringify(e, null, 4));
			callback(null, buffer);
		} else {
			if(result.stats && result.stats.includedFiles) {
				result.stats.includedFiles.forEach(function(p) {
					var resolvedPath = path.resolve(runtime.sourceParsed.dir, p);
					runtime.addDependency(resolvedPath);
				});
			}
			callback(null, result.css);
		}
	});
};

module.exports.filter = {
	ext: '.scss'
};
