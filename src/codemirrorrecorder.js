var Recorder  = require('./recorder'),
    util      = require('util');

var CodeMirrorRecorder = module.exports = function (codeMirrorTarget) {
  Recorder.call(this, codeMirrorTarget);

  // Do codemirror bindings on input
  codeMirrorTarget.on('change', function () {
    // Note: codemirror already does the delta computation
    // but we default to our own engine for now
    var currentSnapshot = this._getSnapshot();
    this._computeDelta(currentSnapshot);
  }.bind(this));
};

util.inherits(CodeMirrorRecorder, Recorder);

CodeMirrorRecorder.prototype._getSnapshot = function () {
  return this.target.getValue();
};