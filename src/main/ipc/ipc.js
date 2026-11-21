'use strict';

function assertHttpUrl(url) {
  let u;
  try { u = new URL(url); } catch { throw new Error('Invalid connection.'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only http/https connections are supported.');
  return u.href;
}

function registerIpc({ ipcMain, ytdlp }) {
  ipcMain.handle('info:get', (_e, url) => ytdlp.getInfo(assertHttpUrl(url)));
}

module.exports = { registerIpc };