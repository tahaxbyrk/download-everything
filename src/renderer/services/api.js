if (!window.api) {
  throw new Error('window.api not found: preload.js not loaded. Start the application with Electron.');
}

export const backend = window.api;