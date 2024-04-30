const { getDBPath } = require('../manage_env/getPath');

const sqlite3 = require('sqlite3').verbose();

function modifyDate(newDate, invoiceID) {
  return new Promise(async (resolve, reject) => {
    const dbPath = await getDBPath(); 

    if (newDate.length === 0 || invoiceID.length === 0){
      reject("Rellena todos los datos");
    }
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err.message);
      }
      console.log('Conexión exitosa a la base de datos SQLite');
    });

    const sql = `UPDATE facturas SET fechaVencimiento = ? WHERE numero = ?`;

    db.run(sql, [newDate, invoiceID], function(err) {
      if (err) {
        reject(err.message);
      }
    });

    db.close((err) => {
      if (err) {
        reject(err.message);
      }
      resolve(`Se actualizó correctamente el valor.`);
    });
  });
}

module.exports = { modifyDate };
