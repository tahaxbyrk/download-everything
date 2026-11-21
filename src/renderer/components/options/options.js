import { formatBytes, formatTime } from '../../utils/format.js';

const panel = document.querySelector('#options');
const thumb = document.querySelector('#thumb');
const title = document.querySelector('#vTitle');
const meta = document.querySelector('#vMeta');
const modes = document.querySelector('#modes');
const qualityWrap = document.querySelector('#qualityWrap');
const quality = document.querySelector('#quality');
const estimate = document.querySelector('#estimate');

let currentInfo = null;

const selectedMode = () => modes.querySelector('input:checked').value;
const selectedFormat = () => currentInfo.formats.find((f) => String(f.height) === quality.value);

function estimateSize() {
  const mode = selectedMode();
  if (mode === 'audio') return currentInfo.audioSize;
  const video = selectedFormat().size;
  return mode === 'both' ? video + currentInfo.audioSize : video;
}

function syncOptions() {
  qualityWrap.hidden = selectedMode() === 'audio';
  estimate.textContent = `Estimated size: ${formatBytes(estimateSize())}`;
}

export function showOptions(info) {
  currentInfo = info;
  if (info.thumbnail) thumb.src = info.thumbnail; else thumb.removeAttribute('src');
  title.textContent = info.title;
  meta.textContent = `${info.site}, duration ${formatTime(info.duration)}`;
  quality.replaceChildren(...info.formats.map((f) => {
    const opt = document.createElement('option');
    opt.value = f.height;
    opt.textContent = f.height ? `${f.height}p, approximately ${formatBytes(f.size)}` : 'Best quality';
    return opt;
  }));
  modes.querySelector('input[value=both]').checked = true;
  syncOptions();
  panel.hidden = false;
}

export function hideOptions() {
  panel.hidden = true;
  currentInfo = null;
}

export function initOptions() {
  modes.addEventListener('change', syncOptions);
  quality.addEventListener('change', syncOptions);
}