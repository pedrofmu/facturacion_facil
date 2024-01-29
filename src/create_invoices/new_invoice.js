const { addInvoice, getInvoiceID  } = require("./connect_db");

//Guardar la factura
async function saveInvoice(letra, cliente, proveedor, fecha, unidadesList, irpf, datosExtra, formaDePago) {
    if(cliente.length === 0 || proveedor.length === 0 || fecha.length === 0 || unidadesList.length === 0 || formaDePago.length === 0){
      throw "faltan valores";
    }
    const nextNumber = await getInvoiceID(letra);
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
      const descuento = element.descuento;

      bi = cantidad * precioUnidad - (cantidad * precioUnidad * (descuento / 100));
      baseImponible += bi;
      ivaAdd += bi * (iva / 100);
    });

    //Calcular el importe total
    if (irpf > 0){
      importeTotal = baseImponible + ivaAdd - (baseImponible * (irpf / 100));
    }else{
      importeTotal = baseImponible + ivaAdd;
    }

    addInvoice(numero, cliente, proveedor, fecha, JSON.stringify(unidadesList), importeTotal, irpf, datosExtra, formaDePago);
  } 

module.exports = { saveInvoice };
