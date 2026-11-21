'use strict';
const { spawn } = require('child_process');
const path = require('path');
const { normalizeInfo } = require('./info');
const { lastError, spawnError } = require('./procUtils');

const EXE = process.platform === 'win32' ? '.exe' : '';

function createYtDlp({ binDir }) {
  const ytdlpPath = path.join(binDir, `yt-dlp${EXE}`);
  const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' };

  function getInfo(url) {
    return new Promise((resolve, reject) => {
      const child = spawn(ytdlpPath, ['--dump-single-json', '--no-playlist', '--no-warnings', '--', url], { env, windowsHide: true });
      let out = '', err = '';
      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (d) => { out += d; });
      child.stderr.on('data', (d) => { err += d; });
      child.on('error', (e) => reject(new Error(spawnError(e))));
      child.on('close', (code) => {
        if (code !== 0) return reject(new Error(lastError(err) || `yt-dlp ${code} Output with the code.`));
        try { resolve(normalizeInfo(JSON.parse(out))); } catch { reject(new Error('The yt-dlp output could not be read.')); }
      });
    });
  }

  return { getInfo };
}

module.exports = { createYtDlp };