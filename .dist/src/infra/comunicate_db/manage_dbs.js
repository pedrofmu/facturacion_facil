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
exports.createDB = createDB;
const get_paths_1 = require("../manage_env/get_paths");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const manage_pay_methods_1 = require("../comunicate_db/manage_pay_methods");
const adm_settings_1 = require("../manage_env/adm_settings");
function createDB(nombre) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            //path a el home
            const homePath = yield (0, get_paths_1.getHomeFolderPath)();
            const dbPath = path_1.default.join(homePath, `${nombre}.db`);
            try {
                // Verificar si el archivo de base de datos ya existe
                yield promises_1.default.access(dbPath);
                resolve(`El archivo de base de datos '${dbPath}' ya existe.`);
            }
            catch (error) {
                // Si no existe, crear el archivo vacío
                yield promises_1.default.writeFile(dbPath, '');
            }
            // Conexión a la base de datos
            const db = new sqlite3_1.default.Database(dbPath);
            // Crear las tablas si no existen
            const createFacturasTable = () => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS facturas (
            numero TEXT,
            receptor TEXT,
            emisor TEXT,
            fechaEmision DATE,
            fechaVencimiento DATE,
            unidades TEXT,
            concepto TEXT, 
            importeTotal REAL,
            irpf INTEGER,
            detalles TEXT,
            formaDePago TEXT
          )`, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            // Promesa para crear tabla receptor
            const createReceptorTable = () => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS receptor (
            taxIdentificationName TEXT,
            personType TEXT,
            id TEXT,
            name TEXT,
            address TEXT,
            postCode TEXT,
            town TEXT,
            province TEXT,
            contact TEXT
          )`, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            // Promesa para crear tabla emisor
            const createEmisorTable = () => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS emisor (
            taxIdentificationName TEXT,
            personType TEXT,
            id TEXT,
            name TEXT,
            address TEXT,
            postCode TEXT,
            town TEXT,
            province TEXT,
            contact TEXT          
            )`, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            // Promesa para crear tabla formasDePago
            const createFormasDePagoTable = () => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS formasDePago (
            type TEXT,
            extraData BOOL
          )`, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            // Esperar a que se completen todas las creaciones de tablas
            yield Promise.all([
                createFacturasTable(),
                createReceptorTable(),
                createEmisorTable(),
                createFormasDePagoTable()
            ]);
            (0, manage_pay_methods_1.createPayMethod)(nombre, "efectivo", false);
            yield (0, adm_settings_1.addPossibleDB)(nombre);
            // Cerrar la conexión a la base de datos después de asegurarse de que se hayan creado las tablas
            db.close((err) => {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve('Conexión cerrada exitosamente');
                }
            });
        }
        catch (error) {
            reject(error);
        }
    }));
}
