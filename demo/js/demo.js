var
    editor    = document.querySelector('.editor'),
    CodeMirror = require('../../components/amasad-codemirror/codemirror'),
    player    = document.querySelector('.player'),
    recorder;

require('../../components/benatkin-codemirror-mode-javascript/index')(CodeMirror);

// editor = CodeMirror.fromTextArea(editor);
// player = CodeMirror.fromTextArea(player);
editor = new CodeMirror(editor);
player = new CodeMirror(player);

// recorder = new window.TextAreaRecorder(editor);
recorder = new window.CodeMirrorRecorder(editor);

document.querySelector('button.replay').addEventListener('click', function () {
  recorder.play(player);
});

document.querySelector('button.clear').addEventListener('click',function () {
  recorder.clear();
  editor.setValue ? editor.setValue('') : (editor.value = '');
  player.setValue ? player.setValue('') : (player.value = '');
});

document.querySelector('button.print').addEventListener('click', function () {
  console.log(recorder.getRecording());
});

