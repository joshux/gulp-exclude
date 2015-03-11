'use strict';

var path = require('path');
var through = require('through2');
var minimatch = require('minimatch');

module.exports = function(globs, opt) {
  opt = opt || {}
  if(!Array.isArray(globs))
    globs = [globs];
  var cwd = opt.cwd || process.cwd();
  var stream = through.obj(function(file, enc, cb){
    var exclude = globs.some(function(glob) {
      var absGlob = absolute(cwd, glob);
      return minimatch(file.path, absGlob); // needs to cache optimize
    });
    
    if(!exclude)
      cb(null, file);
    else
      cb(null, null);
  });

  return stream;
};

function absolute(cwd, globPattern){
  var mod = '';
  if(globPattern[0] === '!') {
    mod = '!';
    globPattern = globPattern.slice(1);
  }
  return mod + path.resolve(cwd, globPattern);
}
