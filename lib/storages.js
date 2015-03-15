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
            ret = this.insert(job.id,job.data);
            break;
          case "update":
            ret = this.update(job.id,job.data);
            break;
          case "delete":
            ret = this.delete(job.id,job.data);
            break;
          case "select":
            ret = this.select();
            break;
        }
        
        Promise.resolve(ret).finally(function() {
          setImmediate(function() {
            this.process();
          }.bind(this));
        }.bind(this));
        
      } else {
        this._busy = false;
      }
    }
  },
  
  // .watch() :void
  watch: function() {
    
    // Element was added to the collection.
    this.addWatcher(this._collection,"add",function(added) {
      if (added instanceof Array) {
        added.forEach(function(element) {
          
          // Generates unique id for the element.
          element._id = this.guid();
          
          // Adds to processing queue.
          this.queue({
            id: element._id,
            data: element.get(),
            type: "insert"
          });
          
          // Element was updated.
          this.addWatcher(element,"change",function() {
            
            // Adds to processing queue.
            this.queue({
              id: element._id,
              data: element.get(),
              type: "update"
            });
          }.bind(this));
        }.bind(this));
      }
    }.bind(this));
    
    // Element was removed from the collection.
    this.addWatcher(this._collection,"remove",function(removed) {
      if (removed instanceof Array) {
        removed.forEach(function(element) {
          
          // Adds to processing queue.
          this.queue({
            id: element._id,
            data: element.get(),
            type: "delete"
          });
          
          // Stop watching for changes.
          this.removeWatcher(element,"change");
        }.bind(this));
      }
    }.bind(this));

  },
  
  // .unwatch() :void
  unwatch: function() {
    var watchers = this._watchers;
    while (watchers.length > 0) {
      var watcher = _watchers.shift();
      watcher.object.removeListener(watcher.event,watcher.handler);
    }
  },
  
  // .addWatcher(object EventEmitter, event String, handler Function) :void
  addWatcher: function(object,event,handler) {
    if (!(object instanceof events.EventEmitter)) {
      throw new Error("object EventEmitter expected");
    }
    if (typeof event !== "string") {
      throw new Error("event String expected");
    }
    if (typeof handler !== "function") {
      throw new Error("handler Function expected");
    }    
    object.addListener(event,handler);
    this._watchers.push({
      object: object,
      event: event,
      handler: handler
    });
  },
  
  // .removeWatcher(object EventEmitter, event String) :void
  removeWatcher: function(object,event) {
    if (!(object instanceof events.EventEmitter)) {
      throw new Error("object EventEmitter expected");
    }
    if (typeof event !== "string") {
      throw new Error("event String expected");
    }    
    this._watches = this._watchers.filter(function(watcher) {
      if (watcher.object === object) {
        object.removeListener(event,watcher.handler);
        return false;
      } else {
        return true;
      }
    });
  },
  
  // .fetch()
  fetch: function() {
    
  },
  
  // .insert(id String, data Object) :void
  insert: function(id,data) {
    throw new Error("insert not implemented");
  },
  
  // .update(id String, data Object) :void
  update: function(id,data) {
    throw new Error("update not implemented");
  },
  
  // .delete(id String, data Object) :void
  delete: function(id,data) {
    throw new Error("delete not implemented");
  },
  
  // .select() :void
  select: function() {
    throw new Error("select not implemented");
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
