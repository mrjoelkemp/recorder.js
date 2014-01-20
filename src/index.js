// Exposes the different types of recorders for instantiation
module.exports = {
  CodeMirrorRecorder  : require('./codemirrorrecorder'),
  AceRecorder         : require('./acerecorder'),
  TextAreaRecorder    : require('./textarearecorder')
};