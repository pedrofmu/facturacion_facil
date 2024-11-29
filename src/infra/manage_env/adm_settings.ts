import { readFile } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { homedir } from 'os';

// obtener el path a los settings con una promesa
export function getSettingsPathAsync(): Promise<string> {
    return new Promise((resolve) => {
        const homeDir: string = homedir();
        const folderPath: string = path.join(homeDir, ".facturacionfacil/");
        const settingsPath: string = path.join(folderPath, ".settings.json");
        resolve(settingsPath);
    });
}

// obtener un array de los db posibles 
export async function loadPossibleDB(): Promise<string[]> {
    const settingPath: string = await getSettingsPathAsync();

    return new Promise(async (resolve, reject) => {
        readFile(settingPath, "utf8", (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            const settings= JSON.parse(data);

            const { current_database, possible_db } = settings;
            const currentIndex = possible_db.indexOf(current_database);
            const reorderedDBs = [
                possible_db[currentIndex],
                ...possible_db.slice(0, currentIndex),
                ...possible_db.slice(currentIndex + 1)
            ];

            resolve(reorderedDBs);
        });
    });
}

export async function getCurrentDB(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const settingPath: string = await getSettingsPathAsync();
        readFile(settingPath, "utf8", (error, data) => {
            if (error) {
                reject(error);
            }

            resolve(JSON.parse(data).current_database);
        });
    });
}

export function changeCurrentDB(database: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const settingPath: string = await getSettingsPathAsync();
            const data: string = await fs.readFile(settingPath, "utf8");
            const settings = JSON.parse(data);

            // Actualiza el valor de current_database en el objeto settings
            settings.current_database = database;

            // Convierte el objeto settings actualizado de nuevo a JSON
            const updatedData = JSON.stringify(settings, null, 2);

            // Escribe los datos actualizados de vuelta al archivo
            await fs.writeFile(settingPath, updatedData, "utf8");

            // Indica que la operación se ha completado exitosamente
            resolve("Datos actualizados correctamente en el archivo .json");
        } catch (error) {
            // Rechaza la promesa con el mensaje de error
            reject("Error cambiando la base de datos en uso");
        }
    });
}

// añadir nueva entrada de base de datos
export async function addPossibleDB(newDB: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const settingPath: string = await getSettingsPathAsync();
            const data: string = await fs.readFile(settingPath, "utf8");
            const settings = JSON.parse(data);

            // Verifica si la nueva base de datos ya existe en la lista
            if (!settings.possible_db.includes(newDB)) {
                settings.possible_db.push(newDB);
            } else {
                console.assert("La base de datos agragada ya existe en la lista de posibles bases de datos")
                resolve();
            }

            await fs.writeFile(settingPath, JSON.stringify(settings, null, 2));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export async function removePossibleDB(dbToRemove: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const settingPath = await getSettingsPathAsync();
            const data = await fs.readFile(settingPath, "utf8");
            const settings = JSON.parse(data);

            const index = settings.possible_db.indexOf(dbToRemove);
            if (index !== -1) {
                settings.possible_db.splice(index, 1);
            } else {
                console.assert("La base de datos que se ha intentado eliminar no existe");
                return;
            }

            await fs.writeFile(settingPath, JSON.stringify(settings, null, 2));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
