var Recorder  = require('./recorder');

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

// Create a dummy object in front of the Recorder's prototype
// so that we can define _getSnapshot on that dummy and avoid
// the Recorder's definition of _getSnapshot
CodeMirrorRecorder.prototype = Object.create(Recorder.prototype);

CodeMirrorRecorder.prototype._getSnapshot = function () {
  return this.target.getValue();
};