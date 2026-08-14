/**
 * DexCode Electron IPC Channel Interface
 * Establishes secure channels for communication between renderer and main process
 * for file system operations like readFile, writeFile, readdir, and system dialogs.
 */

export interface DirEntry {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  path: string;
}

export interface FileStat {
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtime: Date | string;
}

export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory'>;
}

export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}

export interface DialogResult {
  canceled: boolean;
  filePaths?: string[];
  filePath?: string;
}

export interface DexCodeBridge {
  isElectron: boolean;
  platform: string;
  readFile(filePath: string, encoding?: string): Promise<string>;
  writeFile(filePath: string, content: string, encoding?: string): Promise<void>;
  readDir(dirPath: string): Promise<DirEntry[]>;
  exists(filePath: string): Promise<boolean>;
  unlink(filePath: string): Promise<void>;
  mkdir(dirPath: string, options?: any): Promise<void>;
  stat(filePath: string): Promise<FileStat>;
  rename(oldPath: string, newPath: string): Promise<void>;
  dialog: {
    showOpenDialog(options?: OpenDialogOptions): Promise<DialogResult>;
    showSaveDialog(options?: SaveDialogOptions): Promise<DialogResult>;
    showMessageBox(options?: any): Promise<{ response: number }>;
  };
  showOpenDialog(options?: OpenDialogOptions): Promise<DialogResult>;
  showSaveDialog(options?: SaveDialogOptions): Promise<DialogResult>;
  showMessageBox(options?: any): Promise<{ response: number }>;
  windowControls: {
    minimize(): Promise<void>;
    maximize(): Promise<boolean>;
    isMaximized(): Promise<boolean>;
    close(): Promise<void>;
  };
  addRecentDocument(filePath: string): Promise<boolean>;
  openExternal(url: string): Promise<void>;
  showItemInFolder(fullPath: string): Promise<void>;
  onMenuAction(callback: (action: string) => void): () => void;
  onOpenFilePath(callback: (filePath: string) => void): () => void;
  onOpenFolderPath(callback: (folderPath: string) => void): () => void;
}

declare global {
  interface Window {
    dexcodeBridge?: DexCodeBridge;
    dexcodeNative?: DexCodeBridge;
    electronIPC?: typeof ElectronIPC;
  }
}

export const ElectronIPC = {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window.dexcodeBridge || window.dexcodeNative);
  },

  getBridge(): DexCodeBridge | null {
    if (typeof window === 'undefined') return null;
    return window.dexcodeBridge || window.dexcodeNative || null;
  },

  async readFile(filePath: string, encoding = 'utf-8'): Promise<string> {
    const bridge = this.getBridge();
    if (bridge) {
      return bridge.readFile(filePath, encoding);
    }
    throw new Error('Electron IPC bridge is not available');
  },

  async writeFile(filePath: string, content: string, encoding = 'utf-8'): Promise<void> {
    const bridge = this.getBridge();
    if (bridge) {
      return bridge.writeFile(filePath, content, encoding);
    }
    throw new Error('Electron IPC bridge is not available');
  },

  async readdir(dirPath: string): Promise<DirEntry[]> {
    const bridge = this.getBridge();
    if (bridge) {
      return bridge.readDir(dirPath);
    }
    throw new Error('Electron IPC bridge is not available');
  },

  async exists(filePath: string): Promise<boolean> {
    const bridge = this.getBridge();
    if (bridge) {
      return bridge.exists(filePath);
    }
    return false;
  },

  async showOpenDialog(options?: OpenDialogOptions): Promise<DialogResult> {
    const bridge = this.getBridge();
    if (bridge) {
      if (bridge.dialog && bridge.dialog.showOpenDialog) {
        return bridge.dialog.showOpenDialog(options);
      }
      return bridge.showOpenDialog(options);
    }
    return { canceled: true, filePaths: [] };
  },

  async showSaveDialog(options?: SaveDialogOptions): Promise<DialogResult> {
    const bridge = this.getBridge();
    if (bridge) {
      if (bridge.dialog && bridge.dialog.showSaveDialog) {
        return bridge.dialog.showSaveDialog(options);
      }
      return bridge.showSaveDialog(options);
    }
    return { canceled: true, filePath: '' };
  },

  async addRecentDocument(filePath: string): Promise<void> {
    const bridge = this.getBridge();
    if (bridge && bridge.addRecentDocument) {
      await bridge.addRecentDocument(filePath);
    }
  },

  windowControls: {
    async minimize(): Promise<void> {
      const bridge = ElectronIPC.getBridge();
      if (bridge && bridge.windowControls) {
        await bridge.windowControls.minimize();
      }
    },
    async maximize(): Promise<boolean> {
      const bridge = ElectronIPC.getBridge();
      if (bridge && bridge.windowControls) {
        return bridge.windowControls.maximize();
      }
      return false;
    },
    async close(): Promise<void> {
      const bridge = ElectronIPC.getBridge();
      if (bridge && bridge.windowControls) {
        await bridge.windowControls.close();
      }
    },
  },
};

if (typeof window !== 'undefined') {
  window.electronIPC = ElectronIPC;
}

export default ElectronIPC;
