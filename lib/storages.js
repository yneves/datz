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
var models = require("./models.js");
var classes = require("./classes.js");
var promises = require("./promises.js");
var collections = require("./collections.js");

// - -------------------------------------------------------------------- - //
// - module

var Promise = promises.Promise;

var Storage = classes.createClass({
  
  inherits: events.EventEmitter,
  
  // new Storage(collection Collection) :Storage
  constructor: function(collection) {
    
    if (collections.isCollection(collection)) {
      this._collection = collection;
    } else {
      throw new Error("Collection expected");
    }
    
    this._queue = [];
    this._watchers = [];
    
  },
  
  // .guid() :String
	guid: function() {
	  var uid = "";
	  for (var i = 0; i < 8 ; i++) {
	    uid += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }
	  return uid;
	},
  
  // .queue(job Object) :void
  queue: function() {
    this._queue.push.apply(this._queue,arguments);
    if (!this._busy) {
      setImmediate(function() {
        this.process();
      }.bind(this));
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
            setImmediate(function() {
              this._busy = false;
              this.process();
            }.bind(this));
          }.bind(this));
        
      } else {
        this._busy = false;
      }
    }
  },
  
  // .start(then Function, fail Function) :void
  start: function(then,fail) {
    
    var handleInsert = function(item) {
      item._id = this.guid();
      item._vs = this.guid();
      this.queue({
        type: "insert",
        id: item._id,
        vs: item._vs,
        data: models.isModel(item) ? item.toJSON() : item,
        index: this._collection.indexOf(item)
      });
    }.bind(this);

    var handleUpdate = function(item) {
      item._vs = this.guid();
      this.queue({
        type: "update",
        id: item._id,
        vs: item._vs,
        data: models.isModel(item) ? item.toJSON() : item,
        index: this._collection.indexOf(item)
      });
    }.bind(this);

    var handleDelete = function(item) {
      this.queue({
        type: "delete",
        id: item._id,
        vs: item._vs,
      });
    }.bind(this);
    
    var handleChange = function(event) {
      if (event.collection) {
        if (event.collection === this._collection) {
          event.added.forEach(handleInsert);
          event.removed.forEach(handleDelete);
        }
      } else if (event.model) {
        if (event.model._parent === this._collection) {
          handleUpdate(event.model);
        }
      }
    }.bind(this);
    
    this._collection.on("change",handleChange);
    
    this._watchers.push({
      object: this._collection,
      event: "change",
      handler: handleChange
    });
    
    this.queue({
      type: "select",
      then: then,
      fail: fail
    });

  },
  
  // .stop() :void
  stop: function() {
    var watchers = this._watchers;
    while (watchers.length > 0) {
      var watcher = _watchers.shift();
      watcher.object.removeListener(watcher.event,watcher.handler);
    }
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
  },
  
  // .populate(items Promise) :void
  populate: function(arg) {
    return new Promise(function(resolve,reject) {
      Promise.resolve(arg).then(function(items) {
        if (items instanceof Array) {
          this._collection._reset(items.map(function(item) {
            return item.data;
          }));
          this._collection.forEach(function(item,index) {
            item._id = items[index].id;
            item._vs = items[index].vs;
          });
          resolve();
        } else {
          reject(new Error("Array expected"));
        }
      }.bind(this),reject);
    }.bind(this));
  }
  
});

function isStorage(arg) {
  return arg instanceof Storage;
}

function createStorage(options) {
  options = options || {};
  options.inherits = Storage;
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
