const { contextBridge, ipcRenderer } = require('electron');

/**
 * DexCode Inter-Process Communication (IPC) Bridge
 * Handles communication between Electron main process and renderer process,
 * providing a native API surface for file system access, system dialogs, shell actions,
 * and application lifecycle events.
 */

const bridge = {
  isElectron: true,
  platform: typeof process !== 'undefined' ? process.platform : 'browser',

  // File System Operations
  readFile: (filePath, encoding = 'utf-8') => ipcRenderer.invoke('read-file', filePath, encoding),
  writeFile: (filePath, content, encoding = 'utf-8') => ipcRenderer.invoke('write-file', filePath, content, encoding),
  readDir: (dirPath) => ipcRenderer.invoke('read-dir', dirPath),
  exists: (filePath) => ipcRenderer.invoke('exists', filePath),
  unlink: (filePath) => ipcRenderer.invoke('unlink', filePath),
  mkdir: (dirPath, options) => ipcRenderer.invoke('mkdir', dirPath, options),
  stat: (filePath) => ipcRenderer.invoke('stat', filePath),
  rename: (oldPath, newPath) => ipcRenderer.invoke('rename', oldPath, newPath),

  // Native System Dialog Module
  dialog: {
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  },

  // Top-level aliases for Dialogs
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),

  // Window Controls
  windowControls: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    close: () => ipcRenderer.invoke('window-close'),
  },

  // Recent Documents
  addRecentDocument: (filePath) => ipcRenderer.invoke('add-recent-document', filePath),

  // Shell & Utility Actions
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  showItemInFolder: (fullPath) => ipcRenderer.invoke('show-item-in-folder', fullPath),

  // Event Subscriptions
  onMenuAction: (callback) => {
    const handler = (_, action) => callback(action);
    ipcRenderer.on('menu-action', handler);
    return () => ipcRenderer.removeListener('menu-action', handler);
  },
  onOpenFilePath: (callback) => {
    const handler = (_, filePath) => callback(filePath);
    ipcRenderer.on('open-file-path', handler);
    return () => ipcRenderer.removeListener('open-file-path', handler);
  },
  onOpenFolderPath: (callback) => {
    const handler = (_, folderPath) => callback(folderPath);
    ipcRenderer.on('open-folder-path', handler);
    return () => ipcRenderer.removeListener('open-folder-path', handler);
  },
};

// Expose bridge to window context
try {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('dexcodeBridge', bridge);
    contextBridge.exposeInMainWorld('dexcodeNative', bridge);
  } else if (typeof window !== 'undefined') {
    window.dexcodeBridge = bridge;
    window.dexcodeNative = bridge;
  }
} catch (err) {
  console.warn('DexCode IPC Bridge initialization warning:', err);
}

module.exports = bridge;
