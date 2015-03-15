/*!
**  datz -- Anoter model and collection library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/datz>
*/
// - -------------------------------------------------------------------- - //
// - assets

var assert = require("assert");
var index = require("../index.js");

// - -------------------------------------------------------------------- - //
// - tests

describe("model",function() {

  it("createModel",function() {
    var Model = index.createModel({
      properties: [
        "id",
        "name"
      ],
    });
    var model = new Model({
      id: 1,
      name: "test"
    });
    assert.ok(index.isModel(model));
    assert.strictEqual(model.id,1);
    assert.strictEqual(model.name,"test");
  });
  
  it("change event",function() {
    var Model = index.createModel({
      properties: [
        "id",
        "name"
      ],
    });
    var model = new Model({
      id: 1,
      name: "test"
    });
    var fired = false;
    model.on("change",function() {
      fired = true;
    });
    assert.strictEqual(model.id,1);
    assert.strictEqual(fired,false);
    model.id = 2;
    assert.strictEqual(model.id,2);
    assert.strictEqual(fired,true);
  });

  

});

// - -------------------------------------------------------------------- - //
