'use strict';

function lastError(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const err = [...lines].reverse().find((l) => l.startsWith('ERROR'));
  return (err ?? lines.at(-1) ?? '').replace(/^ERROR:\s*/, '');
}

function spawnError(e) {
  return e.code === 'ENOENT' ? 'yt-dlp not found. Check the bin/ folder.' : e.message;
}

module.exports = { lastError, spawnError };