const sqlite3 = require("sqlite3").verbose();
const { getDBPath } = require("../manage_env/getPath");

//Obtener el numero para la siguiente letra "A1" "A2" "A3"
async function getInvoiceID(letter) {
  return new Promise(async (resolve, reject) => {
    const folderPath = await getDBPath();
    //Abrir la db
    const db = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      }
    });

    //Ejecutar la querry
    db.all(`SELECT * FROM facturas WHERE numero LIKE '%${letter}%'`, [], (err, rows) => {
      if (err) {
        console.error("Error leyendo letras: ", letter);
        reject(err);
      }

      //Calcular cual debe ser el siguiente numero
      let maxNumAfterLetter = 0;

      rows.forEach((row) => {
        const match = row.numero.match(/\d+$/); // Obtener el número al final de la cadena
        if (match) {
          const numAfterLetter = parseInt(match[0], 10);
          if (numAfterLetter > maxNumAfterLetter) {
            maxNumAfterLetter = numAfterLetter;
          }
        }
      });

      const nextNum = maxNumAfterLetter + 1;

      db.close((err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(nextNum);
        }
      });
    });
  });
}

//Obtener una persona (cliente, proveedor)
function getPersonas(table) {
  return new Promise(async (resolve, reject) => {
    const folderPath = await getDBPath();
    if (table !== "receptor" && table !== "emisor") {
      console.error('Tabla invalida para obtener una persona');
      reject();
    }
    //Abrir la db
    const db = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      } else {
        console.log(`Conexión a la base de datos establecida`);
      }

      let personas = [];
      db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
        if (err) {
          console.error("Error leyendo letras: ", letter);
          reject(err);
        }

        //Añadir todos los nombres de personas
        rows.forEach((row) => {
          personas.push(row.nombre);
        });

        //Cerrar la db
        db.close((err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          }
          console.log('Conexión cerrada');
          resolve(personas);
        });
      });
    });
  });
}

function getPersona(table, personName) {
  return new Promise(async (resolve, reject) => {
    const folderPath = await getDBPath();
    if (table !== "receptor" && table !== "emisor") {
      console.error('Tabla invalida para obtener una persona');
      reject();
    }
    //Abrir la db
    const db = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      } else {
        console.log(`Conexión a la base de datos establecida`);
      }

      let persona;
      db.get(`SELECT * FROM ${table} WHERE nombre LIKE '${personName}' `, [], (err, row) => {
        if (err) {
          console.error("Error leyendo letras: ", letter);
          reject(err);
        }

        //Añadir todos los nombres de personas
        persona = row;

        //Cerrar la db
        db.close((err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          }
          resolve(persona);
        });
      });
    });
  });
};


//Funcion para añadir una factura a la base de datos
//Valores de la tabla
async function addInvoice(numero, cliente, proveedor, fecha, unidades, concepto, importeTotal, irpf, detalles, formaDePago) {
  //Comporbar si la tabla es valida
  //Abrir la base de datos
  const folderPath = await getDBPath();
  const db = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(`Error al abrir la base de datos: ${err.message}`);
      return;
    } else {
      console.log(`Conexión a la base de datos establecida`);
    }
  });

  //Insertar los valores
  const valuesToInsert = [numero, cliente, proveedor, fecha, unidades, concepto, importeTotal, irpf, detalles, formaDePago];

  db.run(`INSERT INTO facturas (numero, receptor, emisor, fecha, unidades, concepto, importeTotal, irpf, detalles, formaDePago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, valuesToInsert, function(err) {
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
}

module.exports = { addInvoice, getInvoiceID, getPersonas, getPersona };
