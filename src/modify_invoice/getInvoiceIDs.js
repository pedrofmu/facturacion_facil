const { getDBPath } = require("../manage_env/getPath");
const sqlite3 = require("sqlite3").verbose();

async function getAllIDs() {
  return new Promise(async (resolve, reject) => {
    const dbPath = await getDBPath();
    // Conectarse a la base de datos
    const db = new sqlite3.Database(dbPath);

    // Consulta SQL para obtener todos los valores en la columna 'numero'
    const sql = 'SELECT numero FROM facturas';

    // Ejecutar la consulta
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });

    db.close();
  });
}

async function getLetter() {
  return new Promise(async (resolve, reject) => {
    const allIDs = await getAllIDs();
    const uniqueLetters = new Set();
    allIDs.forEach(row => {
      const letter = row.numero.charAt(0);
      uniqueLetters.add(letter);
    });
    resolve(Array.from(uniqueLetters));
  })
}

async function getNumbers(letter) {
  return new Promise(async (resolve, reject) => {
    const allIDs = await getAllIDs();
    const uniqueNumbers = new Set();
    allIDs.forEach(row => {
      if (row.numero.charAt(0) === letter) {
        const number = row.numero.slice(1);
        uniqueNumbers.add(number);
      }
    });
    resolve(Array.from(uniqueNumbers));
  })
}

module.exports = {getLetter, getNumbers};
