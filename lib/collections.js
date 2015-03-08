/*!
**  datz -- Anoter model and collection library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

var classes = require("./classes.js");

// - -------------------------------------------------------------------- - //
// - module

var Collection = classes.createClass({
  
  constructor: function(items) {
    this.length = 0;
    if (items instanceof Array) {
      this.push.apply(this,items);
    }
  },
  
  map: Array.prototype.map,
  sort: Array.prototype.sort,
  filter: Array.prototype.filter,
  forEach: Array.prototype.forEach,
  
  pop: Array.prototype.pop,
  push: Array.prototype.push,
  shift: Array.prototype.shift,
  unshift: Array.prototype.unshift,
  
  slice: Array.prototype.slice,
  splice: Array.prototype.splice,

  indexOf: Array.prototype.indexOf
  
});

function isCollection(arg) {
  return arg instanceof Collection;
}

function createCollection(options) {
  options = options || {};
  options.inherits = Collection;
  return classes.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Collection: Collection,
  isCollection: isCollection,
  createCollection: createCollection
};

// - -------------------------------------------------------------------- - //
