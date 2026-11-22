'use strict';
const PROGRESS_TEMPLATE =
  'download:[P]%(progress.status)s|%(progress.downloaded_bytes)s|%(progress.total_bytes)s' +
  '|%(progress.total_bytes_estimate)s|%(progress.speed)s|%(progress.eta)s';

const PATH_PATTERNS = [
  /^\[download\] Destination: (.+)$/,
  /^\[download\] (.+) has already been downloaded$/,
  /^\[ExtractAudio\] Destination: (.+)$/,
  /^\[Merger\] Merging formats into "(.+)"$/,
];

const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function parseProgressLine(line) {
  if (!line.startsWith('[P]')) return null;
  const [status, dl, total, est, speed, eta] = line.slice(3).split('|');
  return { status, downloaded: toNum(dl), total: toNum(total) || toNum(est), speed: toNum(speed), eta: toNum(eta) };
}

const isPostProcessLine = (line) => /^\[(Merger|ExtractAudio|VideoConvertor)\]/.test(line);

function matchOutputPath(line) {
  for (const re of PATH_PATTERNS) {
    const m = line.match(re);
    if (m) return m[1];
  }
  return null;
}

module.exports = { PROGRESS_TEMPLATE, parseProgressLine, isPostProcessLine, matchOutputPath };