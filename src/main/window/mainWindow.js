'use strict'
const { BrowserWindow } = require('electron');
const path = require('path');

const createMainWindow = () => {
    const window = new BrowserWindow({
        width: 800, height: 600,
        minWidth: 420, minHeight: 320,
        show: false,
        title: 'Download Everything',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    window.once('ready-to-show', () => window.show());
    window.loadFile(path.join(__dirname, '../../renderer/index.html'));
    return window;
};

module.exports = { createMainWindow };