/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var events = require("events");
var classes = require("./classes.js");
var promises = require("./promises.js");

// - -------------------------------------------------------------------- - //
// - module

var Promise = promises.Promise;

var Storage = classes.createClass({
  
  inherits: events.EventEmitter,
  
  // new Storage() :Storage
  constructor: function() {
    this._queue = [];
  },

  // .queue(job Object) :void
  queue: function() {
    this._queue.push.apply(this._queue,arguments);
    if (!this._busy) {
      setTimeout(function() {
        this.process();
      }.bind(this),0);
    }
  },
  
  // .process() :void
  process: function() {
    if (!this._busy) {
      if (this._queue.length > 0) {
        this._busy = true;
        
        var ret;
        var job = this._queue.shift();
        
        switch(job.type) {
          case "insert":
            ret = this.insert(job);
            break;
          case "update":
            ret = this.update(job);
            break;
          case "delete":
            ret = this.delete(job);
            break;
          case "select":
            ret = this.populate(this.select(job));
            break;
        }
        
        Promise.resolve(ret)
          .then(job.then,job.fail)
          .finally(function() {
            setTimeout(function() {
              this._busy = false;
              this.process();
            }.bind(this),0);
          }.bind(this));
        
      } else {
        this._busy = false;
      }
    }
  },

  // .createCollection()
  createCollection: function() {
    var Collection = this.collection;
    this._collection = new Collection();
    return this._collection;
  },
  
  // .watchCollection() :void
  watchCollection: function() {
    
    var handleInsert = function(model) {
      this.queue({
        type: "insert",
        model: model,
        index: this._collection.indexOf(model)
      });
    }.bind(this);
    
    var handleUpdate = function(model) {
      this.queue({
        type: "update",
        model: model,
        index: this._collection.indexOf(model)
      });
    }.bind(this);
    
    var handleDelete = function(model) {
      this.queue({
        type: "delete",
        model: model,
        index: this._collection.indexOf(model)
      });
    }.bind(this);
    
    var handleChange = function(event) {
      if (event.target === this._collection) {
        event.added.forEach(handleInsert);
        event.removed.forEach(handleDelete);
      } else {
        var target = event.target;
        var max = 10;
        while (target._parent !== this._collection) {
          target = target._parent;
          if (!--max) {
            break;
          }
        }
        if (target) {
          handleUpdate(target);
        }
      }
    }.bind(this);
    
    this._collection.on("change",handleChange);
  },
  
  // .fetch() :Promise
  fetch: function() {
    return new Promise(function(resolve,reject) {
      this.queue({
        type: "select",
        then: resolve,
        fail: reject
      });
    }.bind(this));
  },
  
  // .populate(value Promise) :Promise
  populate: function(value) {
    return new Promise(function(resolve,reject) {
      Promise.resolve(value).then(function(items) {
        if (items instanceof Array) {
          this._collection._reset(items);
          resolve();
        } else {
          reject(new Error("Array expected"));
        }
      }.bind(this),reject);
    }.bind(this));
  },
  
  // .insert(job Object) :void
  insert: function(job) {
    throw new Error("insert not implemented");
  },
  
  // .update(job Object) :void
  update: function(job) {
    throw new Error("update not implemented");
  },
  
  // .delete(job Object) :void
  delete: function(job) {
    throw new Error("delete not implemented");
  },
  
  // .select(job Object) :void
  select: function(job) {
    throw new Error("select not implemented");
  }
  
});

function isStorage(arg) {
  return arg instanceof Storage;
}

function createStorage(options) {
  options = options || {};
  options.inherits = options.inherits || Storage;
  return classes.createClass(options);
}

// - -------------------------------------------------------------------- - //
// - exports

module.exports = {
  Storage: Storage,
  isStorage: isStorage,
  createStorage: createStorage
};

// - -------------------------------------------------------------------- - //
