// Importar funciones necesarias
const { saveInvoice } = require('../../create_invoices/new_invoice');
const { getPersonas } = require('../../create_invoices/connect_db');
const { ipcRenderer } = require('electron');
const { getAllPayMethods } = require('../../formas_pago/gestionar_formas_pago');

// Obtener elementos del DOM
const fechaInput = document.getElementById("fecha_input");
const letterSelector = document.getElementById("letra_selector");
const formaDePago = document.getElementById("forma_de_pago");
const irpfInput = document.getElementById("irpf");
const detallesInput = document.getElementById("datos_extras");
const proveedorSelector = document.getElementById("proveedor_selector");
const clienteSelector = document.getElementById("cliente_selector");
const conceptoInput = document.getElementById("concepto");

var discountPerProduct = false;

//Manejar el click de crear un cliente nuevo
document.getElementById("nuevo_cliente_btn").addEventListener("click", () => {
  ipcRenderer.send('open-new-window', "receptor");
});

//Maneje el click de crear un proveedor nuevo
document.getElementById("nuevo_provedor_btn").addEventListener("click", () => {
  ipcRenderer.send('open-new-window', "emisor");
});

// Manejar clic en el botón de guardar factura
document.getElementById("guardar_btn").addEventListener("click", async () => {
  try {
    await triggerSaveInvoice();
    alert("Se ha guardado correctamente la factura");
  }catch (error) {
    alert(error);
  }
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

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

clienteSelector.addEventListener("focus", () => {
  loadPersons();
});

proveedorSelector.addEventListener("focus", () => {
  loadPersons();
});

async function triggerSaveInvoice() {
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

      // Llamar a la función para crear una nueva factura
      await saveInvoice(letterSelector.value, clienteSelector.value, proveedorSelector.value, fechaInput.value, unitsList, conceptoInput.value, irpfInput.value, detallesInput.value, formaDePago.value);

      // Resolver la Promesa después de completar la operación
      resolve();
    } catch (error) {
      // Rechazar la Promesa si hay un error
      reject(error);
    }
  });
}

function changeDiscountPerProduct() {
  discountPerProduct = !discountPerProduct;

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


//Añade un nuevo producto
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
}

// Función para cargar las letras del abecedario en el selector
function loadLetters() {
  for (var letterCode = 65; letterCode <= 90; letterCode++) {
    var option = document.createElement("option");
    option.value = String.fromCharCode(letterCode);
    option.text = String.fromCharCode(letterCode);
    letterSelector.add(option);
  }
}

// Función asincrónica para cargar las personas en los selectores
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

async function loadPayMethods(){
  let payMethodsOptions = Array.from(formaDePago.options).map(option => option.value);

  // Cargar clientes
  let payMethods = await getAllPayMethods();
  payMethods.forEach((row) => {
    if (!payMethodsOptions.includes(row)) {
      var option = document.createElement("option");
      option.value = row.type;
      option.text = row.type;
      formaDePago.add(option);
      payMethodsOptions.push(row);  // Agregar la opción a la lista de opciones existentes
    }
  });
}

// Llamar a las funciones de carga al cargar la página
loadPayMethods();
loadLetters();
loadPersons();
newProduct();
