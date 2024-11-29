"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openNewWindow = openNewWindow;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// El path respecto a views
function openNewWindow(htmlPath, envVar) {
    const newWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, "../../preload.js"),
            additionalArguments: [`--envVar=${envVar}`],
        }
    });
    newWindow.loadFile(path_1.default.join(__dirname, "../../../../views/", htmlPath));
    newWindow.on("ready-to-show", () => newWindow.show());
}
