'use strict';

function applyProgress(job, rt, p) {
  const finished = p.status === 'finished';
  const expectedStreams = job.mode === 'both' ? 2 : 1;
  if (finished) { rt.baseBytes += p.downloaded; rt.streams++; }
  job.downloadedBytes = rt.baseBytes + (finished ? 0 : p.downloaded);
  if (p.total > 0 || finished) {
    const remaining = Math.max(0, expectedStreams - rt.streams - (finished ? 0 : 1));
    job.totalBytes = rt.baseBytes + (finished ? 0 : p.total) + (remaining > 0 ? job.audioSize || 0 : 0);
  }
  job.totalBytes = Math.max(job.totalBytes, job.downloadedBytes);
  job.speed = p.speed;
  job.eta = p.eta;
}

module.exports = { applyProgress };