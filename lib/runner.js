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
var Vow = require('vow');

var pids = {};

function trackPid(pid, app) {
  pids[pid] = app;
}

function untrackPid(pid) {
  delete pids[pid];
}

function run(command, args) {
  var promise = Vow.promise();
  var cmd = cp.spawn(command, args, {stdio: 'inherit'});
  var pid = cmd.pid;

  trackPid(pid, command + ' ' + args);

  cmd
  cmd.on('exit', function() {
    untrackPid(pid);
    promise.fulfill();
  });

  cmd.on('error', function(code) {
    untrackPid(pid);
    promise.reject(code);
  });

  return promise;
}

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
  this.promises = [];
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
  var result = this.enqueue(cmd, args, cb);
  return result;
}


/**
 * Executes a nodeJS script.
 *
 * @param {Array|String} args If the args is a string then it is split on whitespace.
 */
Runner.prototype.node = function(args, cb) {
  if (!Array.isArray(args))
    args = args.split(/\s+/);
  return this.enqueue("node", args, cb);
}


/**
 * Runs a CoffeeScript script.
 *
 * @param {Array|String} args If the args is a string then it is split on whitespace.
 */
Runner.prototype.coffee = function(args, cb) {
  if (!Array.isArray(args))
    args = args.split(/\s+/);
  return this.enqueue(coffee, args, cb);
}


/**
 * Start the series of commands.
 *
 * @param {Function} cb
 */
Runner.prototype.start = function(cb) {
  return Utils.either(Vow.all(this.promises), cb);
}

/**
 * Enqueues a command.
 *
 */
Runner.prototype.enqueue = function(cmd, args, cb) {
  this.promises.push(run(cmd, args));
  if (typeof cb === 'function') {
    return Utils.either(Vow.all(this.promises), cb);
  } else {
    return this;
  }
};

Runner.hasChildProcesses = function() {
  return Object.keys(pids).length > 0;
};


Runner.killAll = function() {
  for (var pid in pids) {
    if (!pids.hasOwnProperty(pid)) continue;
    console.log('Killing ' + pids[pid]);
    process.kill(pid);
  }
};


module.exports = Runner;
