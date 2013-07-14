var async = (typeof setImmediate === 'function') ?
            setImmediate :
            function(cb) { setTimeout(cb, 0); };

function AnimationFrame(afterFrameFn, asyncFn) {
  var frameRequests = [],
      frameIdx = 0,
      ticking = false,
      last = 0;

  asyncFn = asyncFn || async;

  var tick = function() {
    if (frameRequests.length > 0) {

      async(tick);
      var now = Date.now();
      if (now - last >= 16.6) {
        while(frameRequests.length) {
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
    frameIdx++;

    frameRequests.push({
      idx : frameIdx,
      cb :  cb
    });

    if (!ticking) {
      ticking = true;
      async(tick);
    }

    return frameIdx;
  }

  this.destroy = function() {
    frameRequests = [];
    ticking = false;
  };
};

module.exports = AnimationFrame;
