var Delta = require('./delta');

/**
 * Base class for recorders
 *
 * @param  {DOM} target - The dom node whose input to record
 * @module  Recorder
 * @constructor
 * @return {Recorder}
 */
var Recorder = module.exports = function (target) {
  this.target = target;

  // Used to compute the delay between deltas
  this.lastTime = 0;
  this.deltas = [];

  this.lastSnapshot = this._getSnapshot();

  return this;
};

/**
 * Uses the diffing engine to create a delta between the previous and current snapshots
 * @private
 * @param  {String} currentSnapshot
 */
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

/**
 * Returns the time since the previous call of this function
 * @private
 * @return {Number}
 */
Recorder.prototype._getTimeSinceLastCall = function () {
  var now = new Date().getTime(),
      // Time delay since last snapshot
      timeSinceLast = this.lastTime ? now - this.lastTime : 0;

  this.lastTime = now;

  return timeSinceLast;
};

/**
 * Returns the target's value
 * @private
 * @return {String}
 */
Recorder.prototype._getSnapshot = function () {
  return this.target.value;
};

/**
 * Sets the current state of the target
 * @private
 * @param {String} text
 */
Recorder.prototype._setSnapshot = function (text) {
  this.target.value = text;
};

/**
 * Retrieve the deltas
 * @return {Object} options
 * @return {Object[]} options.deltas
 */
Recorder.prototype.getRecording = function () {
  return {
    deltas: this.deltas
  };
};

/**
 * Deletes all of the deltas
 */
Recorder.prototype.clear = function () {
  this.deltas = [];
  this.lastTime = 0;
  this.lastSnapshot = '';
};

/**
 * Play the recording within the supplied target element
 * @param  {DOM} target
 * @param  {Number} [speed=1] - The speed of playback. A val of 2 plays twice as fast
 */
Recorder.prototype.play = function (target, speed) {
  var nextFrameAt = 0,
      // All deltas will be applied to this state
      code = [];

  speed = speed || 1;

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
        if (target.setValue) {
          target.setValue(c);

        } else {
          target.value = c;
        }
      }, t);

    })(code.join(''), nextFrameAt);
  });
};
