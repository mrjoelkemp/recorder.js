var Diff = require('./diff'),
    GoogleDiff = require('./googlediff'),
    Delta = require('./delta');

var Recorder = module.exports = function (target) {
  // Used to capture the final keypress once idle
  this.idleTimerId = 0;
  // Used to compute the delay between deltas
  this.lastTime = 0;
  this.lastSnapshot = getSnapshot(target);
  this.deltas = [];

  var cb = function () {
    console.log('cb called')
    onInput.call(this, target);
  }.bind(this);

  target.addEventListener('keydown', cb);
  target.addEventListener('change', cb);

  return this;
};

var onInput = function (target) {
  var currentSnapshot = getSnapshot(target),
      delta;

  // Cancel an existing idle timer
  if (this.idleTimerId) clearTimeout(this.idleTimerId);

  delta = new Delta({
    time: getTimeSinceLastCall.call(this)
  });

  delta.computeDiffs({
    previousValue:  this.lastSnapshot,
    currentValue:   currentSnapshot
  });

  // If the delta has the string unchanged
  if (delta.isNoChange()) return;

  this.deltas.push(delta);

  this.lastSnapshot = currentSnapshot;

  if (this.changeWasManuallyTriggered) return;

  // Trigger the idle timer
  // If the user hasn't typed in within a threshold,
  // fire a change event to make sure we get the
  // last input
  this.idleTimerId = setTimeout(function () {
    target.onChange();
    this.changeWasManuallyTriggered = true;
  }.bind(this), 190);

};

// Retrieve the deltas
Recorder.prototype.getRecording = function () {
  return {
    deltas: this.deltas
  };
};

// Deletes all of the deltas
Recorder.prototype.clear = function () {
  this.deltas = [];
  this.lastTime = 0;
  this.lastSnapshot = '';
};

  // Play the recording within the supplied target element
Recorder.prototype.play = function (target) {
  var nextFrameAt = 0,
      // All deltas will be applied to this state
      code = [];

  this.deltas.forEach(function (delta) {
    // Stagger the delay to create a sequence
    nextFrameAt += Number(delta.time);

    // Apply all changes of the current delta
    delta.diffs.forEach(function (diff) {

      if (diff.operation === diff.REMOVE) {
        code[i] = '';

      } else if (diff.operation === diff.ADD) {
        code[diff.location] = diff.value;
      }
    });

    // Insert it into the target at the right time
    (function (c, t) {

      setTimeout(function () {
        // TODO: Support setting CodeMirror or Ace targets
        target.value = c;
      }, t);

    })(code.join(''), nextFrameAt);
  });
};


//////////////////
// Generic Helpers
//////////////////

var
    // Returns the time since the previous call of this function
    // TODO: Find a better way to keep relative time without
    //    putting too much responsibility on the diff
    //    but also doesn't conflict with multiple recorders
    getTimeSinceLastCall = function () {
      var now = new Date().getTime(),
          // Time delay since last snapshot
          timeSinceLast = this.lastTime ? now - this.lastTime : 0;

      this.lastTime = now;

      return timeSinceLast;
    },

    getSnapshot = function (target) {
      // TODO: Support Ace and CodeMirror entities
      // Do they still input text into the hijacked textarea?
      return target.value;
    };