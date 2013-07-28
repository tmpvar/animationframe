var async = (typeof setImmediate === 'function') ?
            setImmediate :
            function(cb) { setTimeout(cb, 0); };

function AnimationFrame(afterFrameFn, asyncFn) {
  var frameRequests = [],
      frameIdx = 0,
      ticking = false,
      last = 0
      destroyed = false;

  asyncFn = asyncFn || async;

  var tick = function() {
    ticking = true;

    if (frameRequests.length > 0) {
      var now = Date.now();
      if (now - last >= 16.6) {
        while(frameRequests.length > 0) {
          frameRequests.pop().cb(now);
        }

        last = now

        afterFrameFn && afterFrameFn();
      }
    }

    ticking = false;
  };

  this.cancelAnimationFrame = function(frameIdx) {
    frameRequests = frameRequests.filter(function(a) {
      return a.idx !== frameIdx;
    });
  }

  this.requestAnimationFrame = function(cb) {
    var frameId = frameIdx++;

    process.nextTick(function() {
      if (destroyed) {
        return;
      }

      frameRequests.push({
        idx : frameId,
        cb :  cb
      });

      if (!ticking) {
        ticking = true;
        async(tick);
      }
    });
    return frameId;
  }

  this.destroy = function() {
    destroyed = true;
    frameRequests = [];
    ticking = false;
  };
};

module.exports = AnimationFrame;
