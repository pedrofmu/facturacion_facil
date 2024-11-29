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
exports.getNextInvoiceID = getNextInvoiceID;
const get_paths_1 = require("../manage_env/get_paths");
const sqlite3_1 = __importDefault(require("sqlite3"));
function getNextInvoiceID(letter, database = 'current') {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const folderPath = yield (0, get_paths_1.getDBPath)(database);
            // Abrir la base da datos
            const db = new sqlite3_1.default.Database(folderPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            let query = 'SELECT * FROM facturas WHERE numero LIKE ?';
            // Ejecutar la consulta
            db.all(query, [`${letter}%`], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                // Calcular cuál debe ser el siguiente número
                let maxNumAfterLetter = 0;
                rows.forEach((row) => {
                    const match = row.numero.match(/\d+$/);
                    if (match) {
                        const numAfterLetter = parseInt(match[0], 10);
                        if (numAfterLetter > maxNumAfterLetter) {
                            maxNumAfterLetter = numAfterLetter;
                        }
                    }
                });
                const nextNumber = `${letter}${maxNumAfterLetter + 1}`;
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                    else {
                        resolve(nextNumber);
                    }
                });
            });
        }
        catch (error) {
            reject(error);
        }
    }));
}
