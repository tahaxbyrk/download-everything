const num = (n, digits = 1) => n.toLocaleString('en-US', { maximumFractionDigits: digits });

export function formatBytes(n) {
  if (!n) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  return `${num(n / 1024 ** i)} ${units[i]}`;
}

export const formatSpeed = (bps) => (bps ? `${formatBytes(bps)}/sec` : '-');

export function formatTime(sec) {
  if (!sec || sec < 0) return '-';
  const s = Math.round(sec), m = Math.floor(s / 60);
  return m ? `${m} min ${s % 60} sec` : `${s} sec`;
}