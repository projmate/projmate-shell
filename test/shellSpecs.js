/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var assert = require('chai').assert;
var $ = require('..');

describe('Shell', function() {
  describe('outdated', function() {
    it('should compare two files for outdated', function() {
      var newer = __dirname + '/../lib/shell.js';
      var older = __dirname + '/../LICENSE';
      var missing = __dirname + '/../doesnotexist';
      assert.isFalse($.outdated(newer, older));
      assert.isTrue($.outdated(older, newer));
      assert.isFalse($.outdated(newer, missing));
      assert.isFalse($.outdated(missing, older));
    });
  });

  describe('wget', function() {
    it('should download file', function(done) {
      this.timeout(4000);
      var output = __dirname+'/tmp/wget-file';

      $.wget(
        'https://raw.github.com/projmate/projmate-shell/master/README.md',
        output, function(err) {
          assert.ifError(err);
          assert.isTrue($.test('-f', output));
          $.rm(output);
          done();
        }
      );
    });
  });


  describe('unpack', function() {
    it('should unarchive zip', function(done) {
      var filename = 'lib.zip';
      var archive = __dirname+'/'+filename;
      var outputDir = __dirname+'/tmp/'+filename;

      $.unpack(archive, outputDir, function(err) {
        assert.ifError(err);
        assert.isTrue($.test('-d', outputDir));
        var shell = require(outputDir+'/lib/shell');
        assert.equal(shell.HOME, $.HOME);
        done();
      });

    });

    it('should unarchive tar', function(done) {
      var filename = 'lib.tar';
      var archive = __dirname+'/'+filename;
      var outputDir = __dirname+'/tmp/'+filename;

      $.unpack(archive, outputDir, function(err) {
        assert.ifError(err);
        assert.isTrue($.test('-d', outputDir));
        var shell = require(outputDir+'/lib/shell');
        assert.equal(shell.HOME, $.HOME);
        done();
      });
    });

    it('should unarchive tar.gz', function(done) {
      var filename = 'lib.tar.gz';
      var archive = __dirname+'/'+filename;
      var outputDir = __dirname+'/tmp/'+filename;

      $.unpack(archive, outputDir, function(err) {
        assert.ifError(err);
        assert.isTrue($.test('-d', outputDir));
        var shell = require(outputDir+'/lib/shell');
        assert.equal(shell.HOME, $.HOME);
        done();
      });
    });

    it('should unarchive tar.gz', function(done) {
      var filename = 'lib.tar.gz';
      var archive = __dirname+'/'+filename;
      var outputDir = __dirname+'/tmp/'+filename;

      $.unpack(archive, outputDir, function(err) {
        assert.ifError(err);
        assert.isTrue($.test('-d', outputDir));
        var shell = require(outputDir+'/lib/shell');
        assert.equal(shell.HOME, $.HOME);
        done();
      });
    });
  });



});

