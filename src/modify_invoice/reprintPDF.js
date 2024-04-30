const { getPersona } = require("../invoices/connect_db");
const { createInvoicePDF } = require("../invoices/create_pdf");
const { getDBPath } = require("../manage_env/getPath");
const sqlite3 = require("sqlite3").verbose();

async function reprintInvoice(invoiceID) {
  return new Promise(async (resolve, reject) => {
    const folderPath = await getDBPath();

    //Abrir la db
    const db = new sqlite3.Database(folderPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
        reject(err);
      } else {
        console.log(`Conexión a la base de datos establecida`);
      }

      db.get(`SELECT * FROM facturas WHERE numero LIKE '${invoiceID}' `, [], async (err, row) => {
        if (err) {
          reject(err);
        }

        const clienteData = await getPersona("receptor", row.receptor);
        const proveedorData = await getPersona("emisor", row.emisor);

        let unidadesList = JSON.parse(row.unidades);

        let importeTotal = 0;
        let baseImponible = 0;
        let ivaAdd = 0;
        let ivas = [];

        // Calcular el importe total
        unidadesList.forEach((element) => {
          const cantidad = element.cantidad;
          const precioUnidad = element.precioUnidad;
          if (!ivas.includes(`${element.iva}%`)) {
            ivas.push(`${element.iva}%`);
          }
          const iva = element.iva;
          const descuento = element.descuento;

          const bi = cantidad * precioUnidad - (cantidad * precioUnidad * (descuento / 100));
          baseImponible += bi;
          ivaAdd += bi * (iva / 100);
        });

        // Calcular el irpf 
        if (row.irpf > 0) {
          importeTotal = baseImponible + ivaAdd - (baseImponible * (row.irpf / 100));
        } else {
          importeTotal = baseImponible + ivaAdd;
        }

        await createInvoicePDF(proveedorData, clienteData, row.numero, row.fechaEmision, row.fechaVencimiento, unidadesList, baseImponible, baseImponible * row.irpf / 100, ivaAdd, ivas, importeTotal, row.formaDePago, row.detalles);

        db.close((err) => {
          if (err) {
            console.error(err.message);
            reject(err);
          }

          resolve();
        });
      });
    });
  });
}

module.exports = { reprintInvoice };

