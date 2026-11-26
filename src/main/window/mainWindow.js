'use strict'
const { BrowserWindow, app, nativeTheme } = require('electron');
const { getInitialState, trackWindowState } = require('./windowState.js');

const createMainWindow = ({ preload, indexHtml, isDev, settingsStore }) => {
    const state = getInitialState(settingsStore);
    const bgColor = nativeTheme.shouldUseDarkColors ? '#161B22' : '#EEF1F4';
    const window = new BrowserWindow({
        width: state.width, height: state.height, x: state.x, y: state.y,
        minWidth: 420, minHeight: 320,
        backgroundColor: bgColor,
        show: false,
        title: 'Download Everything',
        autoHideMenuBar: true,
        webPreferences: {
            preload,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });
    if (state.isMaximized) window.maximize();
    trackWindowState(window, settingsStore);

    if (app.isPackaged) window.setMenu(null);
    window.once('ready-to-show', () => window.show());
    window.loadFile(indexHtml);
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', (event) => event.preventDefault());
    return window;
};

module.exports = { createMainWindow };