import path from 'path';
import { homedir } from 'os';
import { exec } from 'child_process';
import os from 'os';
import { getCurrentDB } from './adm_settings';
import { promisify } from 'util';

export function getHomeFolderPath(): Promise<string> {
    return new Promise((resolve) => {
        const homeDir = homedir();
        const folderPath = path.join(homeDir, ".facturacionfacil/");
        resolve(folderPath);
    });
}

export function getDBPath(name: string = 'current'): Promise<string> {
    return new Promise(async (resolve) => {
        const homeDir = homedir();
        const folderPath = path.join(homeDir, ".facturacionfacil/");
        let dbPath: string = '';

        if (name === 'current') {
            const currentDB = await getCurrentDB();
            dbPath = path.join(folderPath, `${currentDB}.db`);
        } else {
            dbPath = path.join(folderPath, `${name}.db`);
        }

        resolve(dbPath);
    });
}

export function getCSSPath(): string {
    const homeDir = homedir();
    const folderPath = path.join(homeDir, ".facturacionfacil/");
    const cssPath = path.join(folderPath, "style.css");
    return cssPath;
}

export function getSettingsPathAsync(): Promise<string> {
    return new Promise((resolve) => {
        const homeDir = homedir();
        const folderPath = path.join(homeDir, ".facturacionfacil/");
        const settingsPath = path.join(folderPath, ".settings.json");
        resolve(settingsPath);
    });
}

export function getImagePathAsync(): Promise<string> {
    return new Promise((resolve) => {
        const homeDir = homedir();
        const folderPath = path.join(homeDir, ".facturacionfacil/");
        const imagePath = path.join(folderPath, "logo.png");
        resolve(imagePath);
    });
}

const execAsync = promisify(exec);

// Función auxiliar para buscar navegadores en Linux y macOS
async function findBrowser(possiblePaths: string[]): Promise<string> {
    for (const browser of possiblePaths) {
        try {
            // Usamos 'command -v' para mayor compatibilidad con bash
            const { stdout } = await execAsync(`command -v ${browser}`);
            const path = stdout.trim();
            if (path) {
                return path;
            }
        } catch (error) {
            // Continúa con el siguiente navegador si el actual no está disponible
        }
    }
    throw new Error('No se encontró el ejecutable de un navegador basado en Chromium');
}

// Función principal para obtener la ruta del navegador
export async function getBrowserBinaryPath(): Promise<string> {
    const platform = os.platform();

    if (platform === 'win32') {
        // En Windows, se usa el módulo 'edge-paths' para obtener Microsoft Edge
        const edgePaths = await import('edge-paths');
        const edgePath = edgePaths.getEdgePath();
        if (edgePath) {
            return edgePath;
        }
        throw new Error('No se encontró Microsoft Edge en Windows');
    } else if (platform === 'linux') {
        // Posibles rutas de navegadores en Linux
        const possibleBrowsers = ['google-chrome', 'brave-browser', 'chromium-browser', 'chromium'];
        return findBrowser(possibleBrowsers);
    } else if (platform === 'darwin') {
        // Posibles rutas de navegadores en macOS 
        const possibleBrowsers = [
            '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome',
            '/Applications/Brave\\ Browser.app/Contents/MacOS/Brave\\ Browser',
            '/Applications/Chromium.app/Contents/MacOS/Chromium'
        ];
        return findBrowser(possibleBrowsers);
    }

    throw new Error('Plataforma no soportada');
}

