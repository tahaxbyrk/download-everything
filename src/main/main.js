'use strict';
const { app, ipcMain } = require('electron');
const { createYtDlp } = require('../core/ytdlp');
const { DownloadManager } = require('../core/downloads/manager.js');
const { settingsStore } = require('./services/settingsStore.js');
const { createDownloadStore } = require('./services/downloadStore.js');
const { resolvePaths } = require('./services/paths.js');
const { initTheme } = require('./services/theme.js');
const { createMainWindow } = require('./window/mainWindow.js');
const { registerIpc } = require('./ipc/ipc.js');

let mainWindow = null;
let manager = null;

function start() {
    const paths = resolvePaths(app);
    initTheme();
    manager = new DownloadManager({
    ytdlp: createYtDlp({ binDir: paths.binDir }),
    store: createDownloadStore(),
    outputDir: paths.downloadDir,
  });
  registerIpc({ ipcMain, manager, getWindow: () => mainWindow });
  mainWindow = createMainWindow({
    preload: paths.preload,
    indexHtml: paths.indexHtml,
    isDev: !app.isPackaged,
    settingsStore,
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
  app.whenReady().then(start);
  app.on('before-quit', () => manager?.shutdown());
  app.on('window-all-closed', () => app.quit());
}