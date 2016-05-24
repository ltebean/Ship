var express = require('express');
var config = require('./config');
var db = require('./db');
var semver = require('semver');
var serveStatic = require('serve-static')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cp = require('child_process');
var path = require('path');
var fs = require('fs')
var staticRoot = config.static.root
var port = config.port

var app = express();

app.use('/static', serveStatic(staticRoot, {
	setHeaders: function(res, path) {
		res.setHeader('Cache-control', 'public, max-age=31536000')
	}
}));

app.get('/static/:packageInfo/*', function(req, res) {
	var packageInfo = req.params.packageInfo;
	var info = packageInfo.split('@')
	var packageName = info[0];
	var requiredVersion = info[1];
	var filePath = req.path.split('\/').slice(3).join('/');
	db.findByName(packageName, function(err, rows) {
		rows = rows.filter(function(pkg) {
			return semver.satisfies(pkg.version, requiredVersion)
		}).sort(function(p1, p2) {
			return semver.lt(p1.version, p2.version)
		})
		if (rows.length == 0) {
			return res.sendStatus(404);
		}
		var pkg = rows[0];
		var finalPath = JSON.parse(pkg.manifest)[filePath];
		if (!finalPath) {
			return res.sendStatus(404);
		}
		res.set({
			'Cache-control': 'no-cache'
		});
		return res.redirect(path.join('/static', packageName, finalPath));
	});
});

app.post('/api/upload', multipartMiddleware, function(req, res) {
	var body = req.body;
	var data = {
		name: body.packageName,
		version: body.packageVersion,
		manifest: body.manifest
	}
	var zipPath = req.files.zipFile.path;
	var destination = path.join(staticRoot, data.name);
	unzip(zipPath, destination, function(err) {
		fs.unlinkSync(zipPath);
		if (err) return res.send(err);
		db.insert(data, function(err) {
			if (err) return res.send(err);
			return res.sendStatus(200);
		})
	})
});

app.listen(port, function() {
	console.log('App listening on port', port);
	console.log('Serve static files from', staticRoot);
});

function unzip(zipPath, destination, cb) {
	var command = 'unzip -n ' + zipPath + ' -d ' + destination;
	var unzip = cp.exec(command, []);
	unzip.on('exit', function(code) {
		if (code == 0) {
			return cb(null);
		} else {
			return cb(new Error('zip error'));
		}
	});
}