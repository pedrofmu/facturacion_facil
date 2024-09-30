const { getLetter, getNumbers } = require('../../modify_invoice/getInvoiceIDs');
const { getFactura } = require('../../modify_invoice/getDataOfInvoice');
const { getPersonas } = require('../../invoices/connect_db');
const { getAllPayMethods, getHasExtraField } = require('../../formas_pago/gestionar_formas_pago');

const letra_selector = document.getElementById("letra_selector");
const id_selector = document.getElementById("id_selector");
const formaDePago = document.getElementById("forma_de_pago");
const proveedorSelector = document.getElementById("proveedor_selector");
const clienteSelector = document.getElementById("cliente_selector");
const extraPayMethod = document.getElementById("forma_de_pago_extra");

document.getElementById("atras_btn").addEventListener("click", () => {
    window.location.href = "../home/home.html"
});

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

async function loadFacturaNumber() {
    let letters = await getLetter();

    for (const letterRow of letters) {
        var letterOption = document.createElement("option");
        letterOption.value = letterRow;
        letterOption.text = letterRow;

        letra_selector.add(letterOption);

        let numbers = await getNumbers(letterRow);

        numbers.forEach(numberRow => {
            var numberOption = document.createElement("option");
            numberOption.value = numberRow;
            numberOption.text = numberRow;

            id_selector.add(numberOption);
        });
    }

    loadAllParams();
}

async function loadAllParams(){
    let factura_id = letra_selector.value + id_selector.value; 
    let factura = await getFactura(factura_id);

    console.log(factura);
}

async function loadPayMethods() {
  let payMethodsOptions = Array.from(formaDePago.options).map(option => option.value);

  // Cargar clientes
  let payMethods = await getAllPayMethods();
  payMethods.forEach((row) => {
    if (!payMethodsOptions.includes(row.type)) {
      var option = document.createElement("option");
      option.value = row.type;
      option.text = row.type;
      formaDePago.add(option);
      payMethodsOptions.push(row);
    }
  });

  await showExtraPayMethod();
}

async function showExtraPayMethod() {
  const field = formaDePago.value;
  const hasExtraField = await getHasExtraField(field);

  if (hasExtraField) {
    extraPayMethod.classList.remove("oculto");
  } else {
    extraPayMethod.classList.add("oculto");
  }
}

loadFacturaNumber();
loadPersons();
loadPayMethods();
