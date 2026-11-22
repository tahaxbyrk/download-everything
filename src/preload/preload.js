'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getInfo: (url) => ipcRenderer.invoke('info:get', url),
  list: () => ipcRenderer.invoke('download:list'),
  start: (opts) => ipcRenderer.invoke('download:start', opts),
  onUpdate: (callback) => {
    ipcRenderer.on('download:update', (_event, job) => callback(job));
  },
});