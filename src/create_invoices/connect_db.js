const sqlite3 = require("sqlite3").verbose();

//Obtener el numero para la siguiente letra "A1" "A2" "A3"
function getInvoiceID(table, letter) {
  return new Promise((resolve, reject) => {
    if (table !== "ingresos" && table !== "gastos"){
      console.error('Tabla invalida para obtener id de la factura');
      reject();
    }

    //Abrir la db
    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      } else {
        console.log(`Conexión a la base de datos establecida`);
      }
    });

    //Ejecutar la querry
    db.all(`SELECT * FROM ${table} WHERE numero LIKE '%${letter}%'`, [], (err, rows) => {
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
        }
        console.log('Conexión cerrada');
        resolve(nextNum);
      });
    });
  });
}

//Obtener una persona (cliente, proveedor)
function getPersonas(table) {
  return new Promise((resolve, reject) => {
    if (table !== "proveedores" && table !== "clientes"){
      console.error('Tabla invalida para obtener una persona');
      reject();
    }
    //Abrir la db
    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
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


//Funcion para añadir una factura a la base de datos
                                   //Valores de la tabla
function addInvoice(table, numero, cliente, proveedor, fecha, unidades, importeTotal, irpf, detalles, actividad) {
  //Comporbar si la tabla es valida
  if (table !== "ingresos" && table !== "gastos"){
    console.error(`Tabla invalida para agregar una factura`);
    return;
  }

  //Abrir la base de datos
  const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(`Error al abrir la base de datos: ${err.message}`);
      return;
    } else {
      console.log(`Conexión a la base de datos establecida`);
    }
  });

  //Insertar los valores
  const valuesToInsert = [numero, cliente, proveedor, fecha, unidades, importeTotal, irpf, detalles, actividad];

  db.run(`INSERT INTO ${table} (numero, cliente, proveedor, fecha, unidades, importeTotal, irpf, detalles, actividad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, valuesToInsert, function (err) {
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

module.exports = { addInvoice, getInvoiceID, getPersonas };
