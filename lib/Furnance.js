#! /usr/bin/env node
/*
 * Furnance
 * https://github.com/jfk/Furnance
 *
 * Copyright (c) 2013 pjazdzewski1990
 * Licensed under the MIT license.
 */

'use strict';

exports.awesome = function() {
  return 'awesome';
};

var clean = function(){
  console.log("Furnance: Cleaning...");
};

var build = function(){
  clean();
  console.log("Furnance: Building...");
};

var detect = function(){
  
};

exports.clean = clean;
exports.build = build;
