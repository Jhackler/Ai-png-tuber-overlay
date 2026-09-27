'use strict';

// Frame-ready hides are easy to cancel: the state moves during the wait, the
// callback bails, and a later update sees "already idle" and never finishes.
// This gate keeps one hide armed per swap and lets a cancelled hide re-arm
// once for the state we actually landed on.
function createLayerSwap() {
  let swapId = 0;
  let armedFor = 0;

  return {
    beginSwap() {
      swapId += 1;
      armedFor = 0;
      return swapId;
    },
    arm() {
      if (armedFor === swapId) return 0;
      armedFor = swapId;
      return swapId;
    },
    shouldApply(id, currentKey, targetKey) {
      return id === swapId && currentKey === targetKey;
    },
    shouldRetry(id) {
      if (id === swapId) return false;
      if (armedFor === swapId) return false;
      return true;
    },
  };
}

// Same-key updates must still finish a hide once the new clip has a frame,
// or once the blank-flash wait is over. Otherwise a playing WebM stays on top.
function shouldForceSettle(state) {
  if (!state.otherActive && !state.strayPlaying) return false;
  return state.targetReady || state.waitedMs >= 150;
}

const api = { createLayerSwap, shouldForceSettle };
if (typeof module === 'object' && module.exports) {
  module.exports = api;
} else {
  globalThis.LayerSwap = api;
}
