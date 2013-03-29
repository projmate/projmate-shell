/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var TarGz = require('tar.gz');
var Unzip = require('unzip');
var Path = require('path');
var Fs = require('fs');
var Tar = require('tar');

/**
 * Unpacks archive files.
 *
 * @param {String} filename The archive file with extension in (.tar|tar.gz|.zip)
 * @param {String} outputDir The output directory.
 * @param {Function} cb The callback function.
 */
exports.unpack = function(filename, outputDir, cb) {
  var extname = Path.basename(filename);
  var fn;

  if (/\.tar$/.test(filename)) {
    fn = unpackTar;
  } else if (/\.(tar\.gz|tgz)$/.test(filename)) {
    fn = unpackTarGz;
  } else if (/\.zip$/.test(filename)) {
    fn = unpackZip;
  }
  fn ? fn(filename, outputDir, cb) : cb('Cannot unpack files with extension ' + extname);
}


function unpackTar(filename, outputDir, cb) {
  Fs.createReadStream(filename)
    .pipe(Tar.Extract({path: outputDir}))
    .on('error', cb)
    .on('end', cb);
}


function unpackTarGz(filename, outputDir, cb) {
  var tar = new TarGz;
  tar.extract(filename, outputDir, cb);
}

function unpackZip(filename, outputDir, cb) {
  var reader = Fs.createReadStream(filename);
  reader.on('error', cb);
  reader.on('end', cb);
  reader.pipe(Unzip.Extract({path: outputDir}));
}
