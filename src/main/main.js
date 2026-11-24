'use strict';
const path = require('path');
const { app, ipcMain } = require('electron');
const { createYtDlp } = require('../core/ytdlp');
const { DownloadManager } = require('../core/downloads/manager.js');
const { settingsStore } = require('./services/settingsStore.js');
const { createDownloadStore } = require('./services/downloadStore.js');
const { initTheme } = require('./services/theme.js');
const { createMainWindow } = require('./window/mainWindow.js');
const { registerIpc } = require('./ipc/ipc.js');

const binDir = app.isPackaged
  ? path.join(process.resourcesPath, 'bin')
  : path.join(__dirname, '../../bin');

let mainWindow = null;
let manager = null;

function start() {
  initTheme();
  manager = new DownloadManager({
    ytdlp: createYtDlp({ binDir }),
    store: createDownloadStore(),
    outputDir: app.getPath('downloads'),
  });
  registerIpc({ ipcMain, manager, getWindow: () => mainWindow });
  mainWindow = createMainWindow({
    preload: path.join(__dirname, '../preload/preload.js'),
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