const fs = require('fs');
const path = require('path');
const debug = require('debug')('gitfox:git');

const file = require('./file');
const exec = require('child_process').exec;

function createExecutor(command, dir) {
  return new Promise(function(resolve, reject) {
    file.isGitRepository(dir, function(err, result) {
      if (err) {
        console.log('\x1b[32m' + path.basename(dir) + '/\033[39m');
        console.log(err);
        return resolve();
      }
      if (!result) {
        console.log('\x1b[32m' + path.basename(dir) + '/\033[39m');
        console.log("Not a GIT repository");
        return resolve();
      }
      file.hasRemoteRepo(dir, function(bool) {
        if (bool) {
          exec(command, { cwd: dir, timeout: 20000 }, function(err, stdout, stderr) {
            console.log('\x1b[32m' + path.basename(dir) + '/\033[39m');
            if (err) {
              console.log('\x1b[31m' + err);
            } else if (stderr) {
              console.log(stderr);
            } else if (stdout) {
              process.stdout.write(stdout);
            }
            return resolve();
          });
        } else {
          return resolve();
        }
      });
    });
  });
}

module.exports = function(command, parent) {
  fs.readdir(parent, function(err, files) {
    if (err) {
      console.log(err);
      return;
    }
    let promises = files.map(function(file) {
      return createExecutor('git ' + command, path.join(parent, file))
    });
    promises.push(createExecutor('git ' + command, parent))
    Promise.all(promises).then();
  });
};
