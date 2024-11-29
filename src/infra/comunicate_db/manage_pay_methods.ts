import sqlite3, { Database } from 'sqlite3';
import { getDBPath } from '../manage_env/get_paths';

// crea un nuevo metodo de pago
export async function createPayMethod(dbName: string, type: string, extraData: string): Promise<void> {
    const dbPath: string = await getDBPath(dbName);

    return new Promise((resolve, reject) => {
        if (type === null || extraData === null) {
            reject("Faltan valores");
            return;
        }

        const db: Database = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
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
                        } else {
                            resolve();
                        }
                    });
                });
            } else {
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
                        } else {
                            resolve();
                        }
                    });
                });
            }
        });
    });
}

export function getPayMethodType(payMethodName: string, database: string = 'current'): Promise<payMethodType> {
    return new Promise(async (resolve, reject) => {
        const dbPath = await getDBPath(database);
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });

        const sql = `SELECT * FROM formasDePago WHERE type LIKE ?`;

        db.get(sql, [payMethodName], (err, row: payMethodType) => {
            db.close();

            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            } else {
                const payMethod: payMethodType = {
                    type: row.type,
                    extraData: row.extraData,
                };
                resolve(payMethod);
            }
        });
    });
}

export function getAllPayMethodTypes(database: string = 'current'): Promise<payMethodType[]> {
    return new Promise(async (resolve, reject) => {
        const dbPath = await getDBPath(database);
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });

        const sql = `SELECT * FROM formasDePago`;

        db.all(sql, [], (err: any, rows: payMethodType[]) => {
            db.close();

            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            } else {
                resolve(rows);
            }
        });

    });
}
