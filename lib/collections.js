/*!
**  datz -- Anoter model and collection library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

var events = require("events");
var classes = require("./classes.js");

// - -------------------------------------------------------------------- - //
// - module

var Collection = classes.createClass({
  
  inherits: events.EventEmitter,
  
  // new Collection(elements Array) :Collection
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
  slice: Array.prototype.slice,
  indexOf: Array.prototype.indexOf,
  
  // .pop()
  pop: function() {
    var args = Array.prototype.slice.call(arguments,0,arguments.length);
    var element = Array.prototype.pop.apply(this,args);
    this.emit("remove",args);
    return element;
  },
  
  // .push( ... )
  push: function() {
    var args = Array.prototype.slice.call(arguments,0,arguments.length);
    Array.prototype.push.apply(this,args);
    this.emit("add",args);
  },

  // .shift()
  shift: function() {
    var args = Array.prototype.slice.call(arguments,0,arguments.length);
    var element = Array.prototype.shift.apply(this,args);
    this.emit("remove",args);
    return element;
  },

  // .unshift( ... )
  unshift: function() {
    var args = Array.prototype.slice.call(arguments,0,arguments.length);
    Array.prototype.unshift.apply(this,args);
    this.emit("add",args);
  },
  
  // .splice(index,length, ... )
  splice: function() {
    var removed = Array.prototype.splice.apply(this,arguments);
    this.emit("remove",removed);
    if (arguments.length > 2) {
      var added = Array.prototype.slice.call(arguments,2,arguments.length);
      this.emit("add",removed);
    }
    return removed;
  },

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
