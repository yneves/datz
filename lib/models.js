/*!
**  datz -- Anoter model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

var events = require("events");
var classes = require("./classes.js");

// - -------------------------------------------------------------------- - //
// - module

var Model = classes.createClass({
  
  inherits: events.EventEmitter,
  
  // new Model(values Object) :Model
  constructor: function(values) {
    this._data = {};
    this.set(values);
  },
  
  _getter: function(name) {
    return this._data[name];
  },
  
  _setter: function(name,value) {
    this._data[name] = value;
    this.emit("change");
  },

  // .set(values Object) :void
  set: function(values) {
    if (values instanceof Object) {
      Object.keys(values).forEach(function(key) {
        this._data[key] = values[key];
      }.bind(this));
    }
    this.emit("change");
  },
  
  // .get() :Object
  get: function() {
    var values = {};
    Object.keys(this._data).forEach(function(key) {
      values[key] = this._data[key];
    }.bind(this));
    return values;
  }
  
});

function isModel(arg) {
  return arg instanceof Model;
}

function createModel(options) {
  options = options || {};
  options.inherits = Model;
  
  var NewModel = classes.createClass(options);
  
  if (options.properties instanceof Array) {
    options.properties.forEach(function(name) {
      Object.defineProperty(NewModel.prototype,name,{
        get: function() { return this._getter(name) },
        set: function(value) { this._setter(name,value) },
        enumerable: true,
        configurable: true
      });
    });
  }
  
  return NewModel;
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Model: Model,
  isModel: isModel,
  createModel: createModel
};

// - -------------------------------------------------------------------- - //
