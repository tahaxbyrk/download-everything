'use strict';

function registerIpc({ ipcMain, manager, getWindow }) {
  ipcMain.handle('info:get', (_e, url) => manager.getInfo(url));
  ipcMain.handle('download:list', () => manager.list());
  ipcMain.handle('download:start', (_e, opts) => manager.start(opts));
  ipcMain.handle('download:pause', (_e, id) => manager.pause(id));
  ipcMain.handle('download:resume', (_e, id) => manager.resume(id));
  ipcMain.handle('download:cancel', (_e, id) => manager.cancel(id));
  ipcMain.handle('download:remove', (_e, id) => manager.remove(id));

  manager.on('update', (job) => {
    const win = getWindow();
    if (win && !win.isDestroyed()) win.webContents.send('download:update', job);
  });
}

module.exports = { registerIpc };