'use strict';
const Store = require('electron-store');

function createDownloadStore() {
  const store = new Store({ name: 'downloads', defaults: { items: [] } });
  let timer = null;

  return {
    load() {
      const items = store.get('items');
      return Array.isArray(items) ? items : [];
    },
    save(list) {
      clearTimeout(timer);
      timer = setTimeout(() => store.set('items', list), 400);
    },
    saveNow(list) {
      clearTimeout(timer);
      store.set('items', list);
    },
  };
}

module.exports = { createDownloadStore };