/* globals describe, it */
/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */
'use strict';
var chai = require('chai');
var Assertion = chai.Assertion;
Assertion.includeStackTrace = true;
var assert = chai.assert;
var $ = require('..');
var Fs = require('fs');

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
  }); // outdated


  describe('wget', function() {
    it('should download file', function(done) {
      this.timeout(4000);
      var readme = __dirname+'/tmp/wget-file';
      var index = __dirname+'/tmp/index';
      var map = {
        'https://raw.github.com/projmate/projmate-shell/master/README.md':
          readme,
        'https://raw.github.com/projmate/projmate-shell/master/index.js':
          index
      };

      $.wget(map)
      .then(function() {
        assert.isTrue($.test('-f', readme));
        assert.isTrue(Fs.readFileSync(readme, 'utf8').indexOf('projmate-shell') > 0);
        assert.isTrue($.test('-f', index));
        assert.isTrue(Fs.readFileSync(index, 'utf8').indexOf('exports') > 0);
        $.rm(readme);
        $.rm(index);
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });
  }); // wget


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
  }); // unpack


  describe('runner', function() {
    var filename1= __dirname+'/tmp/touch1.txt';
    var filename2 = __dirname+'/tmp/touch2.txt';
    it('should chain', function(done) {
      $ .run('touch', filename1)
        .run('touch', filename2, function() {
          assert.isTrue($.test('-f', filename1));
          assert.isTrue($.test('-f', filename2));
          done();
        });
    });
  });
});

