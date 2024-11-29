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
exports.createSubjectData = createSubjectData;
exports.getSubjectData = getSubjectData;
exports.getAllSubjectsData = getAllSubjectsData;
const sqlite3_1 = __importDefault(require("sqlite3"));
const get_paths_1 = require("../manage_env/get_paths");
function createSubjectData(taxIdentificationName, personType, id, name, address, postCode, town, province, contact, dbName, dbTable) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!taxIdentificationName || !personType || !id || !name || !address || !postCode || !town || !province || !contact) {
                return reject("Faltan valores obligatorios");
            }
            const validTables = ["receptor", "emisor"];
            if (!validTables.includes(dbTable)) {
                return reject("La tabla seleccionada no existe");
            }
            const dbPath = yield (0, get_paths_1.getDBPath)(dbName);
            const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err)
                    return reject(`Error al abrir la base de datos: ${err.message}`);
            });
            const querySelect = `SELECT * FROM ${dbTable} WHERE id = ?`;
            db.get(querySelect, [id], (err, row) => {
                if (err) {
                    db.close();
                    return reject(`Error al buscar datos: ${err.message}`);
                }
                if (row) {
                    // Actualizar si existe
                    const queryUpdate = `UPDATE ${dbTable} SET contact = ?, province = ?, town = ?, postCode = ?, address = ?, name = ?, personType = ?, taxIdentificationName = ?, WHERE id = ?`;
                    db.run(queryUpdate, [contact, province, town, postCode, address, name, personType, taxIdentificationName, id], (err) => {
                        db.close();
                        if (err)
                            return reject(`Error al actualizar datos: ${err.message}`);
                        resolve();
                    });
                }
                else {
                    // Insertar si no existe
                    const queryInsert = `INSERT INTO ${dbTable} (taxIdentificationName, personType, id, name, address, postCode, town, province, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.run(queryInsert, [taxIdentificationName], (err) => {
                        db.close();
                        if (err)
                            return reject(`Error al insertar datos: ${err.message}`);
                        resolve();
                    });
                }
            });
        }
        catch (error) {
            reject(`Error inesperado: ${error}`);
        }
    }));
}
function getSubjectData(name, table, database = 'current') {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // Conectar a la base de datos
        if (!(table === "receptor" || table === "emisor")) {
            reject("La tabla seleccionada no existe");
            return;
        }
        const dbPath = yield (0, get_paths_1.getDBPath)(database);
        const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });
        // Definir la consulta SQL
        const sql = `SELECT * FROM ${table} WHERE id LIKE ?`;
        // Ejecutar la consulta
        db.get(sql, [name], (err, row) => {
            // Cerrar la conexión
            db.close();
            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            }
            else {
                resolve(row);
            }
        });
    }));
}
function getAllSubjectsData(table, database = 'current') {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // Conectar a la base de datos
        if (!(table === "receptor" || table === "emisor")) {
            reject("La tabla seleccionada no existe");
            return;
        }
        const dbPath = yield (0, get_paths_1.getDBPath)(database);
        const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });
        const sql = `SELECT * FROM ${table}`;
        db.all(sql, [], (err, rows) => {
            db.close();
            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            }
            else {
                resolve(Array.from(rows));
            }
        });
    }));
}
