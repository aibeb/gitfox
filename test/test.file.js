'use strict';

var assert = require('assert');
var path = require('path');

var file = require('../lib/file');

function resolve(filepath) {
  return path.resolve(__dirname, filepath);
}

describe('file', function() {
  describe('#isDirectory', function() {
    it('should return true if given file path is a directory', function(done) {
      file.isDirectory(resolve('tmp/foo'), function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, true);
        done();
      });
    });

    it('should return false if given file path is not a directory', function(done) {
      file.isDirectory(resolve('tmp/bar.txt'), function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, false);
        done();
      });
    });

    it('should return error if file path is not found', function(done) {
      file.isDirectory(resolve('tmp/baz'), function(err, result) {
        assert.strictEqual(err instanceof Error, true);
        assert.strictEqual(result, undefined);
        done();
      });
    });
  });

  describe('#isGitRepository', function() {
    it('should return true if given file path is a git repository', function(done) {
      file.isGitRepository(resolve('../'), function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, true);
        done();
      });
    });

    it('should return false if given file path is a git repository', function(done) {
      file.isGitRepository(resolve('tmp/foo'), function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, false);
        done();
      });
    });

    it('should return false if file path is not found', function(done) {
      file.isGitRepository(resolve('tmp/baz'), function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, false);
        done();
      });
    });
  });
});