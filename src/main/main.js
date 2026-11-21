'use strict';
const path = require('path');
const { app, ipcMain } = require('electron');
const { createYtDlp } = require('../core/ytdlp')
const { registerIpc } = require('./ipc/ipc.js')
const { createMainWindow } = require('./window/mainWindow.js');

const binDir = app.isPackaged
  ? path.join(process.resourcesPath, 'bin')
  : path.join(__dirname, '../../bin');

app.whenReady().then(() => {
    registerIpc({ ipcMain, ytdlp: createYtDlp({ binDir }) });
    createMainWindow({
        preload: path.join(__dirname, '../preload/preload.js'),
        isDev: !app.isPackaged,
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});