/*!
**  datz -- Anoter model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

var classes = require("./classes.js");

// - -------------------------------------------------------------------- - //
// - module

var Model = classes.createClass({
  
  constructor: function(values) {
    this._data = {};    
    if (values instanceof Object) {
      Object.keys(values).forEach(function(key) {
        this[key] = values[key];
      }.bind(this));
    }
  },
  
  _getter: function(name) {
    return this._data[name];
  },
  
  _setter: function(name,value) {
    this._data[name] = value;
  },
  
});

function isModel(arg) {
  return arg instanceof Model;
}

function createModel(options) {
  options = options || {};
  options.inherits = Model;
  
  var NewModel = classes.createClass(options);
  
  if (options.properties instanceof Array) {
    Object.keys(options.properties).forEach(function(name) {
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
