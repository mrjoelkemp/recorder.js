var CodeMirrorRecorder = require('./codemirrorrecorder');

// Ace's editor has the same event system as CodeMirror
var AceRecorder = module.exports = function (aceTarget) {
  CodeMirrorRecorder.call(this, aceTarget);
};

AceRecorder.prototype = Object.create(CodeMirrorRecorder.prototype);