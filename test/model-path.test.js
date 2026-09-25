'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { resolveModelDir } = require('../lib/model-path');

const root = path.resolve('/tmp/overlay-assets');

test('Default stays at the assets root', () => {
  assert.equal(resolveModelDir(root, 'Default'), root);
  assert.equal(resolveModelDir(root, ''), root);
});

test('a normal model name stays inside assets', () => {
  assert.equal(resolveModelDir(root, 'Mira_Vale'), path.join(root, 'Mira_Vale'));
});

test('a traversal query is reduced to a single folder name inside assets', () => {
  assert.equal(resolveModelDir(root, '../../etc'), path.join(root, 'etc'));
  assert.equal(resolveModelDir(root, '..'), root);
  assert.equal(resolveModelDir(root, '/etc/passwd'), path.join(root, 'passwd'));
  const rel = path.relative(root, resolveModelDir(root, '../../etc'));
  assert.equal(rel.startsWith('..'), false);
});
