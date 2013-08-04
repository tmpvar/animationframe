# animation frame

(request|cancel)AnimationFrame analog for the desktop

## install

`npm install animationframe`

## use

```javascript

// setup a context
var context = /* ... */

var endOfFrame = function() {
  context.swapBuffers();
}

var manager = new (require('animationframe').AnimationFrame)(endOfFrame);

var count = 0;
var id = manager.requestAnimationFrame(function tick(millis) {
  // draw stuff, endOfFrame will be called after this
  count++;
  if (count < 10) {
    manager.requestAnimationFrame(tick);
  } else {
    // If you need to cleanup all of the callbacks and allow node to exit
    manager.destroy();
  }
});

// you could cancel the animation frame request like so:
// manager.cancelAnimationFrame(id);



```



# license

MIT
