/**
 * Electron Preload Entry Point
 * Loads the DexCode IPC Bridge into the isolated main world context.
 */

require('./bridge.js');
