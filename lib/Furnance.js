#!/usr/bin/env node
/*
 * Furnance
 * https://github.com/jfk/Furnance
 *
 * Copyright (c) 2013 pjazdzewski1990
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;

var log = function(str) {
  console.log("Furnance: " + str);
};

var clean = function(input, nextStep){
  log("Cleaning...");
  var child = exec('ant clean', function(err, stdout, stderr) {
    if(err) { 
      throw err;
    }else{
      if(nextStep) nextStep(stdout);
    }
  });
};

var build = function(input, nextStep){
  log("Building...");
  var child = exec('ant debug -f build.xml', function(err, stdout, stderr) {log(stdout);
    if(err) { 
      throw err;
    }else{
      if(nextStep) nextStep(stdout);
    }
  });
};

var detect = function(){
  log("Detecting connected devices...");
};

var userArgs = process.argv.slice(2);
log("User Args - " + userArgs);

switch (userArgs[0]) {
  case "clean":
    clean();
    break;
  case "build":
    clean(null, build);
    break;
  default:
}


