var Recorder  = require('./recorder');

var TextAreaRecorder = module.exports = function (target) {
  Recorder.call(this, target);

  target.addEventListener('keyup', function () {
    var currentSnapshot = this._getSnapshot();
    this._computeDelta(currentSnapshot);
  }.bind(this));
};

TextAreaRecorder.prototype = Object.create(Recorder.prototype);