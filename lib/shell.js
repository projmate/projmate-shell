/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var __slice = [].slice;
var shelljs = require('shelljs');
var Fs = require('fs');
var Path = require('path');
var Runner = require('./runner');
var _ = require('lodash');
var Utils = require('./utils');
var os = require('os');
var platform = os.platform();
var isWindows = platform.indexOf('win') === 0;
var isLinux = platform.indexOf('linux') === 0;
var isMac = platform.indexOf('darwin') === 0;
var log = console;
var request = require('request');
var ProgressBar = require('progress');
var Archive = require('./support/archive');

function logError (err) {
  if (err) log.error(err);
}

/**
 * Shell utility functions
 */
var Shell = {
  __proto__: shelljs
};
_.extend(Shell, Utils);

Shell.isWindows = isWindows;
Shell.isLinux = isLinux;
Shell.isMac = isMac;


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
  return new Runner().run(cmd, args, cb);
};


/**
 * Executes a nodeJS script.
 *
 * @example
 *   To run node script
 *     $.node('server/app.js --port 20101');
 */
Shell.node = function(args, cb) {
  return new Runner().node(args, cb);
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
  return new Runner().coffee(args, cb);
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


/**
 * Opens a platform-specific document.
 *
 * @param {String} file The document to open.
 */
Shell.open = function(file) {
  if (!Fs.existsSync(file))
    return console.error("Could not open " + file);

  if (isMac)
    Shell.run('open', [file]);
  else if (isWindows)
    Shell.run('start', [file]);
  else if (isLinux)
    Shell.run('xdg-open', [file]);
  else
    console.error('Platform not supported for open: ', platform);
};


/**
 * Downloads a file from a url.
 *
 * @param {String} url The file url.
 * @param {outputPath} outputPath The output path.
 * @param {Function} [cb] Optional callback fucntion.
 */
Shell.wget = function(url, outputPath, cb) {
  console.log('url', url);
  console.log('outputPath', outputPath);
  if (typeof cb !== 'function') cb = logError;
  var dirname = Path.dirname(outputPath);
  if (!Fs.existsSync(dirname)) Shell.mkdir_p(dirname);
  var req = request(url);
  var bar, length;

  req.on('error', function(err) {
    console.error(err);
    return cb(err);
  });

  req.on('response', function(res) {
    length = parseInt(res.headers["content-length"]);
    console.log('response length', length);
    if (!isNaN(length)) {
      bar = new ProgressBar(Path.basename(outputPath) + ' [:bar] :percent :etas',{
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: length
      });

      req.on('data', function(chunk) {
        bar.tick(chunk.length);
      });
    }
  });

  req
    .pipe(Fs.createWriteStream(outputPath))
    .on('close', cb)
};


/**
 * Unarchives '.zip', 'tar.gz', 'tgz'
 *
 * @param {String} filname The archive filename.
 * @param {String} outputDir The output directory.
 * @param {Function} [cb] The callback function.
 */
Shell.unpack = function(filename, output, cb) {
  if (typeof cb !== 'function') cb = logError;
  Archive.unpack(filename, output, cb);
}

Shell.which = Utils.which;
Shell.HOME = isWindows ? process.env.USERPROFILE : process.env.HOME;
Shell.cp_rf = _.partial(Shell.cp, "-rf");
Shell.cp_f = _.partial(Shell.cp, "-f");
Shell.mkdir_p = _.partial(Shell.mkdir, "-p");
Shell.rm_rf = _.partial(Shell.rm, "-rf");
Shell.rm_f = _.partial(Shell.rm, "-f");

module.exports = Shell;
