'use strict';

const PREFERRED_PORT = 3000;

function parsePortFile(text) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, '').trim())
    .filter(Boolean);

  let mode = 'auto';
  let sawMode = false;
  let port = null;

  for (const line of lines) {
    const modeMatch = line.match(/^mode\s*=\s*(.+)$/i);
    if (modeMatch) {
      sawMode = true;
      mode = modeMatch[1].trim().toLowerCase();
      continue;
    }
    if (/^\d+$/.test(line)) {
      port = Number(line);
    }
  }

  if (sawMode && mode !== 'auto' && mode !== 'manual') {
    return { error: `unknown mode '${mode}' (use auto or manual)` };
  }
  if (mode === 'manual') {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return { error: 'manual mode needs a port number on its own line' };
    }
    return { mode: 'manual', port };
  }
  return { mode: 'auto', port: null };
}

// No file: today's behavior (PORT env, else 3000, then walk forward).
// mode=auto: same walk. The port line is ignored.
// mode=manual: bind that port once. Do not walk. The file wins over PORT.
function resolveListenPlan(text, envPort) {
  const env = parseInt(envPort, 10);
  const envOk = Number.isInteger(env) && env >= 1 && env <= 65535;

  if (text == null) {
    return { mode: 'auto', port: envOk ? env : PREFERRED_PORT, hunt: true };
  }

  const parsed = parsePortFile(text);
  if (parsed.error) return parsed;
  if (parsed.mode === 'manual') {
    return { mode: 'manual', port: parsed.port, hunt: false };
  }
  return { mode: 'auto', port: envOk ? env : PREFERRED_PORT, hunt: true };
}

module.exports = { parsePortFile, resolveListenPlan, PREFERRED_PORT };
