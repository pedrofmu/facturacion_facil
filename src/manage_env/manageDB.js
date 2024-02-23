const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { getHomeFolderPath } = require('./getPath');

const fs = require('fs').promises;

function deleteDB(nombre) {
  return new Promise((resolve, reject) => {
    try {
      // Eliminar el archivo
      fs.unlink(archivoAEliminar, (error) => {
        if (error) {
          reject(error);
        }
        resolve("Se ha borrado exitosamente la db");
      });
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
      const dbPath = path.join(homePath, `${nombre}.db` );
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

module.exports = { deleteDB, createDB };
