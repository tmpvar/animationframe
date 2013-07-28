var binding = require('bindings')('binding');

function AnimationFrame(afterFrameFn) {
  var frameRequests = [],
      frameIdx = 0;

  var tick = function() {
    if (frameRequests.length > 0) {
      var processFrames = frameRequests.slice();
      frameRequests = [];

      while(processFrames.length) {
        processFrames.pop().cb(Date.now());
      }

      frameIdx = 0;

      afterFrameFn && afterFrameFn();
    }
  };

  binding.emit(tick);

  this.cancelAnimationFrame = function(frameIdx) {
    frameRequests = frameRequests.filter(function(a) {
      return a.idx !== frameIdx;
    });
  };

  this.requestAnimationFrame = function(cb) {
    var frameId = frameIdx++;
    process.nextTick(function() {
      frameRequests.push({
        idx : frameId,
        cb :  cb
      });

      binding.dirty();
    });
    return frameId;
  };

  this.destroy = function() {
    frameRequests = [];
    binding.destroy();
  };
};

module.exports = AnimationFrame;
