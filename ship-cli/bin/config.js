require('console.table');

var config = require('../lib/config');

exports.execute = function(options) {
  options.host && config.set('host', options.host);
  options.secret && config.set('host', options.secret);
  console.table(config.load());
}