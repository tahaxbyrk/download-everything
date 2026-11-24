'use strict';
const { nativeTheme } = require('electron');
const { settingsStore, THEMES } = require('./settingsStore');

function initTheme() {
  nativeTheme.themeSource = settingsStore.get('theme');
}

function setTheme(theme) {
  if (!THEMES.includes(theme)) throw new Error('Invalid theme.');
  settingsStore.set('theme', theme);
  nativeTheme.themeSource = theme;
  return theme;
}

module.exports = { initTheme, setTheme };