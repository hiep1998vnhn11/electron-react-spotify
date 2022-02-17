const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  dialog: {
    showOpenDialog(options) {
      return ipcRenderer.sendSync('electron-dialog-show-open-dialog', options);
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld('file', {
  getFilesAndFolders: (path, recursive = true) =>
    ipcRenderer.invoke('get-files-and-folders', path, recursive),
  getAllSongs: (path) => ipcRenderer.invoke('get-all-songs', path),
});
