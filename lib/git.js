var fs = require('fs');
var path = require('path');
var debug = require('debug')('gitfox:git');

var file = require('./file');
var exec = require('child_process').exec;

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

function createExecutor(command, dir) {
  return new Promise(function(resolve, reject) {
    file.isGitRepository(dir, function(err, result) {
      if (err) {
        return reject(err);
      }
      if (!result) {
        return reject('Not a GIT repository');
      }
      file.hasRemoteRepo(dir, function(bool) {
        if (bool) {
          exec(command, { cwd: dir }, function(err, stdout, stderr) {
            if (err || stderr) {
              debug(dir);
              debug('stdout: ' + stdout);
              debug('stderr: ' + stderr);
              return reject(err || stderr);
            }
            resolve(stdout);
          });
        }
      });
    });
  });
}

module.exports = function(command, parent) {
  readFiles(parent, function(err, files) {
    if (err) {
      return callback(err);
    }
    files.forEach(function(item) {
      createExecutor('git ' + command, item).then(function(result) {
        console.log('\033[36m' + path.basename(item) + '/\033[39m');
        console.log(result);
      }).catch(function(err) {
        console.log('\033[36m' + path.basename(item) + '/\033[39m');
        console.log(err);
      });
    })
  });
};
