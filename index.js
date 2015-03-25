/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var modules = [
  require("./lib/models.js"),
  require("./lib/collections.js"),
  require("./lib/storages.js"),
  require("./lib/promises.js")
];

modules.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
    module.exports[key] = obj[key];
  });
});

// - -------------------------------------------------------------------- - //
