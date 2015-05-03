/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
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

var Model = emitters.createEmitter({
  
  // new Model(values Object, parent Emitter) :Model
  constructor: function(values,parent) {
    this._props = {};
    this._models = {};
    this._collections = {};
    this._reset(values);
  },

  // ._reset(values Object) :void
  _reset: function(values) {
    values = values || {};
    
    if (this.props instanceof Array) {
      this.props.forEach(function(key) {
        this._props[key] = values[key];
      }.bind(this));
    }
    
    if (this.models instanceof Object) {
      Object.keys(this.models).forEach(function(key) {
        var Model = this.models[key];
        this._models[key] = new Model(values[key],this);
      }.bind(this));
    }
      
    if (this.collections instanceof Object) {
      Object.keys(this.collections).forEach(function(key) {
        var Collection = this.collections[key];
        this._collections[key] = new Collection(values[key],this);
      }.bind(this));
    }
    
    Object.keys(values).forEach(function(key) {
      if (!this.hasOwnProperty(key)) {
        this[key] = values[key];
      }
    }.bind(this));
    
  },
  
  _getProp: function(name) {
    return this._props[name];
  },
  
  _setProp: function(name,value) {
    var oldValue = this._props[name];
    this._props[name] = value;
    this.emitChange({
      target: this,
      property: name,
      oldValue: oldValue,
      newValue: value
    });
  },
  
  _getModel: function(name) {
    return this._models[name];
  },
  
  _setModel: function(name,value) {
    this._models[name]._reset(value);
    this.emitChange({
      target: this,
      property: name
    });
  },
  
  _getCollection: function(name) {
    return this._collections[name];
  },
  
  _setCollection: function(name,value) {
    this._collections[name]._reset(value);
    this.emitChange({
      target: this,
      property: name
    });
  },

  // .toJSON() :Object
  toJSON: function() {

    var values = {};
    
    Object.keys(this._props).forEach(function(key) {
      values[key] = this._props[key];
    }.bind(this));
    
    Object.keys(this._models).forEach(function(key) {
      values[key] = this._models[key].toJSON();
    }.bind(this));
    
    Object.keys(this._collections).forEach(function(key) {
      values[key] = this._collections[key].toJSON();
    }.bind(this));
    
    return values;
  },
  
  // .toString()
  toString: function() {
    return JSON.stringify(this.toJSON());
  }
  
});

function isModel(arg) {
  return arg instanceof Model;
}

function createModel(options) {
  options = options || {};
  options.inherits = Model;
  
  var NewModel = classes.createClass(options);
  
  if (options.props instanceof Array) {
    options.props.forEach(function(name) {
      classes.createProperty(NewModel,name,{
        get: "_getProp",
        set: "_setProp"
      });
    });
  }
  
  if (options.models instanceof Object) {
    Object.keys(options.models).forEach(function(name) {
      classes.createProperty(NewModel,name,{
        get: "_getModel",
        set: "_setModel"
      });
    });
  }
  
  if (options.collections instanceof Object) {
    Object.keys(options.collections).forEach(function(name) {
      classes.createProperty(NewModel,name,{
        get: "_getCollection",
        set: "_setCollection"
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
