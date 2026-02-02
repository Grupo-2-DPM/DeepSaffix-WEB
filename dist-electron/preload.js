"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Exponer APIs seguras al renderer process
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Ejemplo de API
    platform: process.platform
});
