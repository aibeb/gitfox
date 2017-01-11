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
        console.log('\033[36m' + path.basename(dir) + '/\033[39m');
        console.log(err);
        return resolve();
      }
      if (!result) {
        console.log('\033[36m' + path.basename(dir) + '/\033[39m');
        console.log("Not a GIT repository");
        return resolve();
      }
      file.hasRemoteRepo(dir, function(bool) {
        if (bool) {
          exec(command, { cwd: dir, timeout: 20000 }, function(err, stdout, stderr) {
            console.log('\033[36m' + path.basename(dir) + '/\033[39m');
            if (err || stderr) {
              console.log(err || stderr);
            }
            if (stdout) {
              process.stdout.write(err || stderr || stdout);
            }
            return resolve();
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
    var promises = files.map(function(item) {
      return createExecutor('git ' + command, item)
    })
    Promise.all(promises).then();
  });
};
