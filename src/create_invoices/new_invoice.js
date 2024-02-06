const { addInvoice, getInvoiceID, getPersona  } = require("./connect_db");
const { createInvoicePDF } = require("./create_pdf");

//Guardar la factura
async function saveInvoice(letra, cliente, proveedor, fecha, unidadesList, concepto, irpf, datosExtra, formaDePago) {
  return new Promise(async (resolve, reject) => {
    try {
      if (cliente.length === 0 || proveedor.length === 0 || fecha.length === 0 || unidadesList.length === 0 || formaDePago.length === 0 || concepto.length === 0) {
        throw "Faltan valores";
      }

      const nextNumber = await getInvoiceID(letra);
      const numero = letra + nextNumber;

      // Valores del pago
      let importeTotal = 0;
      let baseImponible = 0;
      let ivaAdd = 0;

      // Calcular el importe total
      unidadesList.forEach((element) => {
        const cantidad = element.cantidad;
        const precioUnidad = element.precioUnidad;
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

      addInvoice(numero, cliente, proveedor, fecha, JSON.stringify(unidadesList), concepto, importeTotal, irpf, datosExtra, formaDePago);

      //Crear el pdf con la factura
      await createInvoicePDF(proveedorData, clienteData, numero, fecha, unidadesList, baseImponible, 0, ivaAdd, importeTotal, formaDePago);

      resolve(); 
    } catch (error) {
      reject(error); 
    }
  });
}

module.exports = { saveInvoice };
