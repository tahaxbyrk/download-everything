'use strict';
const electron = require('electron');

const SAVE_DELAY_MS = 500;
const MIN_VISIBLE_PX = 100;

function isVisible(bounds, displays) {
  return displays.some(({ workArea: a }) => {
    const overlapX = Math.min(bounds.x + bounds.width, a.x + a.width) - Math.max(bounds.x, a.x);
    const overlapY = Math.min(bounds.y + bounds.height, a.y + a.height) - Math.max(bounds.y, a.y);
    return overlapX >= MIN_VISIBLE_PX && overlapY >= MIN_VISIBLE_PX;
  });
}

function getInitialState(store) {
  const saved = store.get('windowState');
  const { width, height, isMaximized = false } = saved;
  const hasPosition = Number.isFinite(saved.x) && Number.isFinite(saved.y);
  if (hasPosition && isVisible({ x: saved.x, y: saved.y, width, height }, electron.screen.getAllDisplays())) {
    return { x: saved.x, y: saved.y, width, height, isMaximized };
  }
  return { width, height, isMaximized };
}

function trackWindowState(win, store) {
  let timer = null;
  const save = () => {
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
    try {
      store.set('windowState', { ...win.getNormalBounds(), isMaximized: win.isMaximized() });
    } catch {}
  };
  const saveLater = () => { clearTimeout(timer); timer = setTimeout(save, SAVE_DELAY_MS); };
  ['resize', 'move', 'maximize', 'unmaximize'].forEach((evt) => win.on(evt, saveLater));
  win.on('close', () => { clearTimeout(timer); save(); });
}

module.exports = { isVisible, getInitialState, trackWindowState };