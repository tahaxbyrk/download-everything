'use strict';

function registerIpc({ ipcMain, manager, getWindow }) {
  ipcMain.handle('info:get', (_e, url) => manager.getInfo(url));
  ipcMain.handle('download:list', () => manager.list());
  ipcMain.handle('download:start', (_e, opts) => manager.start(opts));

  manager.on('update', (job) => {
    const win = getWindow();
    if (win && !win.isDestroyed()) win.webContents.send('download:update', job);
  });
}

module.exports = { registerIpc };