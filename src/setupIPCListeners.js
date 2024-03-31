const { ipcMain, BrowserWindow, dialog } = require('electron');
const { join } = require('path');
const puppeteer = require('puppeteer');
const { getBrowserBinaryPath } = require('./manage_env/getPath');

function setupIPCMainListeners(mainWindow) {
  ipcMain.on('open-new-window', (event, valor) => {
    const nuevaVentana = new BrowserWindow({
      width: 400,
      height: 300,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    nuevaVentana.loadFile(join(__dirname, valor));
  });

  ipcMain.on('create-pdf', async (event, content, path) => {
    try {
      const chromePath = await getBrowserBinaryPath();

      const browser = await puppeteer.launch({ executablePath: chromePath });
      const page = await browser.newPage();

      await page.setContent(content);
      await page.emulateMediaType('screen');
      await page.pdf({
        path: path,
        format: 'A4',
        printBackground: true
      });

      await browser.close();
      event.sender.send('created-pdf', 'guardado'); 
    } catch (e) {
      event.sender.send('created-pdf', e); 
    }
  });

  ipcMain.on('open-file-dialog', (event, fileType, fileName) => {
    let filters;
    switch (fileType) {
      case 'pdf':
        filters = [{ name: 'Archivos PDF', extensions: ['pdf'] }];
        break;
      case 'txt':
        filters = [{ name: 'Archivos de texto', extensions: ['txt'] }];
        break;
      case 'xlsx':
        filters = [{ name: 'Archivos de Excel', extensions: ['xlsx'] }];
        break;
      default:
        filters = [];
    }

    dialog
      .showSaveDialog(mainWindow, {
        title: `Guardar ${fileName}.${fileType.toUpperCase()}`,
        defaultPath: `${fileName}.${fileType}`,
        filters: filters,
      })
      .then((result) => {
        event.sender.send('selected-file', result.filePath);
      })
      .catch((err) => {
        console.log(err);
        event.sender.send('selected-file', null);
      });
  });
}

module.exports = { setupIPCMainListeners };
