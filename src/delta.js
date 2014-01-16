// A delta is the collection of diffs that represent a transition
// between one textual state and another
// Supported options:
//    diffs : a list of diff objects, if you want to manually override
//    time  : the timestamp for this textual change
var Delta = module.exports = function (options) {
  options = options || {};

  this.diffs  = options.diffs || [];
  this.time   = options.time  || null;
};

// Shared instance of the google diff engine
Delta.prototype.gdiff = window.diff_match_patch ? new window.diff_match_patch() : null;

// Returns a string representation of the diffs
Delta.prototype.toString = function () {
  var result = '';

  this.diffs.each(function (diff) {
    result += diff.toString();
  });

  return result;
};

// A delta is non-empty if there is at least one diff representing a change
Delta.prototype.isNoChange = function () {
  var isEmpty = true;

  this.diffs.forEach(function (diff) {
    if (diff && ! diff.isNoChange()) {
      isEmpty = false;
    }
  });

  return isEmpty;
};

// Populates the current delta with the diff from the passed options
// Handles multi-character deletion and insertion
// Supported options:
//    previousValue
//    currentValue
Delta.prototype.computeDiffs = function (options) {
  if (! this.gdiff) throw new Error('google diff engine not found');

  options = options || {
    previousValue : '',
    currentValue  : ''
  };

  var googleDiff = this.gdiff.diff_main(options.previousValue, options.currentValue),
      diff;

  if (! googleDiff.length) return;

  this.diffs = this.diffs.concat(getDiffs(googleDiff));
};

// Private Methods

var
    getDiffs = function (googleDiff) {
      var diffs = [],
          nextPos = 0;

      googleDiff.forEach(function (gdiff) {
        var diff = new GoogleDiff(gdiff),
            unrolled;

        // Set the position for the modification
        if (diff.isNoChange()) {
          // Jump past the unchanged portion
          nextPos += diff.value.length;

        } else {
          // In case the value is multicharacter
          unrolled = unrollDeltas(diff.value, diff.operation, nextPos);
          // Extend the list of subdeltas with the unrolled ones
          diffs = diffs.concat(unrolled);

          nextPos++;
        }
      });

      return diffs;
    },

    // Generate a list of deltas from a multicharacter
    // string based on the passed delta parameters
    unrollDeltas = function (value, operation, startingPos) {
      var deltas = [],
          i, l;

      for (i = 0, l = value.length; i < l; i++) {
        deltas.push(new Diff({
          operation   : operation,
          value       : value[i],
          location    : startingPos
        }));

        startingPos++;
      }

      return deltas;
    };