const { join } = require('path');
const { homedir } = require('os');
const { exec } = require('child_process');
const os = require('os');

function getDBPath() {
  const homeDir = homedir();
  const folderPath = join(homeDir, ".facturacionfacil/");
  const dbPath = join(folderPath, "main.db");
  return dbPath;
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

function getChromeBinaryPath() {
  return new Promise((resolve, reject) => {
    if (os.platform() === 'win32') {
      // Comando para buscar el ejecutable de Chrome en el registro de Windows
      const command = 'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve';

      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        // Analizar la salida para extraer la ubicación del ejecutable
        const match = stdout.match(/REG_SZ\s*(.*)/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          reject(new Error('No se encontró el ejecutable de Chrome en el registro.'));
        }
      });
    } else if (os.platform() == 'linux') {
      exec('which google-chrome', (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        const path = stdout.trim();
        if (path) {
          resolve(path);
        } else {
          reject(new Error('No se encontró el ejecutable de Chrome usando el comando which.'));
        }
      });
    }
  });
}

module.exports = { getDBPath, getCSSPath, getSettingsPathAsync, getImagePathAsync, getChromeBinaryPath };
