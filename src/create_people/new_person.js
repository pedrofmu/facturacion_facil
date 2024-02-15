const sqlite3 = require("sqlite3").verbose();

function createPerson(table, nombre, id, direccion, contacto) {
  return new Promise((resolve, reject) => {
    if (table !== "emisor" && table !== "receptor") {
      reject("Faltan valores o la tabla es incorrecta");
      return; // Importante retornar para evitar que continúe el proceso
    }

    if (nombre === null || nombre === '' || id === null || id === '' || direccion === null || direccion === ''|| contacto === null || contacto === ''){
      reject("Faltan valores");
      return; // Importante retornar para evitar que continúe el proceso
    } 

    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
        return; // Importante retornar para evitar que continúe el proceso
      }

      const valuesToInsert = [nombre, id, direccion, contacto];

      db.run(`INSERT INTO ${table} (nombre, id, direccion, contacto) VALUES (?, ?, ?, ?)`, valuesToInsert, (err) => {
        if (err) {
          reject(err);
          return; // Importante retornar para evitar que continúe el proceso
        }

        // Cerrar la conexión después de realizar las operaciones
        db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  });
}

module.exports = { createPerson };
