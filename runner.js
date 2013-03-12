/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var async = require('async');
var cp = require('child_process');
var Path = require('path');
var Fs = require('fs');
var Utils = require('./utils');
var coffee = Utils.which('coffee');
var isWindows = Utils.isWindows;

/**
 * Executes one or more shell commmands in a series.
 *
 * @example
 *
 *  var runner = new Runner();
 *
 *  runner.run('node', ['script.js'], callback);
 *  runner
 *    .add('node', ['script.js']);
 *    .start(callback);
 *  runner
 *    .add('node', ['script.js'])
 *    .add('node', ['otherScript.js'])
 *    .start(callback);
 */
function Runner() {
  this.commands = [];
  return this;
}


/**
 * Enqueues a command which is later executed as part of a series
 * of commands.
 *
 * @param {String} cmd
 * @param {String} args
 * @param {Function} cb
 */
Runner.prototype.add = Runner.prototype.run = function(cmd, args, cb) {
  if (!args) args = [];
  if (typeof args === 'function') {
    cb = args;
    args = [];
  }

  // spawn expects as an array for args, and this library allows single arg
  if (!Array.isArray(args)) args = [args];

  // "node script arg" => cmd="node" args=["script", "arg"]
  var newArgs = cmd.split(/\s+/);
  cmd = newArgs.shift();
  args = newArgs.concat(args);

  this.commands.push({command: cmd, args: args});
  if (cb)
    return this.start(cb);
  else
    return this;
}

/**
 * Executes a nodeJS script.
 *
 * @param {Array|String} args If the args is a string then it is split on whitespace.
 */
Runner.prototype.node = function(args, cb) {
  if (!Array.isArray(args))
    args = args.split(/\s+/);

  this.commands.push({command: "node", args: args});
  if (cb)
    return this.start(cb);
  else
    return this;
}


/**
 * Runs a CoffeeScript script.
 *
 * @param {Array|String} args If the args is a string then it is split on whitespace.
 */
Runner.prototype.coffee = function(args, cb) {
  if (!Array.isArray(args))
    args = args.split(/\s+/);

  this.commands.push({command: coffee, args: args});
  if (cb)
    return this.start(cb);
  else
    return this;
}


/**
 * Start the series of commands.
 *
 * @param {Function} cb
 */
Runner.prototype.start = function(cb) {
  if (!cb) cb = function() {};

  function run(info, cb) {
    var cmd = cp.spawn(info.command, info.args, {stdio: 'inherit'});
    cmd.on('exit', cb);
  }

  if (this.commands.length > 0)
    async.forEach(this.commands, run, cb);
  else
    cb();
};


module.exports = Runner;
