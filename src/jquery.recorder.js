;(function($) {
  'use strict';

  if (! window.diff_match_patch) throw new Error('diff engine not found');

  var gdiff = new window.diff_match_patch();

  ////////////////////
  // Public Methods
  ////////////////////

  $.fn.recorder = function () {
    var $this = $(this);

    this.idleTimerId = 0;
    this.lastSnapshot = getSnapshot(this);
    this.deltas = [];

    $this.on('keydown change', computeDelta);
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
  };


  //////////////////
  // Generic Helpers
  //////////////////

  var
      lastTime = 0,
      // Returns the time since the
      // previous call of this function
      getTimeSinceLastCall = function () {
        var now = new Date().getTime(),
            // Time delay since last snapshot
            timeSinceLast = lastTime ? now - lastTime : 0;

        lastTime = now;

        return timeSinceLast;
      },

      // Precond: target (dom element): the textarea input source
      getSnapshot = function (target) {
        // TODO: Support Ace and CodeMirror entities
        // Do they still input text into the hijacked textarea?
        return target.value;
      };


  //////////////////
  // Delta Helpers
  //////////////////

  var
      // Google Diff Operation Constants
      ADD       = 1,
      REMOVE    = -1,
      NO_CHANGE = 0,

      computeDelta = function () {
        var currentSnapshot = getSnapshot(),
            delta;

        // Cancel an existing idle timer
        if (this.idleTimerId) clearTimeout(this.idleTimerId);

        delta = gdiff.diff_main(lastSnapshot, currentSnapshot);

        // If the delta has the string unchanged
        if (! isTextChange(delta)) return;

        delta = postProcessDelta(delta);

        that.deltas.push(delta);

        lastSnapshot = currentSnapshot;

        // Trigger the idle timer
        // If the user hasn't typed in within a threshold,
        // fire a change event to make sure we get the
        // last input
        idleTimerId = setTimeout(function () {
          $target.trigger('change');
        }, 190);
      },

      isTextChange = function (delta) {
        return ! delta.length ||
            // The keystroke didn't produce a change, then do nothing
            (delta.length === 1 && delta[0][0] === NO_CHANGE)
      },

      // Prepares the generated delta for storage
      // stripping unwanted info and computing needed fields
      // Precond: delta is the (array) result of diff_main
      postProcessDelta = function (delta) {
        var
            newDelta = {
              // relative timestamp
              time: getTimeSinceLastCall(),
              subdeltas: []
            },
            nextPos = 0,
            i = 0, l = delta.length,
            subdelta, operation, value,
            unrolled;

        for (; i < l; i++) {
          subdelta  = delta[i];
          operation = subdelta[0];
          value     = subdelta[1];

          // Set the position for the modification
          if (operation === NO_CHANGE) {
            // Jump past the unchanged portion
            nextPos += value.length;
          } else {
            subdelta[2] = nextPos;
            nextPos++;

            // In case the value is multicharacter
            unrolled = unrollDeltas(value, operation, nextPos);
            // Extend the list of subdeltas with the unrolled ones
            newDelta.subdeltas.push(unrolled);
          }
        }

        return newDelta;
      },

      // Generate a list of multiple deltas from a multicharacter
      // string based on the passed delta parameters
      unrollDeltas = function (value, operation, startingPos) {
        var deltas = [],
            i, l;

        for (i = 0, l = value.length; i < l; i++) {
          deltas.push([operation, value[i], startingPos]);
          startingPos++;
        }

        return deltas;
      };

})(window.$);