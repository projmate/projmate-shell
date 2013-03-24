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
 * Gets the node_modules executable depending on the platform.
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

  // node_modules is usually not in path
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

