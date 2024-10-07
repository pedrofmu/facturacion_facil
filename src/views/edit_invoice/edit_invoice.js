const { getLetter, getNumbers } = require('../../modify_invoice/getInvoiceIDs');
const { getFactura } = require('../../modify_invoice/getDataOfInvoice');
const { getPersonas } = require('../../invoices/connect_db');
const { getAllPayMethods, getHasExtraField } = require('../../formas_pago/gestionar_formas_pago');
const { modifyInvoice } = require('../../modify_invoice/modifyValues');

const letraSelector = document.getElementById("letra_selector");
const idSelector = document.getElementById("id_selector");
const formaDePagoInput = document.getElementById("forma_de_pago");
const proveedorSelector = document.getElementById("proveedor_selector");
const clienteSelector = document.getElementById("cliente_selector");
const extraPayMethodInput = document.getElementById("forma_de_pago_extra");
const irpfInput = document.getElementById("irpf");
const datosExtraInput = document.getElementById("datos_extras");
const fechaVenciminetoInput = document.getElementById("fecha_vencimiento_input");
const fechaEmisionInput = document.getElementById("fecha_emision_input");
const conceptoInput = document.getElementById("concepto");
const unidadesContainer = document.getElementById("unidades_container");

var discountPerProduct = false;

document.getElementById("atras_btn").addEventListener("click", () => {
    window.location.href = "../home/home.html"
});

//Gestionar boton de reemitir
document.getElementById("reemitir_btn").addEventListener("click", async () => {
  try {
    await triggerModifyInvoice();
    alert("Se ha guardado correctamente la factura");
  } catch (error) {
    alert(error);
  }
});

letraSelector.addEventListener("change", async () => {
    await loadFacturaNumbers();
    loadAllParams();
});

idSelector.addEventListener("change", () => {
    loadAllParams();
});

// Manejar clic en el botón de añadir nueva unidad
document.getElementById("add_unidad_btn").addEventListener("click", () => {
    newProduct();
});

document.getElementById("remove_unidad_btn").addEventListener("click", () => {
    var unitsContainer = document.getElementById("unidades_container");
    var lastProduct = unitsContainer.lastElementChild;

    if (lastProduct) {
        unitsContainer.removeChild(lastProduct);
    }
});

document.getElementById("descuento_unidad_btn").addEventListener("click", () => {
    changeDiscountPerProduct();
});

formaDePagoInput.addEventListener("change", async () => {
  try {
    await showExtraPayMethod();
  } catch (error) {
    alert(error);
  }
});

function changeDiscountPerProduct(discount = null) {
    if (discount === null) {
        discountPerProduct = !discountPerProduct;
    } else {
        discountPerProduct = discount
    }

    if (discountPerProduct) {
        var unitElements = document.querySelectorAll(".unidades");

        unitElements.forEach((element) => {
            var newInput = document.createElement("input");
            newInput.type = "number";
            newInput.placeholder = "descuento";
            newInput.id = "descuento";
            newInput.className = "input";

            element.appendChild(newInput);
        });

        var descuentoTotal = document.getElementById("descuento_al_total");
        descuentoTotal.classList.add("oculto");

        var descuentoTotalLabel = document.getElementById("des_lbl");
        descuentoTotalLabel.classList.add("oculto");

        document.getElementById("descuento_unidad_btn").innerHTML = "Descuento al total";
    } else {
        var unitElements = document.querySelectorAll(".unidades");

        unitElements.forEach((element) => {
            var descToDelete = element.querySelector("#descuento");
            descToDelete.remove();
        });

        var descuentoTotal = document.getElementById("descuento_al_total");
        descuentoTotal.classList.remove("oculto");

        var descuentoTotalLabel = document.getElementById("des_lbl");
        descuentoTotalLabel.classList.remove("oculto");

        document.getElementById("descuento_unidad_btn").innerHTML = "Descuento por unidad";
    }
}

async function triggerModifyInvoice() {
  return new Promise(async (resolve, reject) => {
    try {
      var unitElements = document.querySelectorAll(".unidades");
      var unitsList = [];

      unitElements.forEach(element => {
        // Obtener los valores de los inputs dentro de cada li
        var cantidad = element.querySelector('input:nth-child(1)').value;
        var tipo = element.querySelector('input:nth-child(2)').value;
        var precioUnidad = element.querySelector('input:nth-child(3)').value;
        var iva = element.querySelector('input:nth-child(4)').value;
        var descuento = 0;
        if (discountPerProduct) {
          descuento = element.querySelector('input:nth-child(5)').value;
        } else {
          descuento = document.getElementById("descuento_al_total").value;
        }

        // Crear un objeto con los datos y agregarlo a la lista
        var unitData = {
          cantidad: cantidad,
          tipo: tipo,
          precioUnidad: precioUnidad,
          iva: iva,
          descuento: descuento
        };

        unitsList.push(unitData);
      });

      const hasExtraField = await getHasExtraField(formaDePago.value);
      let pago = "";

      if (hasExtraField) {
        pago = `${formaDePagoInput.value}:${extraPayMethodInput.value}`;
      } else {
        pago = formaDePago.value;
      }

     // Llamar a la función para crear una nueva factura
      await modifyInvoice("A1", clienteSelector.value, proveedorSelector.value, fechaEmisionInput.value, fechaVenciminetoInput.value,unitsList, conceptoInput.value, irpfInput.value, detallesInput.value, pago);

      // Resolver la Promesa después de completar la operación
      resolve();
    } catch (error) {
      // Rechazar la Promesa si hay un error
      reject(error);
    }
  });
}

