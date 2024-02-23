const { join } = require('path');
const { homedir } = require('os');
const { exec } = require('child_process');
const os = require('os');
const { loadCurrectDB } = require('./getSettings');

function getHomeFolderPath() {
  return new Promise((resolve, reject) => {
    const homeDir = homedir();
    const folderPath = join(homeDir, ".facturacionfacil/");
    resolve(folderPath);
  });
}

function getDBPath() {
  return new Promise(async (resolve, reject) => {
    const homeDir = homedir();
    const folderPath = join(homeDir, ".facturacionfacil/");
    const currentDB = await loadCurrectDB();
    const dbPath = join(folderPath, `${currentDB}.db`);
    resolve(dbPath);
  });
}

function getCSSPath() {
  const homeDir = homedir();
  const folderPath = join(homeDir, ".facturacionfacil/");
  const cssPath = join(folderPath, "style.css");
  return cssPath;
}

function getSettingsPathAsync() {
  return new Promise((resolve, reject) => {
    const homeDir = homedir();
    const folderPath = join(homeDir, ".facturacionfacil/");
    const settingsPath = join(folderPath, ".settings.json");
    resolve(settingsPath);
  });
}

function getImagePathAsync() {
  return new Promise((resolve, reject) => {
    const homeDir = homedir();
    const folderPath = join(homeDir, ".facturacionfacil/");
    const imagePath = join(folderPath, "logo.png");
    resolve(imagePath);
  });
}

function getBrowserBinaryPath() {
  return new Promise(async (resolve, reject) => {
    if (os.platform() === 'win32') {
      const edgePaths = await import('edge-paths');
      const edgePath = edgePaths.getEdgePath();
      resolve(edgePath);
    } else if (os.platform() == 'linux') {
      exec('which google-chrome', (error, stdout) => {
        if (!error && stdout.trim()) {
          const path = stdout.trim();
          if (path) {
            resolve(path);
          }
        } else {
          exec('which brave-browser', (error, stdout) => {
            if (!error && stdout.trim()) {
              resolve(stdout.trim());
            } else {
              reject(new Error('No se encontró el ejecutable de un navegador basado en chromium'));
            }
          });
        }
      });
    }
  });
}

module.exports = { getHomeFolderPath, getDBPath, getCSSPath, getSettingsPathAsync, getImagePathAsync, getBrowserBinaryPath };
