var fs = require('fs');
var path = require('path');
var async = require('async');
var debug = require('debug')('git-all:git');

var file = require('./file');
var exec = require('child_process').exec;

module.exports = function(command, parent, callback) {
  readFiles(parent, function(err, files) {
    if (err) {
      return callback(err);
    }
    var executor = createExecutor('git ' + command);
    async.each(files, executor, callback);
  });
};

function readFiles(dir, callback) {
  fs.readdir(dir, function(err, children) {
    if (err) {
      return callback(err);
    }
    var files = children.map(function(child) {
      return path.join(dir, child);
    });
    return callback(null, files);
  });
}

function createExecutor(command) {
  return function executor(dir, callback) {
    file.isGitRepository(dir, function(err, result) {
      if (err) {
        return callback(err);
      }
      if (!result) {
        return callback(null, {});
      }

      file.hasRemoteRepo(dir, function(bool) {
        if (bool) {
          exec(command, { cwd: dir }, function(err, stdout, stderr) {
            if (err || stderr) {
              debug(dir);
              debug('stdout: ' + stdout);
              debug('stderr: ' + stderr);
              return callback(err);
            }
            console.log('\033[36m' + path.basename(dir) + '/\033[39m');
            if (stdout) {
              process.stdout.write(stdout);
            }
            callback(null);
          });
        }
      });
    });
  };
}
