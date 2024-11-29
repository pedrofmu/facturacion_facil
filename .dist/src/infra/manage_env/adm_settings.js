"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingsPathAsync = getSettingsPathAsync;
exports.loadPossibleDB = loadPossibleDB;
exports.getCurrentDB = getCurrentDB;
exports.changeCurrentDB = changeCurrentDB;
exports.addPossibleDB = addPossibleDB;
exports.removePossibleDB = removePossibleDB;
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
// obtener el path a los settings con una promesa
function getSettingsPathAsync() {
    return new Promise((resolve) => {
        const homeDir = (0, os_1.homedir)();
        const folderPath = path_1.default.join(homeDir, ".facturacionfacil/");
        const settingsPath = path_1.default.join(folderPath, ".settings.json");
        resolve(settingsPath);
    });
}
// obtener un array de los db posibles 
function loadPossibleDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const settingPath = yield getSettingsPathAsync();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            (0, fs_1.readFile)(settingPath, "utf8", (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                const settings = JSON.parse(data);
                const { current_database, possible_db } = settings;
                const currentIndex = possible_db.indexOf(current_database);
                const reorderedDBs = [
                    possible_db[currentIndex],
                    ...possible_db.slice(0, currentIndex),
                    ...possible_db.slice(currentIndex + 1)
                ];
                resolve(reorderedDBs);
            });
        }));
    });
}
function getCurrentDB() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const settingPath = yield getSettingsPathAsync();
            (0, fs_1.readFile)(settingPath, "utf8", (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(data).current_database);
            });
        }));
    });
}
function changeCurrentDB(database) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const settingPath = yield getSettingsPathAsync();
            const data = yield promises_1.default.readFile(settingPath, "utf8");
            const settings = JSON.parse(data);
            // Actualiza el valor de current_database en el objeto settings
            settings.current_database = database;
            // Convierte el objeto settings actualizado de nuevo a JSON
            const updatedData = JSON.stringify(settings, null, 2);
            // Escribe los datos actualizados de vuelta al archivo
            yield promises_1.default.writeFile(settingPath, updatedData, "utf8");
            // Indica que la operación se ha completado exitosamente
            resolve("Datos actualizados correctamente en el archivo .json");
        }
        catch (error) {
            // Rechaza la promesa con el mensaje de error
            reject("Error cambiando la base de datos en uso");
        }
    }));
}
// añadir nueva entrada de base de datos
function addPossibleDB(newDB) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const settingPath = yield getSettingsPathAsync();
                const data = yield promises_1.default.readFile(settingPath, "utf8");
                const settings = JSON.parse(data);
                // Verifica si la nueva base de datos ya existe en la lista
                if (!settings.possible_db.includes(newDB)) {
                    settings.possible_db.push(newDB);
                }
                else {
                    console.assert("La base de datos agragada ya existe en la lista de posibles bases de datos");
                    resolve();
                }
                yield promises_1.default.writeFile(settingPath, JSON.stringify(settings, null, 2));
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
function removePossibleDB(dbToRemove) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const settingPath = yield getSettingsPathAsync();
                const data = yield promises_1.default.readFile(settingPath, "utf8");
                const settings = JSON.parse(data);
                const index = settings.possible_db.indexOf(dbToRemove);
                if (index !== -1) {
                    settings.possible_db.splice(index, 1);
                }
                else {
                    console.assert("La base de datos que se ha intentado eliminar no existe");
                    return;
                }
                yield promises_1.default.writeFile(settingPath, JSON.stringify(settings, null, 2));
                resolve();
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
