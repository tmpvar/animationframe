var AnimationFrame = require('./');
var test = require('tap').test;

test("give a callback at the end of a frame", function(t) {

  var called = 0;
  var manager = new AnimationFrame(function() {
    called++;
  });

  var id = manager.requestAnimationFrame(function(time) {
    t.equal(time, Date.now());
    called++;

    manager.cancelAnimationFrame(id);

    setTimeout(function() {
      t.equal(called, 2);
      t.end();
    }, 100);
  });
});

test("destroy", function(t) {

  var called = 0;
  var manager = new AnimationFrame(function() {
    called++;
  });

  var id = manager.requestAnimationFrame(function(time) {
    called++;
  });

  manager.destroy();

  setTimeout(function() {
    t.equal(called, 0);
    t.end();
  }, 100);

});