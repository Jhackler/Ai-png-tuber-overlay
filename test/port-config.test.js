'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveListenPlan } = require('../lib/port-config');

test('no file keeps the 3000 walk, and PORT only moves the start', () => {
  assert.deepEqual(resolveListenPlan(null, undefined), { mode: 'auto', port: 3000, hunt: true });
  assert.deepEqual(resolveListenPlan(null, '8080'), { mode: 'auto', port: 8080, hunt: true });
});

test('mode=auto ignores the port line and still walks', () => {
  const text = 'mode=auto\n3010\n';
  assert.deepEqual(resolveListenPlan(text, undefined), { mode: 'auto', port: 3000, hunt: true });
  assert.deepEqual(resolveListenPlan(text, '8080'), { mode: 'auto', port: 8080, hunt: true });
});

test('mode=manual binds the listed port and does not walk', () => {
  const text = '# pin the OBS url\nmode=manual\n3010\n';
  assert.deepEqual(resolveListenPlan(text, '8080'), { mode: 'manual', port: 3010, hunt: false });
});

test('manual without a port is an error', () => {
  const plan = resolveListenPlan('mode=manual\n', undefined);
  assert.equal(plan.hunt, undefined);
  assert.match(plan.error, /port number/);
});

test('an unknown mode is an error', () => {
  const plan = resolveListenPlan('mode=banana\n3000\n', undefined);
  assert.match(plan.error, /unknown mode/);
});
