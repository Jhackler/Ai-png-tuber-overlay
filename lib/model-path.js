'use strict';

const path = require('path');

function resolveModelDir(assetsDir, modelName) {
  const root = path.resolve(assetsDir);
  const name = modelName || 'Default';
  if (name === 'Default') return root;
  const base = path.basename(String(name));
  if (!base || base === '.' || base === '..') return root;
  const resolved = path.resolve(root, base);
  const rel = path.relative(root, resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return root;
  return resolved;
}

module.exports = { resolveModelDir };
