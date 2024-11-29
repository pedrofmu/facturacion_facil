import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createConfigFolder } from './infra/manage_env/setup_env';
import { setupIPCListeners } from './setup_ipc';

export let mainWindow: BrowserWindow;

async function initializeApp(): Promise<void> {
    await createConfigFolder();
    setupIPCListeners();
    createWindow();
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 900,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        show: false
    });

    mainWindow.maximize();    
    mainWindow.loadFile(path.join(__dirname, "../../views/home/home.html"));
    mainWindow.on("ready-to-show", () => mainWindow.show());
}

app.on("ready", initializeApp);
