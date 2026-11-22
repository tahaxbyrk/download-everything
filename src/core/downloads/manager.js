'use strict';
const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const { ACTIVE_STATUSES, pub, assertHttpUrl, createJob } = require('./job');
const { applyProgress } = require('./progress');

const EMIT_INTERVAL_MS = 250;

class DownloadManager extends EventEmitter {
  constructor({ ytdlp, outputDir, maxConcurrent = 2 }) {
    super();
    Object.assign(this, { ytdlp, outputDir, maxConcurrent });
    this.jobs = new Map();
    this.runtime = new Map();
  }

  list() { return [...this.jobs.values()].map(pub); }

  getInfo(url) { return this.ytdlp.getInfo(assertHttpUrl(url)); }

  start(opts) {
    const job = createJob(opts);
    this.jobs.set(job.id, job);
    this._emit(job);
    this._schedule();
    return pub(job);
  }

  _schedule() {
    let active = [...this.jobs.values()].filter((j) => ACTIVE_STATUSES.includes(j.status)).length;
    for (const job of this.jobs.values()) {
      if (active >= this.maxConcurrent) break;
      if (job.status === 'queued') { this._run(job); active++; }
    }
  }

  _run(job) {
    const rt = { baseBytes: 0, streams: 0, lastEmit: 0 };
    this.runtime.set(job.id, rt);
    this._setStatus(job, 'downloading', { error: null, speed: 0, eta: 0 });

    rt.handle = this.ytdlp.download(job, {
      outputDir: this.outputDir,
      onProgress: (p) => this._onProgress(job, rt, p),
      onPhase: (status) => { if (job.status === 'downloading') this._setStatus(job, status, { speed: 0, eta: 0 }); },
      onPath: (file) => {
        job.outputPath = file;
        job.ext = path.extname(file).slice(1).toLowerCase() || job.ext;
      },
    });

    rt.handle.done.then(({ code, error }) => {
      if (this.runtime.get(job.id) !== rt) return;
      this.runtime.delete(job.id);
      if (code === 0) {
        const actual = this._fileSize(job.outputPath) || job.downloadedBytes;
        this._setStatus(job, 'completed', { totalBytes: actual, downloadedBytes: actual, speed: 0, eta: 0 });
      } else {
        this._setStatus(job, 'error', { error: error || `yt-dlp exited with code ${code}.`, speed: 0, eta: 0 });
      }
      this._schedule();
    });
  }

  _onProgress(job, rt, p) {
    if (job.status !== 'downloading') return;
    applyProgress(job, rt, p);
    const now = Date.now();
    if (now - rt.lastEmit >= EMIT_INTERVAL_MS || p.status === 'finished') {
      rt.lastEmit = now;
      this._emit(job);
    }
  }

  _fileSize(file) {
    if (!file) return 0;
    try { return fs.statSync(path.isAbsolute(file) ? file : path.join(this.outputDir, file)).size; } catch { return 0; }
  }

  _setStatus(job, status, patch = {}) {
    Object.assign(job, patch, { status });
    this._emit(job);
  }

  _emit(job) { this.emit('update', pub(job)); }
}

module.exports = { DownloadManager };