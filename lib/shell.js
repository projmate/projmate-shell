/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var __slice = [].slice;
var shelljs = require('shelljs');
var Fs = require('fs');
var Path = require('path');
var Runner= require('./runner');
var _ = require('lodash');
var Utils = require('./utils');
var os = require('os');
var platform = os.platform();

var Shell = {
  __proto__: shelljs
};
_.extend(Shell, Utils);


/**
 * Calculates the delta between two dates.
 */
function delta(start, stop) {
  var d = new Date(stop - start);
  return {
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds()
  }
};


/**
 * Times a node script.
 */
Shell.timeNode = function(args, cb) {
  var start = new Date();
  Shell.node(args, function() {
    var d =  delta(start, new Date());
    var s = '';
    if (d.minutes) s += d.minutes + ' m ';
    s += d.seconds + '.' + d.milliseconds + ' s';
    console.log('Time taken: ' + s);
    cb();
  });
}


/**
 * Runs a single shell command.
 */
Shell.run = function(cmd, args, cb)  {
  var runner = new Runner();
  runner.add(cmd, args);
  runner.start(cb);
}


/**
 * Runs a series of commands.
 *
 * @example
 *  $.runner
 *    .add('node', ['a.js'])
 *    .add('node', ['b.js'])
 *    .start(callback);
 */
Shell.__defineGetter__('runner', function() {
  return new Runner();
});


/**
 * Executes a nodeJS script.
 *
 * @example
 *   To run node script
 *     $.node('server/app.js --port 20101');
 */
Shell.node = function(args, cb) {
  var runner = new Runner();
  runner.node(args);
  runner.start(cb);
}


/**
 * Runs a CoffeeScript script.
 *
 * @example
 *   To build scripts
 *     $.coffee('-c -o build src');
 *
 *   To run a script
 *     $.coffee('src/app.coffee');
 */
Shell.coffee = function(args, cb) {
  var runner = new Runner();
  runner.coffee(args);
  runner.start(cb);
};


/**
 * Runs operations within a directory.
 *
 * @param {String} dirname The directory to change into.
 * @param {Function} cb
 *
 * @example
 *   To update a git repo
 *     $.inside('my-project', function() {
 *       $.exec('git pull origin master');
 *     });
 */
var dirs = [];
Shell.inside = function(dirname, cb) {
  dirs.push(process.cwd());
  process.chdir(dirname);
  if (cb.length === 1) {
    cb(function() {
      process.chdir(dirs.pop());
    })
  } else {
    cb();
    process.chdir(dirs.pop());
  }
};


Shell.open = function(file) {
  if (platform === 'darwin') {
    Shell.run('open', [file]);
  } else {
    console.error('Platform not supported for open: ', platform);
  }
}


Shell.cp_rf = _.partial(Shell.cp, "-rf");
Shell.cp_f = _.partial(Shell.cp, "-f");
Shell.mkdir_p = _.partial(Shell.mkdir, "-p");
Shell.rm_rf = _.partial(Shell.rm, "-rf");

module.exports = Shell;
