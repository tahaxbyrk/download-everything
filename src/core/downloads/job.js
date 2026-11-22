'use strict';
const { randomUUID } = require('crypto');

const MODES = ['both', 'audio', 'video'];
const ACTIVE_STATUSES = ['downloading', 'merging'];

const PUBLIC_FIELDS = [
  'id', 'url', 'title', 'mode', 'height', 'ext', 'totalBytes', 'downloadedBytes', 'audioSize',
  'speed', 'eta', 'status', 'error', 'outputPath', 'createdAt',
];
const pub = (job) => Object.fromEntries(PUBLIC_FIELDS.map((k) => [k, job[k]]));

function assertHttpUrl(url) {
  let u;
  try { u = new URL(url); } catch { throw new Error('Invalid link.'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only http/https connections are supported.');
  return u.href;
}

function createJob(opts) {
  if (!MODES.includes(opts.mode)) throw new Error('Invalid mode.');
  const url = assertHttpUrl(opts.url);
  return {
    id: randomUUID(), url,
    title: String(opts.title ?? url).slice(0, 300),
    mode: opts.mode,
    height: opts.mode === 'audio' ? null : Math.max(0, Math.trunc(Number(opts.height)) || 0),
    ext: opts.mode === 'audio' ? 'mp3' : String(opts.ext ?? 'mp4').slice(0, 5),
    totalBytes: Math.max(0, Number(opts.size) || 0),
    audioSize: Math.max(0, Number(opts.audioSize) || 0),
    downloadedBytes: 0, speed: 0, eta: 0,
    status: 'queued', error: null, outputPath: null, createdAt: Date.now(),
  };
}

module.exports = { MODES, ACTIVE_STATUSES, pub, assertHttpUrl, createJob };