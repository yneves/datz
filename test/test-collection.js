/*!
**  datz -- Another model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - assets

"use strict";

var assert = require("assert");
var index = require("../index.js");

// - -------------------------------------------------------------------- - //
// - tests

describe("collection",function() {

  it("createCollection",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    assert.ok(index.isCollection(collection));
    assert.strictEqual(collection.length,2);
    assert.deepEqual(collection[0],{id:1});
    assert.deepEqual(collection[1],{id:2});
  });

  it("pop",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    collection.on("change",function(event) {
      fired = true;
      assert.deepEqual(event.added,[]);
      assert.deepEqual(event.removed,[{id:2}]);
    });
    assert.deepEqual(collection.pop(),{id:2});
    assert.strictEqual(collection.length,1);
    assert.ok(fired);
  });
  
  it("shift",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    collection.on("change",function(event) {
      fired = true;
      assert.deepEqual(event.added,[]);
      assert.deepEqual(event.removed,[{id:1}]);
    });
    assert.deepEqual(collection.shift(),{id:1});
    assert.strictEqual(collection.length,1);
    assert.ok(fired);
  });
  
  it("push",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    collection.on("change",function(event) {
      fired = true;
      assert.deepEqual(event.added,[{id:3},{id:4}]);
      assert.deepEqual(event.removed,[]);
    });
    collection.push({id:3},{id:4});
    assert.strictEqual(collection.length,4);
    assert.deepEqual(collection[2],{id:3});
    assert.deepEqual(collection[3],{id:4});
    assert.ok(fired);
  });
  
  it("unshift",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    collection.on("change",function(event) {
      fired = true;
      assert.deepEqual(event.added,[{id:3},{id:4}]);
      assert.deepEqual(event.removed,[]);
    });
    collection.unshift({id:3},{id:4});
    assert.strictEqual(collection.length,4);
    assert.deepEqual(collection[0],{id:3});
    assert.deepEqual(collection[1],{id:4});
    assert.ok(fired);
  });
  
  it("splice",function() {
    var Collection = index.createCollection();
    var collection = new Collection([{id:1},{id:2}]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    collection.on("change",function(event) {
      fired = true;
      assert.deepEqual(event.added,[{id:3},{id:4}]);
      assert.deepEqual(event.removed,[{id:1},{id:2}]);
    });
    collection.splice(0,2,{id:3},{id:4});
    assert.strictEqual(collection.length,2);
    assert.ok(fired);
  });
  
  it("model",function() {
    var Model = index.createModel({ props: ["id","name"] });
    var Collection = index.createCollection({ model: Model });
    var collection = new Collection([
      { id: 1, name: "aaa" },
      { id: 2, name: "bbb" }
    ]);
    var fired = false;
    assert.strictEqual(collection.length,2);
    assert.ok(index.isModel(collection[0]));
    assert.ok(index.isModel(collection[1]));
    assert.ok(collection[0] instanceof Model);
    assert.ok(collection[1] instanceof Model);
    collection.on("change",function(event) {
      fired = true;
      assert.strictEqual(event.model,collection[0]);
      assert.strictEqual(event.property,"name");
      assert.strictEqual(event.oldValue,"aaa");
      assert.strictEqual(event.newValue,"ccc");
    });
    collection[0].name = "ccc";
    assert.strictEqual(collection.length,2);
    assert.ok(fired);
  });

});

// - -------------------------------------------------------------------- - //
