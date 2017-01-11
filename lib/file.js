var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

/**
 * Return true if the given file path is a directory.
 *
 * @param  {String}   file
 * @param  {Function} callback
 */
function isDirectory(file, callback) {
  fs.stat(file, function(err, stats) {
    if (err) {
      return callback(err);
    }
    return callback(null, stats.isDirectory());
  });
}

function isGitRepository(dir, callback) {
  isDirectory(path.resolve(dir, '.git'), function(err, result) {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        // No such file or directory
        return callback(null, false);
      } else {
        // Some other error occured
        return callback(err);
      }
    }
    return callback(null, result);
  });
}

function hasRemoteRepo(dir, callback) {
  var command = 'git remote show';
  runCommand(command, { cwd: dir }, function(err, stdout, stderr) {
    if (err || stderr) {
      var message = '';
      message += 'Something went wrong on "' + dir + '" ...';
      message += 'Command: ' + command;
      if (err) {
        message += 'Message: ' + err.message;
      } else if (stderr) {
        message += 'Message: ' + stderr;;
      }
      console.log(message);
      return callback(false);
    }
    if (!stdout) {
      console.log('\033[36m' + path.basename(dir) + '/\033[39m');
      console.log('Remote tracking repository is not defined');
    }
    callback(!!stdout);
  });
}

function runCommand(command, options, callback) {
  options = options || {};
  exec(command, options, callback);
}

exports.isGitRepository = isGitRepository;
exports.hasRemoteRepo = hasRemoteRepo;
