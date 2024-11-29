import sqlite3 from 'sqlite3';
import { getDBPath } from '../manage_env/get_paths';

export function createSubjectData(taxIdentificationName: string, personType: PersonType, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbName: string, dbTable: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!taxIdentificationName || !personType || !id || !name || !address || !postCode || !town || !province || !contact ) {
                return reject("Faltan valores obligatorios");
            }

            const validTables = ["receptor", "emisor"];
            if (!validTables.includes(dbTable)) {
                return reject("La tabla seleccionada no existe");
            }

            const dbPath: string = await getDBPath(dbName);

            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return reject(`Error al abrir la base de datos: ${err.message}`);
            });

            const querySelect = `SELECT * FROM ${dbTable} WHERE id = ?`;
            db.get(querySelect, [id], (err, row) => {
                if (err) {
                    db.close();
                    return reject(`Error al buscar datos: ${err.message}`);
                }

                if (row) {
                    // Actualizar si existe
                    const queryUpdate = `UPDATE ${dbTable} SET contact = ?, province = ?, town = ?, postCode = ?, address = ?, name = ?, personType = ?, taxIdentificationName = ? WHERE id = ?`;
                    db.run(queryUpdate, [contact, province, town, postCode, address, name, personType, taxIdentificationName, id], (err) => {
                        db.close();
                        if (err) return reject(`Error al actualizar datos: ${err.message}`);
                        resolve();
                    });
                } else {
                    // Insertar si no existe
                    const queryInsert = `INSERT INTO ${dbTable} (taxIdentificationName, personType, id, name, address, postCode, town, province, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.run(queryInsert, [taxIdentificationName, personType, id, name, address, postCode, town, province, contact], (err) => {
                        db.close();
                        if (err) return reject(`Error al insertar datos: ${err.message}`);
                        resolve();
                    });
                }
            });
        } catch (error) {
            reject(`Error inesperado: ${error}`);
        }
    });
}

export function getSubjectData(id: string, table: string, database: string = 'current'): Promise<subject> {
    return new Promise(async (resolve, reject) => {
        // Conectar a la base de datos
        if (!(table === "receptor" || table === "emisor")) {
            reject("La tabla seleccionada no existe");
            return;
        }

        const dbPath = await getDBPath(database);
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });

        // Definir la consulta SQL
        const sql = `SELECT * FROM ${table} WHERE id LIKE ?`;

        // Ejecutar la consulta
        db.get(sql, [id], (err, row: subject) => {
            // Cerrar la conexión
            db.close();

            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            } else {
                resolve(row);
            }
        });
    });
}

export function getAllSubjectsData(table: string, database: string = 'current'): Promise<subject[]> {
    return new Promise(async (resolve, reject) => {
        // Conectar a la base de datos
        if (!(table === "receptor" || table === "emisor")) {
            reject("La tabla seleccionada no existe");
            return;
        }

        const dbPath = await getDBPath(database);
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(`Error al conectar a la base de datos: ${err.message}`);
                return;
            }
        });

        const sql = `SELECT * FROM ${table}`;

        db.all(sql, [], (err, rows: subject[]) => {
            db.close();

            if (err) {
                reject(`Error al ejecutar la consulta: ${err.message}`);
                return;
            } else {
                resolve(Array.from(rows));
            }
        });
    });
}
