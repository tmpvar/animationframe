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
      manager.destroy();
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

test("only call once", function(t) {
  var calls = 0;
  var manager = new AnimationFrame(function() {});
  manager.requestAnimationFrame(function(time) {
    calls++;
  });

  setTimeout(function() {
    t.equal(calls, 1);
    t.end();
    manager.destroy();
  }, 32);
});

test("call many times", function(t) {

  var manager = new AnimationFrame(function() {});
  var calls = 0;
  manager.requestAnimationFrame(function tick(time) {

    if (calls < 5) {
      manager.requestAnimationFrame(tick);
    }
    calls++;
  });

  setTimeout(function() {
    t.equal(calls, 5);
    t.end();
    manager.destroy();
  }, 16*6);

});
