/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var assert = require('chai').assert;
var sh = require('..');

describe('Shell', function() {
  it('should compare two files for outdated', function() {
    var newer = __dirname + '/../lib/shell.js';
    var older = __dirname + '/../LICENSE';
    var missing = __dirname + '/../doesnotexist';
    assert.isFalse(sh.outdated(newer, older));
    assert.isTrue(sh.outdated(older, newer));
    assert.isFalse(sh.outdated(newer, missing));
    assert.isFalse(sh.outdated(missing, older));
  });
});

