const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { createConfigFolder } = require('./manage_env/initialice_env');
const { setupIPCMainListeners } = require('./setupIPCListeners');

let mainWindow;

function startRender() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

  const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.maximize();    
    mainWindow.loadFile(path.join(__dirname, '/views/home/home.html'));
  };

  app.on('ready', () => {
    createWindow();
    setupIPCMainListeners(mainWindow);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

createConfigFolder();
startRender();
