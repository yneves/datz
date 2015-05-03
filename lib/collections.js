/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var classes = require("./classes.js");
var emitters = require("./emitters.js");

// - -------------------------------------------------------------------- - //
// - module

var Collection = emitters.createEmitter({
  
  // new Collection(items Array, parent Emitter) :Collection
  constructor: function(items,parent) {
    if (items) {
      this._reset(items);
    }
  },
  
  // .createModel(values) :void
  createModel: function(values) {
    var Model = this.model;
    return new Model(values,this);
  },

  // ._reset(items Array) :void
  _reset: function(items) {
    if (!(items instanceof Array)) {
      throw new Error("Array expected");
    }
    Array.prototype.splice.call(this,0,this.length);
    if (this.model) {
      items = items.map(this.createModel.bind(this));
    }
    Array.prototype.push.apply(this,items);
  },
  
  map: Array.prototype.map,
  sort: Array.prototype.sort,
  filter: Array.prototype.filter,
  forEach: Array.prototype.forEach,
  slice: Array.prototype.slice,
  indexOf: Array.prototype.indexOf,
  
  // .pop()
  pop: function() {
    var element = Array.prototype.pop.apply(this);
    this.emitChange({
      target: this,
      added: [],
      removed: [element]
    });
    return element;
  },
  
  // .push( ... )
  push: function() {
    var added = Array.prototype.slice.call(arguments,0,arguments.length);
    Array.prototype.push.apply(this,added);
    this.emitChange({
      target: this,
      added: added,
      removed: []
    });
  },

  // .shift()
  shift: function() {
    var element = Array.prototype.shift.apply(this);
    this.emitChange({
      target: this,
      added: [],
      removed: [element]
    });
    return element;
  },

  // .unshift( ... )
  unshift: function() {
    var added = Array.prototype.slice.call(arguments,0,arguments.length);
    Array.prototype.unshift.apply(this,added);
    this.emitChange({
      target: this,
      added: added,
      removed: []
    });
  },
  
  // .splice(index,length, ... )
  splice: function() {
    var added;
    var removed = Array.prototype.splice.apply(this,arguments);
    if (arguments.length > 2) {
      added = Array.prototype.slice.call(arguments,2,arguments.length);
    } else {
      added = [];
    }
    this.emitChange({
      target: this,
      added: added,
      removed: removed
    });
    return removed;
  },
  
  // .toJSON() :Array
  toJSON: function() {
    if (this.model) {
      return this.map(function(model) {
        return model.toJSON();
      });
    } else {
      return this.map(function(item) {
        // TODO: clone
        return item;
      });
    }
  }

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
