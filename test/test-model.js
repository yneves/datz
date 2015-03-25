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

describe("model",function() {

  it("createModel",function() {
    var Model = index.createModel({ props: ["id","name"] });
    var model = new Model({ id: 1, name: "test" });
    assert.ok(index.isModel(model));
    assert.strictEqual(model.id,1);
    assert.strictEqual(model.name,"test");
  });
  
  it("props",function() {
    var Model = index.createModel({ props: ["id","name"] });
    var model = new Model({ id: 1, name: "test" });
    var fired = false;
    model.on("change",function(event) {
      fired = true;
      assert.strictEqual(event.property,"id");
      assert.strictEqual(event.oldValue,1);
      assert.strictEqual(event.newValue,2);
    });
    assert.strictEqual(model.id,1);
    assert.strictEqual(fired,false);
    model.id = 2;
    assert.strictEqual(model.id,2);
    assert.strictEqual(fired,true);
  });

  it("models",function() {
    var One = index.createModel({ props: ["one"] });
    var Two = index.createModel({ props: ["two"] });
    var Model = index.createModel({
      props: ["id","name"],
      models: { one: One, two: Two }
    });
    var model = new Model({
      id: 1,
      name: "test",
      one: { one: 1 },
      two: { two: 2 }
    });
    assert.ok(index.isModel(model.one));
    assert.ok(index.isModel(model.two));
    assert.strictEqual(model.one.one,1);
    assert.strictEqual(model.two.two,2);
    assert.deepEqual(model.toJSON(),{
      id: 1,
      name: "test",
      one: { one: 1 },
      two: { two: 2 }
    });
    var fired = false;
    model.on("change",function(event) {
      fired = true;
      assert.strictEqual(event.model,model.one);
      assert.strictEqual(event.property,"one");
      assert.strictEqual(event.oldValue,1);
      assert.strictEqual(event.newValue,2);
    });
    model.one.one = 2;
    assert.strictEqual(fired,true);
    assert.strictEqual(model.one.one,2);
  });

  it("collections",function() {
    var Collection = index.createCollection();
    var Model = index.createModel({
      props: ["id","name"],
      collections: { collect: Collection }
    });
    var model = new Model({
      id: 1,
      name: "test",
      collect: [{a:1},{b:2},{c:3}]
    });
    assert.ok(index.isCollection(model.collect));
    assert.strictEqual(model.collect[0].a,1);
    assert.strictEqual(model.collect[1].b,2);
    assert.strictEqual(model.collect[2].c,3);
    assert.deepEqual(model.toJSON(),{
      id: 1,
      name: "test",
      collect: [{a:1},{b:2},{c:3}]
    });
    assert.strictEqual(model.collect.length,3);
    var fired = false;
    model.on("change",function(event) {
      fired = true;
      assert.strictEqual(event.collection,model.collect);
      assert.deepEqual(event.added,[]);
      assert.deepEqual(event.removed,[{a:1}]);
    });
    assert.deepEqual(model.collect.shift(),{a:1});
    assert.strictEqual(model.collect.length,2);
    assert.strictEqual(fired,true);
  });

});

// - -------------------------------------------------------------------- - //
