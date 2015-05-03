/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var events = require("events");
var classes = require("./classes.js");

// - -------------------------------------------------------------------- - //
// - module

var Emitter = classes.createClass({
  
  inherits: events.EventEmitter,
  
  // new Emitter(..., parent Emitter) :Emitter
  constructor: function(arg,parent) {
    this._lastChange = undefined;
    this._holdChange = false;
    if (parent instanceof Emitter) {
      this._parent = parent;
    }
  },
  
  // .emitChange(data Object) :void
  emitChange: function(data) {
    if (this._holdChange) {
      this._lastChange = data;
    } else {
      this.emit("change",data);
      this._lastChange = undefined;
      if (this._parent instanceof Emitter) {
        this._parent.emitChange(data);
      }
    }
    return !this._holdChange;
  },
  
  // .holdChange() :void
  holdChange: function() {
    this._holdChange = true;
  },
  
  // .releaseChange() :void
  releaseChange: function() {
    this._holdChange = false;
    if (this._lastChange) {
      this.emitChange(this._lastChange);
    }
  },
  
  // .isHoldingChanges() :Boolean
  isHoldingChanges: function() {
    return this._holdChange;
  }
  
});

function isEmitter(arg) {
  return arg instanceof Emitter;
}

function createEmitter(options) {
  options = options || {};
  options.inherits = options.inherits || Emitter;
  return classes.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Emitter: Emitter,
  isEmitter: isEmitter,
  createEmitter: createEmitter
};

// - -------------------------------------------------------------------- - //
