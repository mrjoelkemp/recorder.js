var Delta = require('./delta');

var Recorder = module.exports = function (target) {
  this.target = target;

  // Used to compute the delay between deltas
  this.lastTime = 0;
  this.deltas = [];

  this.lastSnapshot = this._getSnapshot();

  return this;
};

Recorder.prototype._computeDelta = function (currentSnapshot) {
  var delta = new Delta({
    time: this._getTimeSinceLastCall()
  });

  delta.computeDiffs({
    previousValue:  this.lastSnapshot,
    currentValue:   currentSnapshot
  });

  // If the delta has the string unchanged
  if (delta.isNoChange()) return;

  this.deltas.push(delta);

  this.lastSnapshot = currentSnapshot;
};

// Returns the time since the previous call of this function
Recorder.prototype._getTimeSinceLastCall = function () {
  var now = new Date().getTime(),
      // Time delay since last snapshot
      timeSinceLast = this.lastTime ? now - this.lastTime : 0;

  this.lastTime = now;

  return timeSinceLast;
};

// Defaults to textarea value setting
Recorder.prototype._getSnapshot = function () {
  return this.target.value;
};

Recorder.prototype._setSnapshot = function (text) {
  this.target.value = text;
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
Recorder.prototype.play = function (target, speed) {
  var nextFrameAt = 0,
      // All deltas will be applied to this state
      code = [];

  speed = typeof speed !== 'undefined' ? speed : 1;

  this.deltas.forEach(function (delta) {
    // Stagger the delay to create a sequence
    nextFrameAt += (Number(delta.time) / speed);

    // Apply all changes of the current delta
    delta.diffs.forEach(function (diff) {

      if (diff.operation === diff.REMOVE) {
        // Simply empty that element as to avoid
        // messing up the locations by splicing out the element
        code.splice(diff.location, diff.value.length);

      } else if (diff.operation === diff.ADD) {
        code.splice(diff.location, 0, diff.value);
      }
    });

    // Insert it into the target at the right time
    (function (c, t) {

      setTimeout(function () {
        target.setValue ? target.setValue(c) : (target.value = c);
      }, t);

    })(code.join(''), nextFrameAt);
  });
};
