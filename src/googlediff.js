var Diff = require('./diff');

var GoogleDiff = module.exports = function (googleDiff) {
  // Borrow constructor
  Diff.call(this, {
    operation  : googleDiff[0],
    value      : googleDiff[1],
    location   : googleDiff[2] || 0
  });
};

GoogleDiff.prototype = Diff.prototype;