function newProduct() {
    var unitsContainer = document.getElementById("unidades_container");

    var newProduct = document.createElement("li");
    newProduct.className = "unidades";

    for (var i = 0; i < 4; i++) {
        var newInput = document.createElement("input");
        newInput.type = i === 0 || i === 2 || i === 3 ? "number" : "text";
        newInput.placeholder = i === 0 ? "cantidad" : (i === 1 ? "tipo" : (i === 2 ? "precio unidad" : "iva"));
        newInput.className = "input";

        // Agregar el input al li
        newProduct.appendChild(newInput);
    }

    if (discountPerProduct) {
        var newInput = document.createElement("input");
        newInput.type = "number";
        newInput.placeholder = "descuento";
        newInput.id = "descuento";
        newInput.className = "input";

        // Agregar el input al li
        newProduct.appendChild(newInput);
    }

    unitsContainer.appendChild(newProduct);

    return newProduct;
}

function addUnidades(factura) {
    let unidadesList = JSON.parse(factura.unidades);

    changeDiscountPerProduct(true);

    unidadesContainer.innerHTML = '';

    // Usa un bucle for...of para iterar sobre los valores del array
    for (const unidad of unidadesList) {
        let productElement = newProduct().querySelectorAll("input");

        //cantidad
        productElement[0].value = unidad.cantidad;
        //tipo
        productElement[1].value = unidad.tipo;
        //precio unidad
        productElement[2].value = unidad.precioUnidad;
        //iva
        productElement[3].value = unidad.iva;
        //descuento
        productElement[4].value = unidad.descuento;
    }
}

async function loadPersons() {
    // Obtener las opciones actuales del selector
    let existingOptions = Array.from(clienteSelector.options).map(option => option.value);

    // Cargar clientes
    let clientsList = await getPersonas("receptor");
    clientsList.forEach((row) => {
        if (!existingOptions.includes(row)) {
            var option = document.createElement("option");
            option.value = row;
            option.text = row;
            clienteSelector.add(option);
            existingOptions.push(row);  // Agregar la opción a la lista de opciones existentes
        }
    });

    // Obtener las opciones actuales del selector
    existingOptions = Array.from(proveedorSelector.options).map(option => option.value);

    // Cargar proveedores
    let providersList = await getPersonas("emisor");
    providersList.forEach((row) => {
        if (!existingOptions.includes(row)) {
            var option = document.createElement("option");
            option.value = row;
            option.text = row;
            proveedorSelector.add(option);
            existingOptions.push(row);  // Agregar la opción a la lista de opciones existentes
        }
    });
}

async function loadFacturaNumbers() {
    return new Promise(async (resolve, reject) => {
        let numbers = await getNumbers(letraSelector.value);

        idSelector.innerHTML = '';

        numbers.forEach(numberRow => {
            var numberOption = document.createElement("option");
            numberOption.value = numberRow;
            numberOption.text = numberRow;

            idSelector.add(numberOption);
        });
        resolve();
    });
}

async function loadFacturaIDs() {
    let letters = await getLetter();

    for (const letterRow of letters) {
        var letterOption = document.createElement("option");
        letterOption.value = letterRow;
        letterOption.text = letterRow;

        letraSelector.add(letterOption);
    }

    await loadFacturaNumbers();
    loadAllParams();
}

async function loadAllParams() {
    let factura_id = letraSelector.value + idSelector.value;
    let factura = await getFactura(factura_id);

    proveedorSelector.value = factura.emisor;
    clienteSelector.value = factura.receptor;

    //irpf
    irpfInput.value = factura.irpf;

    //detalles
    datosExtraInput.value = factura.detalles;

    //fechas
    fechaEmisionInput.value = factura.fechaEmision;
    if (factura.fechaVencimiento === "PENDIENTE") {
        fechaVenciminetoInput.value = "";
    } else {
        fechaVenciminetoInput.value = factura.fechaVencimiento;
    }

    //concepto
    conceptoInput.value = factura.concepto;

    //forma de pago
    formaDePagoInput.value = factura.formaDePago.split(":")[0];
    showExtraPayMethod();
    if (factura.formaDePago.split(":").length > 1)
        extraPayMethodInput.value  = factura.formaDePago.split(":")[1];

    addUnidades(factura);
}

async function loadPayMethods() {
    let payMethodsOptions = Array.from(formaDePagoInput.options).map(option => option.value);

    // Cargar clientes
    let payMethods = await getAllPayMethods();
    payMethods.forEach((row) => {
        if (!payMethodsOptions.includes(row.type)) {
            var option = document.createElement("option");
            option.value = row.type;
            option.text = row.type;
            formaDePagoInput.add(option);
            payMethodsOptions.push(row);
        }
    });

    await showExtraPayMethod();
}

async function showExtraPayMethod() {
    const field = formaDePagoInput.value;
    const hasExtraField = await getHasExtraField(field);

    if (hasExtraField) {
        extraPayMethodInput.classList.remove("oculto");
    } else {
        extraPayMethodInput.classList.add("oculto");
    }
}

loadFacturaIDs();
loadPersons();
loadPayMethods();
