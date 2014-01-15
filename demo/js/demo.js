var $recorder = $('textarea.editor').recorder();

$('button.replay').click(function () {
  $recorder.playRecording($('textarea.player'));
});

$('button.clear').click(function () {
  $recorder.clearRecording();
});

$('button.print').click(function () {
  console.log($recorder.getRecording());
});