var fs = require('fs');
var path = require('path');
var profile = require('./profile')

function initIfNeeded() {
	var home = getSeaportHome();
	if (!fs.existsSync(home)) {
		fs.mkdirSync(home);
		fs.writeFileSync(path.join(home, getConfigFile()), JSON.stringify({
			host: 'http://localhost:8080'
		}));
	}
}

function getConfigFile() {
	var currentProfile = profile.currentProfile();
	return 'config@' + currentProfile + '.json'
}

function getSeaportHome() {
	return profile.getSeaportHome();
}

function set(key, value) {
	var config = load();
	config[key] = value;
	save(config);
}

function get(key) {
	return load()[key];
}

function load() {
	initIfNeeded();
	var configPath = path.join(getSeaportHome(), getConfigFile());
	if (fs.existsSync(configPath)) {
		return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
	} else {
		return {};
	}
}

function save(config) {
	initIfNeeded();
	fs.writeFileSync(path.join(getSeaportHome(), getConfigFile()), JSON.stringify(config));
}
module.exports = {
	set: set,
	get: get,
	load: load,
	save: save,
	home: getSeaportHome
};