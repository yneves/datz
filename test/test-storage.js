/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - assets

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var index = require("../index.js");
var DiskStorage = require("./storage/disk-storage.js");

var data = path.resolve(__dirname,"storage/data");

// - -------------------------------------------------------------------- - //
// - tests

describe("storage",function() {
  
  beforeEach(function() {
    fs.readdirSync(data).forEach(function(file) {
      fs.unlinkSync(path.resolve(data,file));
    });
  });

  afterEach(function() {
    fs.readdirSync(data).forEach(function(file) {
      fs.unlinkSync(path.resolve(data,file));
    });
  });

  it("constructor error",function() {
    assert.throws(function() {
      var storage = new DiskStorage();
    },/collection expected/i);
  });
  
  it("constructor ok",function() {
    var Model = index.createModel();
    var Collection = index.createCollection({ model: Model });
    var collection = new Collection();
    var storage = new DiskStorage(collection);
    assert.ok(storage instanceof index.Storage);
    assert.ok(index.isStorage(storage));
  });
  
  it("insert update delete select",function(done) {
    var Model = index.createModel({ props: ["a"] });
    var Collection = index.createCollection({ model: Model });
    var collection = new Collection();
    var storage = new DiskStorage(collection);
    assert.strictEqual(fs.readdirSync(data).length,0);
    storage.start(function() {
      collection.push(collection.createItem({a:1}));
      collection.push(collection.createItem({a:2}));
      collection.push(collection.createItem({a:3}));
      setTimeout(function() {
        assert.strictEqual(fs.readdirSync(data).length,3);
        assert.strictEqual(JSON.parse(fs.readFileSync(path.resolve(data,collection[0]._id),"utf8")).data.a,1);
        collection[0].a = 2;
        setTimeout(function() {
          assert.strictEqual(JSON.parse(fs.readFileSync(path.resolve(data,collection[0]._id),"utf8")).data.a,2);
          var copyCollection = new Collection();
          var copyStorage = new DiskStorage(copyCollection);
          copyStorage.start(function() {
            assert.deepEqual(copyCollection.toJSON().sort(),collection.toJSON().sort());
            collection.splice(0,3);
            setTimeout(function() {
              assert.strictEqual(fs.readdirSync(data).length,0);
              done();
            },100);
          });
        },100);
      },100);
    });
  });

});

// - -------------------------------------------------------------------- - //
