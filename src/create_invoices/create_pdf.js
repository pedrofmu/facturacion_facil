const { ipcRenderer } = require('electron');
const path = require('path');
const pdf = require('html-pdf');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

function createHTMLfromPDF(unidadesList){
return new Promise((resolve, reject) => {
    var htmlString = "";
    try{
        unidadesList.forEach((element) => {
            const cantidad = element.cantidad;
            const precioUnidad = element.precioUnidad;
            const iva = element.iva;

            const descuento = cantidad * precioUnidad * (element.descuento / 100);
            const bi = (cantidad * precioUnidad) - descuento;

            const ivaAdd = bi * (iva / 100);
            htmlString += `
                <tr>
                  <td>${element.tipo}</th>
                  <td>${Number(precioUnidad).toFixed(2)}€</th>
                  <td>${element.cantidad}</th>
                  <td>${Number(descuento).toFixed(2)}€</th>
                  <td>${Number(bi).toFixed(2)}€</th>
                  <td>${Number(ivaAdd).toFixed(2)}€</th>
                  <td>${Number(bi + ivaAdd).toFixed(2)}€</th>
                </tr>`;

    });

    resolve(htmlString);
    }catch(error){
        reject(error);
    }
});
}

function createInvoicePDF(proveedor, cliente, numero, fecha, unidadesList, baseImonible, retenidoIRPF, ivaAdd, cuotaIVA, importeTotal, formaDePago, detalles){
return new Promise(async (resolve, reject) => {
try {
const cssRendering = await readFileAsync('./database/style.css', 'utf-8');
  const productsHTML = await createHTMLfromPDF(unidadesList);  
  const htmlRendering = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Título de tu factura</title>
      <style>${cssRendering}</style>
  </head>
  <body>
      <div class="header">
          <div class="remitente">
              <h2>${proveedor.nombre}</h2>
              <h5>${proveedor.id}</h5>
              <h5>${proveedor.direccion}</h5>
              <h5>${proveedor.contacto}</h5>
          </div>
          <img src="">
      </div>
      <div class="datos1">
          <div class="comprador">
              <h2>${cliente.nombre}</h2>
              <h5>${cliente.id}</h5>
              <h5>${cliente.direccion}</h5>
              <h5>${cliente.contacto}</h5>
          </div>
          <div class="datos_id_factura">
              <h2>${numero}</h2>
              <h5>${fecha}</h5>
          </div>
      </div>
      <table id="productos" border="2">
          <tr>
              <th>Concepto</th>
              <th>Precio unitario</th>
              <th>Unidades</th>
              <th>DTO.</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
          </tr>
          ${productsHTML}
      </table>
      <div class="datos2">
          <div class="pago_total">
              <h5>Total Base Imponible: ${Number(baseImonible).toFixed(2)}€</h5>
              <h5>Retenido IRPF: ${Number(retenidoIRPF).toFixed(2)}€</h5>
              <h5>Añadido por IVA (${cuotaIVA}): ${Number(ivaAdd).toFixed(2)}€</h5>
              <h5>Importe total: ${Number(importeTotal).toFixed(2)}€</h5>
          </div>
          <div class="forma_pago">
              <h4>Forma de pago: </h4>
              <h5>${formaDePago}</h5>
          </div>
      </div>
      <div class="detalles_extra">
         ${detalles ? `<p>${detalles}</p>` : ''}
      </div>
  </body>
  </html>
  `;

  const pdfOptions = {
    format: 'Letter', 
    base: 'file://' + path.join(__dirname), 
  };

  ipcRenderer.send('open-file-dialog', 'pdf', numero);

  ipcRenderer.on('selected-file', (event, filePath) => {
    if (filePath) {
      // Convierte HTML a PDF y guarda el archivo en la ubicación seleccionada
      pdf.create(htmlRendering, pdfOptions).toFile(filePath, (err, res) => {
        if (err) reject(err);
        console.log(res); // Información sobre el archivo generado

        resolve(true);
      });
    } else {
      resolve(false); 
    }
  });
  }catch(error){
      reject(error);
  }
});
};

module.exports = { createInvoicePDF };
