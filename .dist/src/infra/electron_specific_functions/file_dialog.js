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
exports.openFileDialog = openFileDialog;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const get_paths_1 = require("../manage_env/get_paths");
/**
 * Importante devuelve string, sin embargo hay un error con electron y async por lo que hay que
 * guardarla en un let x:any y despues acceder a la propiedad filePath
 *
 * @returns {Promise<string>} esto realmente guardalo en any y accede a filePath.
 */
function openFileDialog(fileName, fileType, mainWindow) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
        const homeFolderPath = yield (0, get_paths_1.getHomeFolderPath)();
        const defautlSavePath = path_1.default.join(homeFolderPath, `${fileName}.${fileType}`);
        try {
            // Mostrar diálogo para guardar
            let jsonSaveDialog = electron_1.dialog.showSaveDialog(mainWindow, {
                title: `Guardar ${fileName}.${fileType.toUpperCase()}`,
                defaultPath: defautlSavePath,
                filters: filters,
            });
            resolve(jsonSaveDialog);
        }
        catch (_a) {
            reject("Selecciona un path valido");
        }
    }));
}
