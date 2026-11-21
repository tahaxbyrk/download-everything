'use strict';
const sizeOf = (f) => f.filesize || f.filesize_approx || 0;

function normalizeInfo(info) {
  const formats = info.formats ?? [];
  const byHeight = new Map();
  for (const f of formats) {
    if (!f.height || !f.vcodec || f.vcodec === 'none') continue;
    byHeight.set(f.height, sizeOf(f) || byHeight.get(f.height) || 0);
  }
  const audioOnly = formats.filter((f) => f.acodec && f.acodec !== 'none' && f.vcodec === 'none');
  const audioSize = audioOnly.length ? sizeOf(audioOnly.at(-1)) || Math.max(...audioOnly.map(sizeOf)) : 0;
  const list = [...byHeight].sort((a, b) => b[0] - a[0]).map(([height, size]) => ({ height, ext: 'mp4', size }));
  return {
    title: info.title ?? 'Untitled',
    site: info.extractor_key ?? info.webpage_url_domain ?? '',
    duration: info.duration ?? 0,
    thumbnail: /^https:/.test(info.thumbnail ?? '') ? info.thumbnail : '',
    formats: list.length ? list : [{ height: 0, ext: 'mp4', size: 0 }],
    audioSize,
  };
}

module.exports = { normalizeInfo };