/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var Promise = require("bluebird");

// - -------------------------------------------------------------------- - //
// - module

function isPromise(arg) {
  return arg instanceof Promise;
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Promise: Promise,
  isPromise: isPromise
};

// - -------------------------------------------------------------------- - //
