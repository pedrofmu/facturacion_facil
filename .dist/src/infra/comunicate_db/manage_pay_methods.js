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
exports.createPayMethod = createPayMethod;
exports.getPayMethodType = getPayMethodType;
exports.getAllPayMethodTypes = getAllPayMethodTypes;
const sqlite3_1 = __importDefault(require("sqlite3"));
const get_paths_1 = require("../manage_env/get_paths");
// crea un nuevo metodo de pago
function createPayMethod(dbName, type, extraData) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbPath = yield (0, get_paths_1.getDBPath)(dbName);
        return new Promise((resolve, reject) => {
            if (type === null || extraData === null) {
                reject("Faltan valores");
                return;
            }
            const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            db.get(`SELECT * FROM formasDePago WHERE type = ?`, [type], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    // Si el valor existe actualizar extra data 
                    db.run(`UPDATE formasDePago SET extraData = ? WHERE type = ?`, [extraData, type], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        db.close((err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }
                else {
                    // Si el valor no existe añadir una nueva fila 
                    const valuesToInsert = [type, extraData];
                    db.run(`INSERT INTO formasDePago (type, extraData) VALUES (?, ?)`, valuesToInsert, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        db.close((err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }
            });
        });
    });
}
function getPayMethodType(payMethodName, database = 'current') {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const dbPath = yield (0, get_paths_1.getDBPath)(database);
        const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });
        const sql = `SELECT * FROM formasDePago WHERE type LIKE ?`;
        db.get(sql, [payMethodName], (err, row) => {
            db.close();
            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            }
            else {
                const payMethod = {
                    type: row.type,
                    extraData: row.extraData,
                };
                resolve(payMethod);
            }
        });
    }));
}
function getAllPayMethodTypes(database = 'current') {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const dbPath = yield (0, get_paths_1.getDBPath)(database);
        const db = new sqlite3_1.default.Database(dbPath, sqlite3_1.default.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });
        const sql = `SELECT * FROM formasDePago`;
        db.all(sql, [], (err, rows) => {
            db.close();
            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            }
            else {
                resolve(rows);
            }
        });
    }));
}
