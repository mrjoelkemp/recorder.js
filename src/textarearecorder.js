var Recorder  = require('./recorder'),
    util      = require('util');

var TextAreaRecorder = module.exports = function (target) {

  Recorder.call(this, target);

  target.addEventListener('keyup', function () {
    var currentSnapshot = this._getSnapshot();
    this._computeDelta(currentSnapshot);
  }.bind(this));
};

util.inherits(TextAreaRecorder, Recorder);