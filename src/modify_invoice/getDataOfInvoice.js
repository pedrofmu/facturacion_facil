const { getDBPath } = require("../manage_env/getPath");
const sqlite3 = require("sqlite3").verbose();

function getFactura(id) {
    if (id === null || id.trim() === '')
        return Promise.reject('ID no válido');

    return new Promise(async (resolve, reject) => {
        const dbPath = await getDBPath();
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err)
                return reject(`Error al abrir la base de datos: ${err.message}`);
        });

        db.get(`SELECT * FROM facturas WHERE numero = ?`, [id], (err, row) => {
            if (err) {
                reject(`Error en la consulta: ${err.message}`);
            } else if (!row) {
                resolve(null);
            } else {
                resolve(row);
            }
        });

        db.close((err) => {
            if (err) {
                reject(`Error al cerrar la base de datos: ${err.message}`);
            }
        });
    });
};


module.exports = { getFactura };
