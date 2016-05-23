#!/usr/bin/env node

var program = require('commander');
program.version('0.0.1')

program
  .command('profile')
  .description('switch to profile')
  .option('-n, --name [name]', 'profile name')
  .action(function(options) {
    require('../bin/profile').execute({
       name: options.name
    });
  });

program
  .command('config')
  .description('config server address and api secret')
  .option('-h, --host [host]', 'server host')
  .option('-s, --secret [secret]', 'api secret')
  .action(function(options) {
    require('../bin/config').execute({
      host: options.host,
      secret: options.secret,
    });
  });


program
  .command('publish')
  .description('pack resources and publish to server')
  .option('-p, --packageName [packageName]', 'package name')
  .option('-v, --packageVerion [packageVerion]', 'package verion')
  .option('-m, --manifestPath [manifestPath]', 'manifestPath path')
  .action(function(options) {
    require('../bin/publish').execute({
      packageName: options.packageName,
      packageVersion: options.packageVerion,
      manifestPath: options.manifestPath
    });
  });



program.parse(process.argv);
if (program.args.length === 0) program.help()