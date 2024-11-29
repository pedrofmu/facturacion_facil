import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export function myAlert(message: string): void {
    const alertWindow = new BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true,  
            contextIsolation: false,  
        }
    });

    alertWindow.loadFile(path.join(__dirname, '../../../../views/my_alert/my_alert.html')); 

    // Enviar el mensaje al proceso de renderizado
    alertWindow.webContents.on('did-finish-load', () => {
        alertWindow.webContents.send('show-alert', message);
    });
}
