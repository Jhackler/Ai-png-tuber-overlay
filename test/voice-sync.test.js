'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isUnthrottledClientMessage, noteVoice } = require('../lib/voice-sync');

test('a speaking edge is not dropped with the face-tracking stream', () => {
  assert.equal(isUnthrottledClientMessage('speaking'), true);
  assert.equal(isUnthrottledClientMessage('state_override'), true);
  assert.equal(isUnthrottledClientMessage('emote'), true);
  assert.equal(isUnthrottledClientMessage('webcam_tracking'), false);
  assert.equal(isUnthrottledClientMessage('expression'), false);
});

test('the server remembers the last talking flag for a reconnecting overlay', () => {
  const idle = noteVoice(null, { type: 'speaking', speaking: false, typing: false });
  const talking = noteVoice(idle, { type: 'speaking', speaking: true, typing: false });
  assert.deepEqual(talking, { speaking: true, typing: false });
  assert.deepEqual(noteVoice(talking, { type: 'expression', expression: 'happy' }), talking);
  assert.deepEqual(
    noteVoice(talking, { type: 'speaking', speaking: false, typing: true }),
    { speaking: false, typing: true }
  );
});
