const sqlite3 = require("sqlite3").verbose();

function createPerson(table, nombre, id, direccion, contacto) {
  return new Promise((resolve, reject) => {
    if (table !== "proveedores" && table !== "clientes") {
      console.log("table invalida para crear una persona");
      reject();
    }

    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      } else {
        console.log(`Conexión a la base de datos establecida`);
      }
    });

    const valuesToInsert = [nombre, id, direccion, contacto];

    db.run(`INSERT INTO ${table} (nombre, id, direccion, contacto) VALUES (?, ?, ?, ?)`, valuesToInsert, (err) => {
      if (err) {
        console.error(`Error al insertar valores: ${err.message}`);
      } else {
        console.log(`Se insertaron ${this.changes} registros`);
      }

      // Cerrar la conexión después de realizar las operaciones
      db.close((err) => {
        if (err) {
          console.error(`Error al cerrar la base de datos: ${err.message}`);
        } else {
          console.log('Conexión a la base de datos cerrada');
        }
      });
    });
  });
}

module.exports = { createPerson };
