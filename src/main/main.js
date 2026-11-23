'use strict';
const path = require('path');
const { app, ipcMain, BrowserWindow } = require('electron');
const { createYtDlp } = require('../core/ytdlp')
const { DownloadManager } = require('../core/downloads/manager.js');
const { createDownloadStore } = require('./services/downloadStore.js');
const { registerIpc } = require('./ipc/ipc.js')
const { createMainWindow } = require('./window/mainWindow.js');

const binDir = app.isPackaged
  ? path.join(process.resourcesPath, 'bin')
  : path.join(__dirname, '../../bin');

let mainWindow = null;
let manager = null;

const openMainWindow = () => {
    mainWindow = createMainWindow({
        preload: path.join(__dirname, '../preload/preload.js'),
        isDev: !app.isPackaged,
    });
    mainWindow.on('closed', () => { mainWindow = null; });
};

app.whenReady().then(() => {
    manager = new DownloadManager({
        ytdlp: createYtDlp({ binDir }),
        store: createDownloadStore(),
        outputDir: app.getPath('downloads'),
    });
    registerIpc({ ipcMain, manager, getWindow: () => mainWindow });
    openMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            openMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => manager?.shutdown());