var config = require('./config').load();
var request = require('request');


exports.publish = function(formData, cb) {
	var url = config.host + '/api/upload'
	request.post({
		headers: {
			'X-Secret': config.secret || ''
		},
		url: url,
		formData: formData
	}, function optionalCallback(err, httpResponse, body) {
		cb(err, httpResponse, body);
	});
}