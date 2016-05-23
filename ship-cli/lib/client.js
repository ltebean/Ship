var config = require('./config').load();
var request = require('request');


exports.publish = function(formData, cb) {
	var url = config.host + '/api/upload'
	request.post({
		headers: {
			'X-Token': 'config.token'
		},
		url: url,
		formData: formData
	}, function optionalCallback(err, httpResponse, body) {
		cb(err, body);
	});
}

function post(path, data, cb) {
	var token = config.token;
	var host = config.host;
	var options = {
		headers: {
			'X-Token': config.token
		},
		uri: config.host + path,
		method: 'POST',
		json: data
	};
	request(options, function(err, response, body) {
		cb(err, body);
	});
}