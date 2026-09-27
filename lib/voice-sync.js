'use strict';

// Speaking is one message per change. Face tracking is a stream. If the
// stream fills the per-socket cap, that one speaking message is gone and the
// overlay stays on the talking clip until the page is reloaded.
function isUnthrottledClientMessage(type) {
  return type === 'speaking' || type === 'state_override' || type === 'emote';
}

function noteVoice(prev, msg) {
  const base = prev || { speaking: false, typing: false };
  if (!msg || msg.type !== 'speaking') return base;
  return { speaking: !!msg.speaking, typing: !!msg.typing };
}

module.exports = { isUnthrottledClientMessage, noteVoice };
