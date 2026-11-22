'use strict';
const { spawn } = require('child_process');

function lastError(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const err = [...lines].reverse().find((l) => l.startsWith('ERROR'));
  return (err ?? lines.at(-1) ?? '').replace(/^ERROR:\s*/, '');
}

function spawnError(e) {
  return e.code === 'ENOENT' ? 'yt-dlp not found. Check the bin/ folder.' : e.message;
}

function killTree(child) {
  if (!child.pid || child.exitCode !== null) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true });
  } else {
    child.kill('SIGTERM');
  }
}

module.exports = { lastError, spawnError, killTree };