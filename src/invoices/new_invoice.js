const { addInvoice, getInvoiceID, getPersona } = require("./connect_db");
const { createInvoicePDF } = require("./create_pdf");

//Guardar la factura
async function saveInvoice(letra, cliente, proveedor, fechaEmision, fechaVencimiento, unidadesList, concepto, irpf, datosExtra, formaDePago) {
  return new Promise(async (resolve, reject) => {
    try {
      if (cliente.length === 0 || proveedor.length === 0 || fechaEmision.length === 0 || unidadesList.length === 0 || formaDePago.length === 0 || concepto.length === 0) {
        throw "Faltan valores";
      }

      if (fechaVencimiento.length === 0){
        fechaVencimiento = "PENDIENTE";
      }

      const nextNumber = await getInvoiceID(letra);
      const numero = letra + nextNumber;

      // Valores del pago
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
      if (irpf > 0) {
        importeTotal = baseImponible + ivaAdd - (baseImponible * (irpf / 100));
      } else {
        importeTotal = baseImponible + ivaAdd;
      }

      const clienteData = await getPersona("receptor", cliente);
      const proveedorData = await getPersona("emisor", proveedor);


      //Crear el pdf con la factura
      let save = await createInvoicePDF(proveedorData, clienteData, numero, fechaEmision, fechaVencimiento, unidadesList, baseImponible, baseImponible * irpf / 100, ivaAdd, ivas, importeTotal, formaDePago, datosExtra);

      if (save === true) {
        addInvoice(numero, cliente, proveedor, fechaEmision, fechaVencimiento, JSON.stringify(unidadesList), concepto, importeTotal, irpf, datosExtra, formaDePago);
        resolve();
      } else {
        reject("Seleccione la ubicacion correcta para guardar");
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { saveInvoice };
