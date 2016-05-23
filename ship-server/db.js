var mysql = require('mysql');
var config = require('./config')

var pool = mysql.createPool(config.mysql);


exports.findByName = function(packageName, cb) {
	pool.query('SELECT * from Package where name = ? and enabled = 1', [packageName], function(err, rows, fields) {
		if (err) {
			return cb(err)
		}
		cb(null, rows);
	});
}

exports.insert = function(data, cb) {
	pool.query('INSERT INTO Package SET ?', data, function(err, result) {
		if (err) {
			return cb(err)
		}
		cb(null)
	});
}