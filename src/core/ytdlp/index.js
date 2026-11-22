'use strict';
const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const { buildArgs } = require('./args');
const { normalizeInfo } = require('./info');
const { parseProgressLine, isPostProcessLine, matchOutputPath } = require('./outputParser');
const { lastError, spawnError, killTree } = require('./procUtils');

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
        if (code !== 0) return reject(new Error(lastError(err) || `yt-dlp exited with code ${code}.`));
        try { resolve(normalizeInfo(JSON.parse(out))); } catch { reject(new Error('The yt-dlp output could not be read.')); }
      });
    });
  }

  function download(job, { outputDir, onProgress, onPhase, onPath }) {
    const child = spawn(ytdlpPath, buildArgs(job, { outputDir, binDir }), { env, windowsHide: true });
    let errText = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (d) => { errText += d; });

    readline.createInterface({ input: child.stdout }).on('line', (line) => {
      const progress = parseProgressLine(line);
      if (progress) return onProgress(progress);
      if (isPostProcessLine(line)) onPhase('merging');
      const file = matchOutputPath(line);
      if (file) onPath(file);
    });

    const done = new Promise((resolve) => {
      child.on('error', (e) => resolve({ code: -1, error: spawnError(e) }));
      child.on('close', (code) => resolve({ code, error: lastError(errText) }));
    });
    return { done, kill: () => killTree(child) };
  }

  return { getInfo, download };
}

module.exports = { createYtDlp };