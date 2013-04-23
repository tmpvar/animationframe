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

var id = manager.requestAnimationFrame(function(millis) {
  // draw stuff, endOfFrame will be called after this
});

// Stop rendering after a second
setTimeout(function() {
  manager.cancelAnimationFrame(id);
}, 1000)

// If you need to cleanup all of the callbacks and allow node to exit
manager.destroy();

```



# license

MIT