import { BrowserWindow } from "electron";
import path from 'path';

// El path respecto a views
export function openNewWindow(htmlPath: string, envVar?: string): void {
    const newWindow = new BrowserWindow({
        width: 950,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "../../preload.js"),
            additionalArguments: [`--envVar=${envVar}`],
        }
    });

    newWindow.loadFile(path.join(__dirname, "../../../../views/", htmlPath));
    newWindow.on("ready-to-show", () => newWindow.show());
}
