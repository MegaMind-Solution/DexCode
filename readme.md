# DexCode - Cross-Platform Desktop & Web Code Editor

<p align="center">
  <img src='www/logo.svg' width='160' alt="DexCode Logo">
</p>

## Overview

**DexCode** is a modern, high-performance cross-platform desktop and web code editor built on a shared TypeScript engine. Converted from Acode Editor into a unified desktop runtime (Electron) and web browser application, DexCode brings full code editing capabilities, plugin ecosystem support, native file operations, multi-window support, themes, and language features to Windows, macOS, Linux, and the Web.

---

## Key Features

- **Cross-Platform Support**: Runs natively on Windows, macOS, Linux, and modern Web browsers.
- **Native File System Access**: Full support for opening files, directories, and workspaces with drag-and-drop support.
- **Rich Plugin Ecosystem**: Fully compatible plugin manager supporting external extensions, plugin storage, and plugin marketplace APIs.
- **Advanced Code Editing**: CodeMirror 6 engine, multi-tab editing, split editors, syntax highlighting for 50+ languages, formatting, and LSP diagnostic support.
- **Desktop System Integration**: Native menubar, native context menus, file associations, keyboard shortcuts, clipboard integration, and native dialogs.
- **Customization & Themes**: Extensive theme builder, custom theme support, and terminal themes.

---

## Quick Start & Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Validate Project
```bash
npm run check
```
Runs comprehensive project validation including package integrity, core source files, TypeScript type checks, and Rspack configuration checks.

### 3. Desktop Development
```bash
npm run dev
```
Launches DexCode in desktop development mode.

### 4. Web Browser Development
```bash
npm run dev:web
```
Launches DexCode in browser development mode with full IndexedDB plugin persistence and local file handling.

### 5. Run Hosted Web Editor Server
```bash
npm run server
```
Runs DexCode as a browser-based code editor with backend server capabilities.

---

## Building Production Releases

To build production bundles for all desktop and web platforms:

```bash
# Build Web Assets & Desktop Bundle
npm run build

# Build All Platforms
npm run build:all

# Target Platform Specific Builds
npm run build:win      # Windows (.exe, .msi, portable)
npm run build:mac      # macOS (.dmg, .pkg, .zip)
npm run build:linux    # Linux (.AppImage, .deb, .rpm, .tar.gz)

# Linux Distribution Shortcuts
npm run build:ubuntu
npm run build:debian
npm run build:mint
npm run build:fedora
npm run build:arch
```

---

## Architecture & Shared Codebase

DexCode follows a modular, layer-separated architecture with maximum code reuse:

- `src/` - Shared core editor engine, components, language modes, themes, and plugin runtime.
- `electron/` - Desktop runtime main process, preload bridge, native IPC handlers, and system menubar.
- `www/` - Compiled static web application distribution asset directory.
- `utils/` - Build pipeline scripts, Rspack configuration helpers, and CLI utilities.

---

## License

MIT License.
