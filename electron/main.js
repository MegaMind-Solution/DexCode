const { app, BrowserWindow, Menu, dialog, ipcMain, shell, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'DexCode',
    icon: path.join(__dirname, '../www/logo.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  const port = process.env.PORT || 3000;

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${port}`);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../www/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupMenu();
}

function setupMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-action', 'new-file'),
        },
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (!mainWindow) return;
            const res = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
            });
            if (!res.canceled && res.filePaths[0]) {
              mainWindow.webContents.send('open-file-path', res.filePaths[0]);
            }
          },
        },
        {
          label: 'Open Folder...',
          accelerator: 'CmdOrCtrl+K CmdOrCtrl+O',
          click: async () => {
            if (!mainWindow) return;
            const res = await dialog.showOpenDialog(mainWindow, {
              properties: ['openDirectory'],
            });
            if (!res.canceled && res.filePaths[0]) {
              mainWindow.webContents.send('open-folder-path', res.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-action', 'save-file'),
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu-action', 'save-file-as'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/MegaMind-Solution/DexCode');
          },
        },
        {
          label: 'About DexCode',
          click: () => mainWindow?.webContents.send('menu-action', 'about'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Native IPC handlers for Desktop file operations
ipcMain.handle('read-file', async (_, filePath, encoding = 'utf-8') => {
  return fs.promises.readFile(filePath, encoding);
});

ipcMain.handle('write-file', async (_, filePath, content, encoding = 'utf-8') => {
  return fs.promises.writeFile(filePath, content, encoding);
});

ipcMain.handle('read-dir', async (_, dirPath) => {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    path: path.join(dirPath, entry.name),
  }));
});

ipcMain.handle('exists', async (_, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle('unlink', async (_, filePath) => {
  return fs.promises.unlink(filePath);
});

ipcMain.handle('mkdir', async (_, dirPath, options) => {
  return fs.promises.mkdir(dirPath, options);
});

ipcMain.handle('stat', async (_, filePath) => {
  const stats = await fs.promises.stat(filePath);
  return {
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    size: stats.size,
    mtime: stats.mtime,
  };
});

ipcMain.handle('rename', async (_, oldPath, newPath) => {
  return fs.promises.rename(oldPath, newPath);
});

ipcMain.handle('show-open-dialog', async (_, options = {}) => {
  if (!mainWindow) return { canceled: true, filePaths: [] };
  return dialog.showOpenDialog(mainWindow, options);
});

ipcMain.handle('show-save-dialog', async (_, options = {}) => {
  if (!mainWindow) return { canceled: true, filePath: '' };
  return dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-message-box', async (_, options = {}) => {
  if (!mainWindow) return { response: 0 };
  return dialog.showMessageBox(mainWindow, options);
});

ipcMain.handle('add-recent-document', async (_, filePath) => {
  if (filePath && typeof app.addRecentDocument === 'function') {
    app.addRecentDocument(filePath);
  }
  return true;
});

// Window controls IPC
ipcMain.handle('window-minimize', async () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', async () => {
  if (!mainWindow) return false;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return false;
  } else {
    mainWindow.maximize();
    return true;
  }
});

ipcMain.handle('window-is-maximized', async () => {
  return mainWindow?.isMaximized() || false;
});

ipcMain.handle('window-close', async () => {
  mainWindow?.close();
});

ipcMain.handle('show-external', async (_, url) => {
  return shell.openExternal(url);
});

ipcMain.handle('show-item-in-folder', async (_, fullPath) => {
  return shell.showItemInFolder(fullPath);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
