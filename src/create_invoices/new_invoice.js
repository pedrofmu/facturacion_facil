const { addInvoice, getInvoiceID  } = require("./connect_db");
const { dialog } = require('electron');

//Guardar la factura
async function saveInvoice(tabla, letra, cliente, proveedor, fecha, unidadesList, irpf, datosExtra, actividad) {
  try {
    if(cliente.length === 0 || proveedor.length === 0 || fecha.length === 0 || unidadesList.length === 0 || actividad.length === 0){
      throw "faltan valores";
    }
    const nextNumber = await getInvoiceID(tabla, letra);
    const numero = letra + nextNumber;

    //Valores del pago
    let importeTotal = 0;
    let baseImponible = 0;
    let ivaAdd = 0;

    //Calcular el importe total
    unidadesList.forEach((element) => {
      const cantidad = element.cantidad;
      const precioUnidad = element.precioUnidad;
      const iva = element.iva;

      baseImponible += cantidad * precioUnidad;
      ivaAdd += cantidad * precioUnidad * (iva / 100);
    });

    //Calcular el importe total
    if (irpf > 0){
      importeTotal = baseImponible + ivaAdd - (baseImponible * (irpf / 100));
    }else{
      importeTotal = baseImponible + ivaAdd;
    }

    addInvoice(tabla, numero, cliente, proveedor, fecha, JSON.stringify(unidadesList), importeTotal, irpf, datosExtra, actividad);
  } catch (error) {
    window.alert(`Error: ${error}`);
  }
}

module.exports = { saveInvoice };
