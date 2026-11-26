'use strict';
const Store = require('electron-store');
const THEMES = ['system', 'light', 'dark'];

const settingsStore = new Store({
  name: 'settings',
  schema: {
    theme: { type: 'string', enum: THEMES, default: 'system' },
    windowState: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        width: { type: 'number', minimum: 400 },
        height: { type: 'number', minimum: 300 },
        isMaximized: { type: 'boolean' },
      },
      default: { width: 900, height: 700, isMaximized: false },
    },
  },
});

module.exports = { settingsStore, THEMES };