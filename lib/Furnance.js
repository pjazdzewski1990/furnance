#!/usr/bin/env node
/*
 * Furnance
 * https://github.com/jfk/Furnance
 *
 * Copyright (c) 2014 Patryk Jazdzewski
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;

var log = function(str) {
  console.log("Furnance: " + str);
};

//clean the workspace
var clean = function(input, nextStep){
  log("Cleaning...");
  var child = exec('ant clean -f platforms/android/build.xml', function(err, stdout, stderr) {
    if(err) { 
      throw err;
    }else{
      if(nextStep) nextStep(stdout);
    }
  });
};

//build the app
var build = function(input, nextStep){
  log("Building...");
  var child = exec('ant debug -f platforms/android/build.xml', function(err, stdout, stderr) {
    if(err) { 
      throw err;
    }else{
      if(nextStep) nextStep(stdout);
    }
  });
};

//push the app to devices
//TODO: remove hard-coded values
var start = function(input, nextStep){
  var runnablePackage = runnableClass.slice(0, runnableClass.lastIndexOf("."));
  var runnableProject = runnableClass.slice( runnableClass.lastIndexOf(".") + 1);
  var runOnDevice = function(device){
    log("Starting app " + runnablePackage + "/" + runnableClass + " on " + device);
    var child = exec('adb -s ' + device + ' install -r platforms/android/bin/' + runnableProject + '-debug.apk', function(err, stdout, stderr) {
      if(err) { 
        throw err;
      }else{
        log("Installed app on " + device);
        var child = exec('adb -s ' + device + ' shell am start -a android.intent.action.MAIN -n ' + runnablePackage + '/' + runnableClass, 
        function(err, stdout, stderr) {
          if(err) { 
            throw err;
          }else{
            log("Started app on " + device);
            if(nextStep) nextStep(null);
          }
        });
      }
    });
  };//runOnDevice
  for(var i=0; i<input.length; i++){
    runOnDevice(input[i].id);
  }//for
};

//launch tests on connected devices
var test = function(input, nextStep){
  detect(null, start);
};

//detect connected devices
var detect = function(input, nextStep){
  log("Detecting connected devices...");
  var child = exec('adb devices', function(err, stdout, stderr) {
    if(err) { 
      throw err;
    }else{
      var devices = [];
      var lines = stdout.split('\n');
      for(var i=1; i<lines.length-2; i++){
        var data = lines[i].match(/\S+/g);
        devices.push({id: data[0], type: data[1]});
      }
      if(nextStep) nextStep(devices);
    }
  });
};

var runnableClass = process.argv[2];
log("Running - " + runnableClass);
var userArgs = process.argv.slice(3);
log("User Args - " + userArgs);

switch (userArgs[0]) {
  case "clean":
    clean();
    break;
  case "build":
    clean(null, build);
    break;
  case "test":
    clean(null, function(){build(null, test);});
    break;
  default:
}


