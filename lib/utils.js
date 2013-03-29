/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Fs = require('fs');
var Path = require('path');
var Utils = module.exports = {};
var isWindows = require('os').platform().indexOf('win') == 0;
var ShellJS = require('shelljs');

Utils.isWindows = isWindows;


/**
 * Enhanced `which` which searches node_modules/.bin and also
 * checks for `.cmd` on Windows.
 *
 * @param {String} script Name of script, e.g. 'coffee'
 * @returns The full path to script.
 */
Utils.which = function(script) {

  /**
   * Node.js bin scripts are converted to commands.
   */
  function cmdPath(path) {
    if (Fs.existsSync(path)) {
      if (isWindows && Fs.existsSync(path + '.cmd'))
        path += '.cmd';
      return path;
    } else {
      return null;
    }
  }

  var path = Path.join(process.cwd(), 'node_modules/.bin/'+script);
  path = cmdPath(path);
  if (!path) {
    // let the OS handle it
    path = ShellJS.which(script);
    path = cmdPath(path);
  }
  return path;
};


/**
 * Determines if target is older than reference.
 *
 * @param {String} target The target file.
 * @param {String} reference The file to compare against.
 */
Utils.outdated = function(target, reference) {
  if (!Fs.existsSync(target)) return false;
  if (!Fs.existsSync(reference)) return false;
  var referenceStat = Fs.statSync(reference)
  var targetStat = Fs.statSync(target)
  return referenceStat.mtime.getTime() > targetStat.mtime.getTime();
};


/**
 * Gets current home directory.
 */
Utils.homeDir = function() {
  return isWindows ? process.env.USERPROFILE : process.env.HOME;
};


/**
 * Returns either promise or calls the callback.
 */
Utils.either = function(promise, cb) {
  if (typeof cb === 'function') {
    promise.then(
      function(result) {
       cb(null, result);
      },
      function(err) {
        cb(err);
      }
    );
  } else {
    return promise;
  }
}
