'use strict';
const { PROGRESS_TEMPLATE } = require('./outputParser');

function formatSelector(mode, height) {
  const cap = height ? `[height<=${height}]` : '';
  if (mode === 'audio') return 'ba/b';
  if (mode === 'video') return `bv*${cap}/b${cap}`;
  return `bv*${cap}+ba/b${cap}`;
}

function buildArgs(job, { outputDir, binDir }) {
  const args = [
    '--newline', '--no-playlist', '--no-warnings', '--windows-filenames',
    '--ffmpeg-location', binDir,
    '-P', outputDir,
    '-o', '%(title).150B [%(id)s].%(ext)s',
    '--progress-template', PROGRESS_TEMPLATE,
    '-f', formatSelector(job.mode, job.height),
  ];
  if (job.mode === 'audio') args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
  if (job.mode === 'both') args.push('--merge-output-format', 'mp4');
  args.push('--', job.url);
  return args;
}

module.exports = { formatSelector, buildArgs };