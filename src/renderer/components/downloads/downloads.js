import { backend } from '../../services/api.js';
import { formatBytes, formatSpeed, formatTime } from '../../utils/format.js';
import { MODE_LABEL, STATUS_LABEL } from './constants.js';

const list = document.querySelector('#list');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
const rowTpl = document.querySelector('#rowTpl');

const rows = new Map();

function refreshCount() {
  count.textContent = rows.size ? `(${rows.size})` : '';
  empty.hidden = rows.size > 0;
}

function upsertRow(job) {
  let row = rows.get(job.id);
  if (!row) {
    row = rowTpl.content.firstElementChild.cloneNode(true);
    row.dataset.id = job.id;
    rows.set(job.id, row);
    list.prepend(row);
  }
  const pct = job.totalBytes ? Math.round((job.downloadedBytes / job.totalBytes) * 100) : 0;
  const q = (sel) => row.querySelector(sel);
  row.dataset.status = job.status;
  q('.name').textContent = job.title;
  q('.name').title = job.title;
  q('.c-ext b').textContent = job.ext.toUpperCase();
  q('.c-ext small').textContent = MODE_LABEL[job.mode];
  q('.c-size').textContent = (job.totalBytes && job.status !== 'completed' ? '~' : '') + formatBytes(job.totalBytes);
  q('.c-speed').textContent = job.status === 'downloading' ? formatSpeed(job.speed) : '-';
  q('.c-eta').textContent = job.status === 'downloading' ? formatTime(job.eta) : '-';
  q('.c-status').textContent = STATUS_LABEL[job.status] + (job.status === 'downloading' ? ` ${pct}%` : '');
  row.style.setProperty('--p', `${job.status === 'completed' ? 100 : pct}%`);

  refreshCount();
}

export function initDownloads() {
  backend.onUpdate(upsertRow);
  refreshCount();
}