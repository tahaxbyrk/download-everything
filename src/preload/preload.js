'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getInfo: (url) => ipcRenderer.invoke('info:get', url),
  list: () => ipcRenderer.invoke('download:list'),
  start: (opts) => ipcRenderer.invoke('download:start', opts),
  pause: (id) => ipcRenderer.invoke('download:pause', id),
  resume: (id) => ipcRenderer.invoke('download:resume', id),
  cancel: (id) => ipcRenderer.invoke('download:cancel', id),
  remove: (id) => ipcRenderer.invoke('download:remove', id),
  onUpdate: (callback) => {
    ipcRenderer.on('download:update', (_event, job) => callback(job));
  },

  getSettings: () => ipcRenderer.invoke('settings:get'),
  setTheme: (theme) => ipcRenderer.invoke('settings:setTheme', theme),
});