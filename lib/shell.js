/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

'use strict';

var shelljs = require('shelljs');
// why do libraries mess with native prototypes, this shell.js crap causes errors
// with other string libraries
delete String.prototype.to;


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
var Vow = require('vow');

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

Shell.__cd = Shell.cd;

Shell.cd = function(path) {
  Shell.__cd(Shell.expand(path));
}

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
  };
}


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
};


/**
 * Runs a single shell command.
 */
Shell.run = function(cmd, args, cb)  {
  return new Runner().run(cmd, args, cb);
};


/**
 * Runs operations within a directory.
 *
 * @param {String} dirname The directory to change into.
 * @param {Function} cb
 *
 * @example
 *   To update a git repo
 *   var task = function(cb) {
 *     $.inside('my-project', function(popcb) {
 *       $.exec('git pull origin master', popcb(cb));
 *     });
 *   }
 *
 *   // sync
 *   $.inside('my-project', function() {
 *     $.cp('from', 'to');
 *   });
 */
var dirs = [];
Shell.inside = function(dirname, cb) {
  dirs.push(process.cwd());
  dirname = Shell.expand(dirname);
  process.chdir(dirname);
  if (cb.length === 1) {
    cb(function(callercb) {
      if (callercb) {
        return function() {
          process.chdir(dirs.pop());
          callercb.apply(null, arguments);
        }
      } else {
        process.chdir(dirs.pop());
      }
    });
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
function _wget(url, outputPath) {
  var promise = Vow.promise();

  var dirname = Path.dirname(outputPath);
  if (!Fs.existsSync(dirname)) Shell.mkdir_p(dirname);
  var bar, length;
  var req = request(url);
  req
    .on('error', function(err) {
      console.error(err);
      promise.reject(err);
    })
    .on('response', function(res) {
      length = parseInt(res.headers["content-length"], 10);
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
    })
    .pipe(Fs.createWriteStream(outputPath))
    .on('close', function() {
      console.log('\n');
      promise.fulfill();
    });

  return promise;
}


/**
 * {Object} map Maps url -> outputPath
 */
Shell.wget = function(map) {
  var promise = Vow.promise();

  var promises = [];
  _.forOwn(map, function(outputPath, url) {
    promises.push(_wget(url, outputPath));
  });

  promise.sync(Vow.all(promises));
  return promise;
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
};


/**
 * Registers an executable so it can be run directly.
 *
 * @param {String} name The name. e.g. 'node'
 * @param {String} [path] The path to executable. If not passed,
 *   `Utils.which` finds the path.
 */
Shell.registerExecutable = function(name, path) {
  Shell[name] = function(args, cb) {
    return new Runner()[name](args, cb);
  };

  Runner.prototype[name] = function(args, cb) {
    if (!Array.isArray(args))
      args = args.split(/\s+/);
    if (!path) path = Utils.which(name);
    return this.enqueue(path, args, cb);
  };
};


/**
 * Much more effecient copy recursive using OS utilities.
 *
 * On Windows, robocopy is used
 * Else rsync
 */
Shell.xcopy = function(source, destination, cb) {
  if (!cb) cb = logError;

  if (isWindows) {
    Shell.run('robocopy ' + source + ' ' + destination + ' /E /Z /ndl /nc /ns', cb);
  } else {
    Shell.run('rsync -aqzL ' + source + ' ' + destination, cb);
  }
};


// register the executables used most
['node', 'bower', 'coffee', 'npm', 'pm'].forEach(function(exe) {
  Shell.registerExecutable(exe);
});

Shell.which = Utils.which;
Shell.HOME = isWindows ? process.env.USERPROFILE : process.env.HOME;
Shell.cp_rf = _.partial(Shell.cp, "-Rf");
Shell.cp_f = _.partial(Shell.cp, "-f");
Shell.mkdir_p = _.partial(Shell.mkdir, "-p");
Shell.rm_rf = _.partial(Shell.rm, "-rf");
Shell.rm_f = _.partial(Shell.rm, "-f");
Shell.pids = Runner.pids;
Shell.hasChildProcesses = Runner.hasChildProcesses;
Shell.killAll = Runner.killAll;

module.exports = Shell;
