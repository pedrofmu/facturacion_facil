"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getHomeFolderPath = getHomeFolderPath;
exports.getDBPath = getDBPath;
exports.getCSSPath = getCSSPath;
exports.getSettingsPathAsync = getSettingsPathAsync;
exports.getImagePathAsync = getImagePathAsync;
exports.getBrowserBinaryPath = getBrowserBinaryPath;
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const child_process_1 = require("child_process");
const os_2 = __importDefault(require("os"));
const adm_settings_1 = require("./adm_settings");
const util_1 = require("util");
function getHomeFolderPath() {
    return new Promise((resolve) => {
        const homeDir = (0, os_1.homedir)();
        const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
        resolve(folderPath);
    });
}
function getDBPath(name = 'current') {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const homeDir = (0, os_1.homedir)();
        const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
        let dbPath = '';
        if (name === 'current') {
            const currentDB = yield (0, adm_settings_1.getCurrentDB)();
            dbPath = path_1.default.join(folderPath, `${currentDB}.db`);
        }
        else {
            dbPath = path_1.default.join(folderPath, `${name}.db`);
        }
        resolve(dbPath);
    }));
}
function getCSSPath() {
    const homeDir = (0, os_1.homedir)();
    const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
    const cssPath = path_1.default.join(folderPath, "style.css");
    return cssPath;
}
function getSettingsPathAsync() {
    return new Promise((resolve) => {
        const homeDir = (0, os_1.homedir)();
        const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
        const settingsPath = path_1.default.join(folderPath, ".settings.json");
        resolve(settingsPath);
    });
}
function getImagePathAsync() {
    return new Promise((resolve) => {
        const homeDir = (0, os_1.homedir)();
        const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
        const imagePath = path_1.default.join(folderPath, "logo.png");
        resolve(imagePath);
    });
}
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Función auxiliar para buscar navegadores en Linux y macOS
function findBrowser(possiblePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const browser of possiblePaths) {
            try {
                // Usamos 'command -v' para mayor compatibilidad con bash
                const { stdout } = yield execAsync(`command -v ${browser}`);
                const path = stdout.trim();
                if (path) {
                    return path;
                }
            }
            catch (error) {
                // Continúa con el siguiente navegador si el actual no está disponible
            }
        }
        throw new Error('No se encontró el ejecutable de un navegador basado en Chromium');
    });
}
// Función principal para obtener la ruta del navegador
function getBrowserBinaryPath() {
    return __awaiter(this, void 0, void 0, function* () {
        const platform = os_2.default.platform();
        if (platform === 'win32') {
            // En Windows, se usa el módulo 'edge-paths' para obtener Microsoft Edge
            const edgePaths = yield Promise.resolve().then(() => __importStar(require('edge-paths')));
            const edgePath = edgePaths.getEdgePath();
            if (edgePath) {
                return edgePath;
            }
            throw new Error('No se encontró Microsoft Edge en Windows');
        }
        else if (platform === 'linux') {
            // Posibles rutas de navegadores en Linux
            const possibleBrowsers = ['google-chrome', 'brave-browser', 'chromium-browser', 'chromium'];
            return findBrowser(possibleBrowsers);
        }
        else if (platform === 'darwin') {
            // Posibles rutas de navegadores en macOS 
            const possibleBrowsers = [
                '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome',
                '/Applications/Brave\\ Browser.app/Contents/MacOS/Brave\\ Browser',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ];
            return findBrowser(possibleBrowsers);
        }
        throw new Error('Plataforma no soportada');
    });
}
