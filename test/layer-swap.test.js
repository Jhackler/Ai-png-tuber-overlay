'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createLayerSwap } = require('../public/lib/layer-swap');

test('a second hide during the frame wait is ignored', () => {
  const gate = createLayerSwap();
  const idle = gate.beginSwap();
  assert.equal(gate.arm(), idle);
  assert.equal(gate.arm(), 0);
});

test('a stale hide must not hide the layer we have since switched to', () => {
  const gate = createLayerSwap();
  const idle = gate.beginSwap();
  gate.arm();
  gate.beginSwap();
  gate.arm();
  assert.equal(gate.shouldApply(idle, 'neutral_speaking', 'neutral_idle'), false);
  assert.equal(gate.shouldApply(idle, 'neutral_idle', 'neutral_idle'), false);
});

test('the current hide applies only for the state it was armed for', () => {
  const gate = createLayerSwap();
  const idle = gate.beginSwap();
  gate.arm();
  assert.equal(gate.shouldApply(idle, 'neutral_idle', 'neutral_idle'), true);
  assert.equal(gate.shouldApply(idle, 'neutral_speaking', 'neutral_idle'), false);
});

test('a cancelled hide retries once when the landed state never armed one', () => {
  const gate = createLayerSwap();
  const idle = gate.beginSwap();
  gate.arm();
  gate.beginSwap();
  assert.equal(gate.shouldRetry(idle), true);
  assert.ok(gate.arm());
  assert.equal(gate.shouldRetry(idle), false);
});

test('a cancelled hide does not cut short a hide the landed state already armed', () => {
  const gate = createLayerSwap();
  const idle = gate.beginSwap();
  gate.arm();
  const speaking = gate.beginSwap();
  assert.equal(gate.arm(), speaking);
  assert.equal(gate.shouldRetry(idle), false);
});
