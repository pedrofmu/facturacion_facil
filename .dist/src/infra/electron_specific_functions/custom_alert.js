"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myAlert = myAlert;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
function myAlert(message) {
    const alertWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    alertWindow.loadFile(path_1.default.join(__dirname, '../../../../views/my_alert/my_alert.html'));
    // Enviar el mensaje al proceso de renderizado
    alertWindow.webContents.on('did-finish-load', () => {
        alertWindow.webContents.send('show-alert', message);
    });
}
