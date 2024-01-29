// Importar funciones necesarias
const { saveInvoice } = require('../../create_invoices/new_invoice');
const { getPersonas } = require('../../create_invoices/connect_db');
const { ipcRenderer } = require('electron');

// Obtener elementos del DOM
const fechaInput = document.getElementById("fecha_input");
const letterSelector = document.getElementById("letra_selector");
const formaDePago = document.getElementById("forma_de_pago");
const irpfInput = document.getElementById("irpf");
const detallesInput = document.getElementById("datos_extras");
const proveedorSelector = document.getElementById("proveedor_selector"); 
const clienteSelector = document.getElementById("cliente_selector");

//Manejar el click de crear un cliente nuevo
document.getElementById("nuevo_cliente_btn").addEventListener("click", () => {
   ipcRenderer.send('open-new-window', "receptor");
});

//Maneje el click de crear un proveedor nuevo
document.getElementById("nuevo_provedor_btn").addEventListener("click", () => {
  ipcRenderer.send('open-new-window', "emisor");});

// Manejar clic en el botón de guardar factura
document.getElementById("guardar_btn").addEventListener("click", () => {
  var unitElements = document.querySelectorAll(".unidades");
  var unitsList = [];

  unitElements.forEach(element => {
    // Obtener los valores de los inputs dentro de cada li
    var cantidad = element.querySelector('input:nth-child(1)').value;
    var tipo = element.querySelector('input:nth-child(2)').value;
    var precioUnidad = element.querySelector('input:nth-child(3)').value;
    var iva = element.querySelector('input:nth-child(4)').value;

    // Crear un objeto con los datos y agregarlo a la lista
    var unitData = {
      cantidad: cantidad,
      tipo: tipo,
      precioUnidad: precioUnidad,
      iva: iva
    };

    unitsList.push(unitData);
  });

  // Llamar a la función para crear una nueva factura
  saveInvoice(letterSelector.value, clienteSelector.value, proveedorSelector.value, fechaInput.value, unitsList, irpfInput.value, detallesInput.value, formaDePago.value);
});

// Manejar clic en el botón de añadir nueva unidad
document.getElementById("add_unidad_btn").addEventListener("click", () => {
  var unitsContainer = document.getElementById("unidades_container");

  var newProduct = document.createElement("li");
  newProduct.className = "unidades";

  for (var i = 0; i < 4; i++) {
    var newInput = document.createElement("input");
    newInput.type = i === 0 || i === 2 || i === 3 ? "number" : "text";
    newInput.placeholder = i === 0 ? "cantidad" : (i === 1 ? "tipo" : (i === 2 ? "precio unidad" : "iva"));

    // Agregar el input al li
    newProduct.appendChild(newInput);
  }

  unitsContainer.appendChild(newProduct);
});

document.getElementById("remove_unidad_btn").addEventListener("click", () => {
  var unitsContainer = document.getElementById("unidades_container");
  var lastProduct = unitsContainer.lastElementChild;

  if (lastProduct){
    unitsContainer.removeChild(lastProduct);
  }
});

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

clienteSelector.addEventListener("focus", () => {
  loadPersons();
});

proveedorSelector.addEventListener("focus", () => {
  loadPersons();
});

// Llamar a las funciones de carga al cargar la página
loadLetters();
loadPersons();
