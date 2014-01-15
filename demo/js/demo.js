var $recorder = $('.editor').recorder();

$('button.replay').click(function () {
  // $recorder.playRecording();
});

$('button.clear').click(function () {
  $recorder.clearRecording();
});

$('button.print').click(function () {
  console.log($recorder.getRecording());
});