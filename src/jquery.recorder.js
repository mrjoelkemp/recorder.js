;(function($) {
  'use strict';

  ////////////////////
  // Diff
  ////////////////////

  // A diff represents a single operation/transformation within a delta
  function Diff (options) {
    this.value      = options.value     || null;
    this.operation  = options.operation || this.NO_CHANGE;
    this.location   = options.location  || 0;
  }

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

  Diff.prototype.toString = function () {
    // TODO: Compact representation of this diff
    return '';
  };

  function GoogleDiff (googleDiff) {
    // Borrow constructor
    Diff.call(this, {
      operation  : googleDiff[0],
      value      : googleDiff[1],
      location   : googleDiff[2] || 0
    });
  }

  GoogleDiff.prototype = Diff.prototype;


  ////////////////////
  // Delta
  ////////////////////

  // A delta is the collection of diffs that represent a transition
  // between one textual state and another
  // Supported options:
  //    diffs : a list of diff objects, if you want to manually override
  //    time  : the timestamp for this textual change
  function Delta (options) {
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

  ////////////////////
  // Public Methods
  ////////////////////

  $.fn.recorder = function () {
    // Used to capture the final keypress once idle
    this.idleTimerId = 0;
    // Used to compute the delay between deltas
    this.lastTime = 0;
    this.lastSnapshot = getSnapshot.call(this);
    this.deltas = [];

    this.on('keydown change', function () {
      var currentSnapshot = getSnapshot.call(this),
          delta;

      // Cancel an existing idle timer
      if (this.idleTimerId) clearTimeout(this.idleTimerId);

      delta = new Delta({
        time: getTimeSinceLastCall.call(this)
      });

      delta.computeDiffs({
        previousValue:  this.lastSnapshot,
        currentValue:   currentSnapshot
      });

      // If the delta has the string unchanged
      if (delta.isNoChange()) return;

      this.deltas.push(delta);

      this.lastSnapshot = currentSnapshot;

      if (this.changeWasManuallyTriggered) return;

      // Trigger the idle timer
      // If the user hasn't typed in within a threshold,
      // fire a change event to make sure we get the
      // last input
      this.idleTimerId = setTimeout(function () {
        this.trigger('change');
        this.changeWasManuallyTriggered = true;
      }.bind(this), 190);

    }.bind(this));

    return this;
  };

  // Retrieve the deltas
  $.fn.getRecording = function () {
    return {
      deltas: this.deltas
    };
  };

  // Deletes all of the deltas
  $.fn.clearRecording = function () {
    this.deltas = [];
    this.lastTime = 0;
    this.lastSnapshot = '';
  };

  // Play the recording within the supplied target element
  $.fn.playRecording = function ($target) {
    var that = this,
        nextFrameAt = 0,
        // All deltas will be applied to this state
        code = [];

    $target = $target instanceof $ ? $target : $($target);

    $.each(this.deltas, function (idx, delta) {
      var i = 0, l = delta.subdeltas.length,
          sd;

      // Stagger the delay to create a sequence
      nextFrameAt += Number(delta.time);

      // Apply all changes of the current delta
      for (; i < l; i++) {
        sd = delta.subdeltas[i][0];
        console.log(sd)
        // Remove
        if (Number(sd[0]) === Delta.prototype.REMOVE) {
          code[i] = '';

        // Add
        } else if (Number(sd[0]) === Delta.prototype.ADD) {
          code[sd[2]] = sd[1];
        }
      }

      // Insert it into the target at the right time
      (function (c, t) {

        setTimeout(function () {
          $target.val(c);
        }, t);

      })(code.join(''), nextFrameAt);
    }); // end each
  };


  //////////////////
  // Generic Helpers
  //////////////////

  var
      // Returns the time since the previous call of this function
      // TODO: Find a better way to keep relative time without
      //    putting too much responsibility on the diff
      //    but also doesn't conflict with multiple recorders
      getTimeSinceLastCall = function () {
        var now = new Date().getTime(),
            // Time delay since last snapshot
            timeSinceLast = this.lastTime ? now - this.lastTime : 0;

        this.lastTime = now;

        return timeSinceLast;
      },

      getSnapshot = function () {
        // TODO: Support Ace and CodeMirror entities
        // Do they still input text into the hijacked textarea?
        return this.val();
      };

})(window.$);