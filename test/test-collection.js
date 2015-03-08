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

describe("collection",function() {

  it("createCollection",function() {
    
    var Collection = index.createCollection({
      
    });
    
    var collection = new Collection([
      { id: 1 },
      { id: 2 },
    ]);
    
    assert.ok(index.isCollection(collection));
    assert.strictEqual(collection.length,2);
    assert.deepEqual(collection[0],{ id: 1 });
    assert.deepEqual(collection[1],{ id: 2 });
    
  });

  

});

// - -------------------------------------------------------------------- - //
