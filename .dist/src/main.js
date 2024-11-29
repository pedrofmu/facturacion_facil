"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWindow = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const setup_env_1 = require("./infra/manage_env/setup_env");
const setup_ipc_1 = require("./setup_ipc");
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, setup_env_1.createConfigFolder)();
        (0, setup_ipc_1.setupIPCListeners)();
        createWindow();
    });
}
function createWindow() {
    exports.mainWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 900,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, "preload.js"),
        },
        show: false
    });
    exports.mainWindow.maximize();
    exports.mainWindow.loadFile(path_1.default.join(__dirname, "../../views/home/home.html"));
    exports.mainWindow.on("ready-to-show", () => exports.mainWindow.show());
}
electron_1.app.on("ready", initializeApp);
