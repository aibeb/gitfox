#!/usr/bin/env node

var git = require('./lib/git');

var path = require('path');

var argv = process.argv.slice(2);

if (argv.length < 1) {
  console.log('Usage: gitfox <command> [<parent-dir>]');
  process.exit(0);
}

var command = argv.shift();
var parent = path.resolve(process.cwd(), argv.shift() || '.');

console.log('Running gitfox on ' + parent);

git(command, parent, function(err) {
  if (err) {
    console.log(err.message);
  }
});
