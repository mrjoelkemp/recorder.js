// A diff represents a single operation/transformation within a delta
var Diff = module.exports = function (options) {
  this.value      = options.value     || null;
  this.operation  = options.operation || this.NO_CHANGE;
  this.location   = options.location  || 0;
};

// Operation constants
Diff.prototype.ADD       = 1;
Diff.prototype.REMOVE    = -1;
Diff.prototype.NO_CHANGE = 0;

// Whether or not the current diff represents a textual change
Diff.prototype.isNoChange = function () {
  var isEmptyDiff = typeof this.operation === 'undefined' && typeof this.value === 'undefined',
      hasNoChange = this.operation === this.NO_CHANGE;

  return isEmptyDiff || hasNoChange;
};

// Returns a compact representation of this diff
// Note:  It's possible that the value is the same as the delimiter
//        When parsing, use a regex and not a naive split.
Diff.prototype.toString = function () {
  var delimiter = ':';
  return this.operation + delimiter + this.value + delimiter + this.location;
};