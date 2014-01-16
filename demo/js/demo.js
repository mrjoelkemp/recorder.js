var $recorder = $('textarea.editor').recorder(),
    $player   = $('textarea.player');

$('button.replay').click(function () {
  $recorder.playRecording($player);
});

$('button.clear').click(function () {
  $recorder.clearRecording();
  $recorder.val(' ');
  $player.val(' ');
});

$('button.print').click(function () {
  console.log($recorder.getRecording());
});