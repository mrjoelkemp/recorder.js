/*jshint camelcase: false*/

// A delta is the collection of diffs that represent a transition
var diff_match_patch = require('diff_match_patch'),
    GoogleDiff = require('./googlediff'),
    Diff = require('./diff');

// between one textual state and another
// Supported options:
//    diffs : a list of diff objects, if you want to manually override
//    time  : the timestamp for this textual change
var Delta = module.exports = function (options) {
  options = options || {};

  this.diffs  = options.diffs || [];
  this.time   = options.time  || null;
};

// Shared instance of the diff engine
Delta.prototype.diffEngine = new diff_match_patch();

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
  options = options || {
    previousValue : '',
    currentValue  : ''
  };

  var googleDiff = this.diffEngine.diff_main(options.previousValue, options.currentValue);

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

          // For multi-char deletion, don't unroll into separate diffs
          if (diff.operation === diff.REMOVE) {
            diff.location = nextPos;
            diffs.push(diff);
            nextPos += diff.value.length;

          } else {
            // In case the value is multicharacter
            unrolled = unrollDeltas(diff.value, diff.operation, nextPos);
            // Extend the list of subdeltas with the unrolled ones
            diffs = diffs.concat(unrolled);
            nextPos++;
          }

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