var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var async = require('async');
var colors = require('colors')
var request = require('request');
var config = require('../lib/config').load();
var client = require('../lib/client');

exports.execute = function(options) {

  var host = config.host;
  var packageName = options.packageName;
  var packageVersion = options.packageVersion;
  var manifestPath = options.manifestPath;

  var zipRoot = process.cwd();

  var packageJsonPath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    console.log('Found package.json:'.green, packageJsonPath);
    data = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    zipRoot = data.ship && path.join(process.cwd(), data.ship.zipRoot);
    manifestPath = data.ship && path.join(process.cwd(), data.ship.manifestPath);
    packageName = data.name;
    packageVersion = data.version;
  }

  if (!host) {
    fatal('server host required');
  }

  if (!packageVersion) {
    fatal('verion required');
  }

  if (!packageName) {
    fatal('packageName required');
  }

  if (!manifestPath) {
    fatal('manifestPath required');
  }


  var zipName = generateZipName(packageName, packageVersion);
  var zipPath = path.join(process.cwd(), zipName);

  async.waterfall([

    function zipFiles(done) {
      console.log('Packing:'.green, zipRoot);
      zip(zipRoot, zipPath, function(err) {
        done(err);
      });
    },
    function postFile(done) {
      console.log('Pushing to server...'.green);
      var formData = {
        // Pass a simple key-value pair
        packageName: packageName,
        packageVersion: packageVersion,
        manifest: fs.readFileSync(manifestPath, 'utf-8'),
        zipFile: fs.createReadStream(zipPath),
      };
      client.publish(formData, function(err, response, body) {
        fs.unlinkSync(zipPath);
        done(err, response, body);
      })
    },
  ], function(err, response, body) {
    if (err) {
      fatal(err);
    }
    if (response.statusCode != 200) {
      fatal(body)
    }
    console.log('Success'.green);
  });
}

function fatal(msg) {
  console.log('%s %s', 'Error:'.red, msg);
  process.exit(1);
}


function generateZipName(packageName, version) {
  return packageName + '@' + version + '.zip';
}

function zip(root, zipPath, cb) {
  var command = 'cd ' + root + ' && zip -r ' + zipPath + ' ' + '*'.replace(' ', '\\ ');
  var zip = cp.exec(command, []);
  zip.on('exit', function(code) {
    if (code == 0) {
      return cb(null);
    } else {
      return cb(new Error('zip error'));
    }
  });
}