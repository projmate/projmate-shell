/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var cp = require('child_process');
var __slice = [].slice;
var shelljs = require('shelljs');
var Path = require('path');
var Runner= require('./runner');

var Shell = {
  __proto__: shelljs
};


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
}


/**
 * Times a node script.
 */
Shell.timeNode = function(args, cb) {
  if (!Array.isArray(args)) args = [args];

  var start = new Date();
  var cmd = cp.spawn('node', args, {stdio: 'inherit'});
  cmd.on('exit', function() {
    var d =  delta(start, new Date());
    var s = "";
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
 *  Shell.runner
 *    .add('node', ['a.js'])
 *    .add('node', ['b.js'])
 *    .start(callback);
 */
Shell.__defineGetter__('runner', function() {
  return new Runner();
});


/**
 * Executes a nodeJS script.
 */
Shell.node = function(args, cb) {
  var runner = new Runner();
  runner.node(args);
  runner.start(cb);
}


/**
 * Runs a CoffeeScript script.
 */
Shell.coffee = function(args, cb) {
  var runner = new Runner();
  runner.coffee(args);
  runner.start(cb);
}


/**
 * Gets the node_module/.bin/SCRIPT path on unix or Windows
 */
Shell.nmbin = Runner.nmbin;

module.exports = Shell;
