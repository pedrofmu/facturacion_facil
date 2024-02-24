const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { getHomeFolderPath } = require('./getPath');
const { addPossibleDB, removePossibleDB } = require('./getSettings');

const fs = require('fs').promises;

function deleteDB(nombre) {
  return new Promise(async (resolve, reject) => {
    try {
      // Eliminar el archivo
      const homePath = await getHomeFolderPath();
      const dbPath = path.join(homePath, `${nombre}.db`)
      fs.unlink(dbPath, async (error) => {
        if (error) {
          reject(error);
        }
      });

      await removePossibleDB(nombre);
      resolve("Se ha borrado exitosamente el espacio de guardado");
    } catch (error) {
      reject(error);
    }
  });
}

function createDB(nombre) {
  return new Promise(async (resolve, reject) => {
    try {
      //path a el home
      const homePath = await getHomeFolderPath();
      const dbPath = path.join(homePath, `${nombre}.db`);
      console.log(dbPath);
      try {
        // Verificar si el archivo de base de datos ya existe
        await fs.access(dbPath);
        resolve(`El archivo de base de datos '${dbPath}' ya existe.`);
      } catch (error) {
        // Si no existe, crear el archivo vacío
        await fs.writeFile(dbPath, '');
      }

      // Conexión a la base de datos
      const db = new sqlite3.Database(dbPath);

      // Crear las tablas si no existen
      db.run(`CREATE TABLE IF NOT EXISTS facturas (
        numero TEXT,
        receptor TEXT,
        emisor TEXT,
        fecha DATE,
        unidades TEXT,
        concepto TEXT, 
        importeTotal REAL,
        irpf INTEGER,
        detalles TEXT,
        formaDePago TEXT
    )`);

      db.run(`CREATE TABLE IF NOT EXISTS receptor (
        nombre TEXT,
        id TEXT,
        direccion TEXT,
        contacto TEXT
    )`);

      db.run(`CREATE TABLE IF NOT EXISTS emisor (
        nombre TEXT,
        id TEXT,
        direccion TEXT,
        contacto TEXT
    )`);

      await addPossibleDB(nombre);
      // Cerrar la conexión a la base de datos después de asegurarse de que se hayan creado las tablas
      db.close((err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve('Conexión cerrada exitosamente');
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getTableList(db, table) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
}

function addTableList(db, table, data) {
  return new Promise((resolve, reject) => {
    // Obtener los nombres existentes en la tabla
    db.all(`SELECT nombre FROM ${table}`, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const existingNames = rows.map(row => row.nombre);

      // Filtrar los datos para agregar solo los que no existen aún en la tabla
      const newData = data.filter(entry => !existingNames.includes(entry.nombre));

      if (newData.length === 0) {
        resolve("No hay nuevos nombres para agregar");
        return;
      }

      const placeholders = newData.map(() => '(?, ?, ?, ?)').join(',');
      const values = newData.reduce((acc, entry) => acc.concat(Object.values(entry)), []);

      const sql = `INSERT INTO ${table} (nombre, id, direccion, contacto) VALUES ${placeholders}`;

      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this); // 'this' will contain information about the inserted row
        }
      });
    });
  });
}

function fusionarTablas(dbPath1, dbPath2, eliminarDatos = false) {
  return new Promise(async (resolve, reject) => {
    // Conexión a las bases de datos
    const db1 = new sqlite3.Database(dbPath1);
    const db2 = new sqlite3.Database(dbPath2);

    if (eliminarDatos) {
      // Eliminar datos existentes en las tablas receptor y emisor de la db2
      const deleteReceptorQuery = `DELETE FROM receptor`;
      const deleteEmisorQuery = `DELETE FROM emisor`;

      db2.run(deleteReceptorQuery, (err) => {
        if (err) {
          reject(err.message);
        }
      });

      db2.run(deleteEmisorQuery, (err) => {
        if (err) {
          reject(err.message);
        }
      });
    }

    const db1Emisores = await getTableList(db1, 'emisor');
    const db1Receptores = await getTableList(db1, 'receptor');

    await addTableList(db2, 'emisor', db1Emisores);
    await addTableList(db2, 'receptor', db1Receptores);

    db1.close((err) => {
      if (err) {
        reject(err);
      }
    });

    db2.close((err) => {
      if (err) {
        reject(err);
      }
      resolve("Correctamente fusionadas las tablas");
    });
  });
}

module.exports = { deleteDB, createDB, fusionarTablas };
