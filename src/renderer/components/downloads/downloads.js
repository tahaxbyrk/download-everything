import { backend } from '../../services/api.js';
import { formatBytes, formatSpeed, formatTime } from '../../utils/format.js';
import { ACTIONS, MODE_LABEL, STATUS_LABEL, TOGGLE_LABEL } from './constants.js';

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
  q('.c-status').textContent = STATUS_LABEL[job.status] + (job.status === 'downloading' ? ` %${pct}` : '');
  row.style.setProperty('--p', `${job.status === 'completed' ? 100 : pct}%`);

  q('[data-action=toggle]').textContent = TOGGLE_LABEL[job.status] ?? '';
  row.querySelectorAll('[data-action]').forEach((btn) => {
    btn.hidden = !ACTIONS[job.status].includes(btn.dataset.action);
  });
  refreshCount();
}

export function initDownloads() {
  backend.onUpdate(upsertRow);

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const row = btn.closest('.row');
    const { id } = row.dataset;
    switch (btn.dataset.action) {
      case 'toggle': row.dataset.status === 'downloading' ? backend.pause(id) : backend.resume(id); break;
      case 'cancel': backend.cancel(id); break;
      case 'remove': backend.remove(id); row.remove(); rows.delete(id); refreshCount(); break;
    }
  });

  refreshCount();
}