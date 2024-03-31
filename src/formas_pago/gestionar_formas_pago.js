const sqlite3 = require("sqlite3").verbose();
const { getDBPath } = require("../manage_env/getPath");

async function createPayMethod(dbName, type, extraData) {
  const dbPath = await getDBPath(dbName);

  return new Promise((resolve, reject) => {
    if (type === null || extraData === null) {
      reject("Faltan valores");
      return;
    }

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    // Check if the value already exists in the database
    db.get(`SELECT * FROM formasDePago WHERE type = ?`, [type], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        // If the value already exists, update the extraData
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
        // If the value doesn't exist, insert a new row
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

async function insertNewPayMethod(type, extraData) {
  const dbPath = await getDBPath();

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

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
  });
}

async function getAllPayMethods() {
  const dbPath = await getDBPath();

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    var dataList = [];
    db.all(`SELECT * FROM formasDePago`, [], (err, rows) => {
      if (err) {
        console.error("Error obteniendo las facturas");
        reject(err);
      }

      rows.forEach((row) => {
        dataList.push({
          type: row.type,
          extraData: row.extraData
        });
      });

      db.close(async (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }

        resolve(dataList);
      });
    });
  });
}

async function getHasExtraField(field) {
  try {
    const dbPath = await getDBPath();

    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          reject(err);
          return;
        }

        db.get(`SELECT extraData FROM formasDePago WHERE type = ?`, [field], (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row) {
            resolve(row.extraData);
          } else {
            resolve(null); // No se encontró ninguna fila con ese typeName
          }
        });
      });
    });
  } catch (error) {
    throw error;
  }
}


module.exports = { createPayMethod, getAllPayMethods, getHasExtraField, insertNewPayMethod };
