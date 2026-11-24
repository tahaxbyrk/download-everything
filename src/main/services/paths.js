'use strict';
const path = require('path');

function resolvePaths(app) {
  const projectRoot = path.join(__dirname, '../../..');
  return {
    binDir: app.isPackaged ? path.join(process.resourcesPath, 'bin') : path.join(projectRoot, 'bin'),
    downloadDir: app.getPath('downloads'),
    preload: path.join(__dirname, '../../preload/preload.js'),
    indexHtml: path.join(__dirname, '../../renderer/index.html'),
  };
}

module.exports = { resolvePaths };