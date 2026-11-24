'use strict'
const { BrowserWindow } = require('electron');
const { getInitialState, trackWindowState } = require('./windowState.js');

const createMainWindow = ({ preload, indexHtml, isDev, settingsStore }) => {
    const state = getInitialState(settingsStore);
    const window = new BrowserWindow({
        width: state.width, height: state.height, x: state.x, y: state.y,
        minWidth: 420, minHeight: 320,
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

    window.once('ready-to-show', () => window.show());
    window.loadFile(indexHtml);
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', (event) => event.preventDefault());
    return window;
};

module.exports = { createMainWindow };