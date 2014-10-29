var
    editor    = document.querySelector('.editor'),
    CodeMirror = require('../components/amasad-codemirror/codemirror'),
    player    = document.querySelector('.player'),
    recorder;

require('../components/benatkin-codemirror-mode-javascript/index')(CodeMirror);

// editor = CodeMirror.fromTextArea(editor);
// player = CodeMirror.fromTextArea(player);
// editor = new CodeMirror(editor);
// player = new CodeMirror(player);
// editor = new window.ace.edit(editor);
// editor.getSession().setMode('ace/mode/javascript');
// player = new window.ace.edit(player);

recorder = new window.Recorder.TextAreaRecorder(editor);
// recorder = new window.Recorder.CodeMirrorRecorder(editor);
// recorder = new window.Recorder.AceRecorder(editor);

document.querySelector('button.replay-slow').addEventListener('click', function () {
  recorder.play(player, 0.5);
});

document.querySelector('button.replay').addEventListener('click', function () {
  recorder.play(player);
});

document.querySelector('button.replay-fast').addEventListener('click', function () {
  recorder.play(player, 2);
});

document.querySelector('button.clear').addEventListener('click',function () {
  recorder.clear();
  editor.setValue ? editor.setValue('') : (editor.value = '');
  player.setValue ? player.setValue('') : (player.value = '');
});

document.querySelector('button.print').addEventListener('click', function () {
  console.log(recorder.getRecording());
});

