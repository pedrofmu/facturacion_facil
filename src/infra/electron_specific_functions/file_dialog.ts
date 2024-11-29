import { BrowserWindow, dialog } from 'electron'; 
import path from 'path';
import { getHomeFolderPath } from '../manage_env/get_paths';

/**
 * Importante devuelve string, sin embargo hay un error con electron y async por lo que hay que 
 * guardarla en un let x:any y despues acceder a la propiedad filePath  
 *
 * @returns {Promise<string>} esto realmente guardalo en any y accede a filePath.
 */
export function openFileDialog(fileName: string, fileType: string, mainWindow: BrowserWindow): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let filters: Electron.FileFilter[];
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

        const homeFolderPath: string = await getHomeFolderPath();
        const defautlSavePath: string = path.join(homeFolderPath, `${fileName}.${fileType}`);

        try {
            // Mostrar diálogo para guardar
            let jsonSaveDialog = dialog.showSaveDialog(mainWindow, {
                title: `Guardar ${fileName}.${fileType.toUpperCase()}`,
                defaultPath: defautlSavePath,
                filters: filters,
            });

            resolve(jsonSaveDialog);
        }catch{
            reject("Selecciona un path valido");
        }
    });
}


