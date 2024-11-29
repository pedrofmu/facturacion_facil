import { getDBPath } from "../manage_env/get_paths";
import sqlite3, { Database } from "sqlite3";

export function getNextInvoiceID(letter: string, database: string = 'current'): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const folderPath: string = await getDBPath(database);

            // Abrir la base da datos
            const db: Database = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            let query: string = 'SELECT * FROM facturas WHERE numero LIKE ?';

            // Ejecutar la consulta
            db.all(query, [`${letter}%`], (err, rows: rowInvoice[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Calcular cuál debe ser el siguiente número
                let maxNumAfterLetter = 0;

                rows.forEach((row: rowInvoice) => {
                    const match = row.numero.match(/\d+$/);
                    if (match) {
                        const numAfterLetter = parseInt(match[0], 10);
                        if (numAfterLetter > maxNumAfterLetter) {
                            maxNumAfterLetter = numAfterLetter;
                        }
                    }
                });

                const nextNumber: string = `${letter}${maxNumAfterLetter + 1}`;

                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(nextNumber);
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}
