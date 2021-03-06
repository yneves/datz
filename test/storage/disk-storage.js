/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - libs

"use strict";

var fs = require("fs");
var path = require("path");
var datz = require("../../");

// - -------------------------------------------------------------------- - //
// - module

var DiskStorage = datz.createStorage({
  
  // .insert(job Object) :void
  insert: function(job) {
    return new datz.Promise(function(resolve,reject) {
      var dir = path.resolve(__dirname,"data");
      var id = "_" + Math.random().toString().replace(/\./,"");
      var file = path.resolve(dir,id);
      var data = job.model.toJSON();
      data._id = id;
      data._index = job.index;
      var content = JSON.stringify(data,null,2);
      fs.writeFile(file,content,function(error) {
        if (error) {
          reject(error);
        } else {
          job.model._id = id;
          resolve();
        }
      });
    });
  },
  
  // .update(job Object) :void
  update: function(job) {
    return new datz.Promise(function(resolve,reject) {
      var dir = path.resolve(__dirname,"data");
      var file = path.resolve(dir,job.model._id);
      var data = job.model.toJSON();
      data._id = job.model._id;
      data._index = job.index;
      var content = JSON.stringify(data,null,2);
      fs.writeFile(file,content,function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  
  // .delete(job Object) :void
  delete: function(job) {
    return new datz.Promise(function(resolve,reject) {
      var dir = path.resolve(__dirname,"data");
      var file = path.resolve(dir,job.model._id);
      fs.unlink(file,function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  
  // .select(job Object) :void
  select: function(job) {
    return new datz.Promise(function(resolve,reject) {
      var dir = path.resolve(__dirname,"data");
      fs.readdir(dir,function(error,files) {
        if (error) {
          reject(error);
        } else if (files.length > 0) {
          var items = [];
          files.forEach(function(file) {
            file = path.resolve(dir,file);
            fs.readFile(file,function(error,buffer) {
              if (error) {
                reject(error);
              } else {
                var content = buffer.toString();
                items.push(JSON.parse(content));
                if (items.length === files.length) {
                  items.sort(function(a,b) {
                    if (a._index < b._index) {
                      return -1;
                    } else if (a._index > b._index) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
                  resolve(items);
                }
              }
            });
          });
        } else {
          resolve([]);
        }
      });
    });
  }
  
});

// - -------------------------------------------------------------------- - //
// - exports

module.exports = DiskStorage;

// - -------------------------------------------------------------------- - //
