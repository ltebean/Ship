var fs = require('fs');
var path = require('path');



function getSeaportHome() {
	var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
	return path.join(home, '.ship');
}

exports.getSeaportHome = getSeaportHome;

exports.useProfile = function(name) {
	fs.writeFileSync(path.join(getSeaportHome(), 'profile.json'), JSON.stringify({profile: name}));
}

exports.currentProfile = function() {
	var configPath = path.join(getSeaportHome(), 'profile.json');
	if (fs.existsSync(configPath)) {
		return JSON.parse(fs.readFileSync(configPath, 'utf-8')).profile;
	} else {
		return 'default';
	}
}