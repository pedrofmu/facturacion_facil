const { getFacturasStandarInfo, getFacturasStandarIRPFInfo, getFacturasInDefaultDB, getFacturas, getDataForFilterList } = require("../../record_book/getRecordBookInfo.js");
const { saveXLSX } = require("../../record_book/createXLSX.js");

const formatosSelector = document.getElementById("formatos_selector");

var filtro = {
  numero1: -Infinity,
  numero2: Infinity,
  letra: [],
  cliente: [],
  fecha1: -Infinity,
  fecha2: Infinity,
  concepto: [],
  baseImponible1: -Infinity,
  baseImponible2: Infinity,
  //IVA y irpf van con el porcentaje "*%"
  iva: [],
  irpf: []
};

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

formatosSelector.addEventListener("click", async () => {
  refreshTable();
});

document.getElementById("guardar_btn").addEventListener("click", async () => {
  try {
    await saveTable();
    alert("Se ha guardado correctamente el xlsx");
  } catch (error) {
    alert(error);
  }
});

document.getElementById("filtro-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  filtro = await getFilterData();
  refreshTable();
});

function getFilterData() {
  return new Promise(async (resolve, reject) => {
    var newFiltro = {
      numero1: await obtenerValorInfinito(document.getElementById('numero1').value, true),
      numero2: await obtenerValorInfinito(document.getElementById('numero2').value, false),
      letra: await obtenerValorLista("letra"),
      cliente: await obtenerValorLista("cliente"),
      fecha1: await obtenerValorInfinito((new Date(document.getElementById('fecha1').value)).getTime(), true),
      fecha2: await obtenerValorInfinito((new Date(document.getElementById('fecha2').value)).getTime(), false),
      concepto: await obtenerValorLista("concepto"),
      baseImponible1: await obtenerValorInfinito(document.getElementById('baseImponible1').value, true),
      baseImponible2: await obtenerValorInfinito(document.getElementById('baseImponible2').value, false),
      iva: await obtenerValorLista("iva"),
      irpf: await obtenerValorLista("irpf")
    };

    console.log(filtro);
    resolve(newFiltro);
  });
};

function obtenerValorInfinito(valor, esNumero1) {
  return new Promise((resolve, reject) => {
    if (valor === '') {
      resolve(esNumero1 ? -Infinity : Infinity);
    } else {
      var valorParseado = parseFloat(valor);
      resolve(isNaN(valorParseado) ? (esNumero1 ? -Infinity : Infinity) : valorParseado);
    }
  });
}

function obtenerValorLista(valor) {
  return new Promise((resolve, reject) => {
    const container = document.getElementById(`active_selection_${valor}`);
    const selections = container.getElementsByTagName("div");

    // Convertimos la colección a un array
    const selectionsArray = Array.from(selections);

    var returnData = [];
    selectionsArray.forEach((element) => {
      var value = element.getElementsByTagName("label")[0].innerHTML;
      returnData.push(value);
    });

    resolve(returnData);
  });
}

async function refreshTable() {
  document.getElementById("tabla_facturas").innerHTML = "";

  var selection = formatosSelector.value;

  var rawData = await getFacturas(filtro);
  switch (selection) {
    case "standar":
      var formatedData = await getFacturasStandarInfo(rawData);
      loadDataInStandarMode(formatedData);
      break;
    case "standarIRPF":
      var formatedData = await getFacturasStandarIRPFInfo(rawData);
      loadDataInStandarIRPFMode(formatedData);
      break;
    case "defaultDB":
      var formatedData = await getFacturasInDefaultDB(rawData);
      loadDataInDefaultDB(formatedData);
      break;
  }
}

//
//const tableData = [
//  [1, "2024-02-13", "John Doe", "123456789A", 100.00, "Normal", 21.00, 5.00],
//  [2, "2024-02-14", "Jane Doe", "987654321B", 150.00, "Reducido", 10.00, 0.00],
//  // Agrega más filas según sea necesario
//];

async function saveTable() {
  return new Promise(async (resolve, reject) => {
    try {
      const thElements = [];
      var tabla = document.getElementById("tabla_facturas");
      var filas = tabla.rows;

      // Iterar sobre la primera fila (encabezados) y agregarlos a la lista
      var encabezados = filas[0].cells;
      for (var i = 0; i < encabezados.length; i++) {
        var valorEncabezado = encabezados[i].textContent;
        thElements.push(valorEncabezado);
      }

      var selection = formatosSelector.value;

      var rawData = await getFacturas(filtro);
      switch (selection) {
        case "standar":
          var formatedData = await getFacturasStandarInfo(rawData);
          var data = [];
          formatedData.forEach((element) => {
            const arrayElement = Object.values(element);
            data.push(arrayElement);
          });
          await saveXLSX(thElements, data);
          break;
        case "standarIRPF":
          var formatedData = await getFacturasStandarIRPFInfo(rawData);
          var data = [];
          formatedData.forEach((element) => {
            const arrayElement = Object.values(element);
            data.push(arrayElement);
          });
          await saveXLSX(thElements, data);
          break;
        case "defaultDB":
          var formatedData = await getFacturasInDefaultDB(rawData);
          var data = [];
          formatedData.forEach((element) => {
            const arrayElement = Object.values(element);
            data.push(arrayElement);
          });
          await saveXLSX(thElements, data);
          break;
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function toggleSelection(div, type) {
  var parent = div.parentNode;
  var inactiveDIV = document.getElementById(`inactive_selection_${type}`);
  var activeDIV = document.getElementById(`active_selection_${type}`);

  // Cambiar de contenedor
  if (parent.classList.contains("active_selection")) {
    inactiveDIV.appendChild(div);
    div.getElementsByTagName("button")[0].innerHTML = "✔️";
  } else {
    activeDIV.appendChild(div);
    div.getElementsByTagName("button")[0].innerHTML = "✖️";
  }
}

function createListElements(values, type) {
  const container = document.getElementById(`inactive_selection_${type}`);
  // Limpiar el contenedor de elementos inactivos
  container.innerHTML = "";

  // Crear elementos inactivos con los valores proporcionados
  values.forEach(function(value) {
    var div = document.createElement("div");
    var label = document.createElement("label");
    label.textContent = value;
    var button = document.createElement("button");
    button.textContent = "✔️";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleSelection(div, type);
    });
    div.appendChild(label);
    div.appendChild(button);
    container.appendChild(div);
  });
}

async function loadListFilter() {
  var data = await getDataForFilterList();
  console.log(data);
  //Inicializar letra
  createListElements(data.letras, "letra");

  //Inicializa cliente
  createListElements(data.clientes, "cliente");

  //Inicializar concepto 
  createListElements(data.conceptos, "concepto");

  //Inicializar iva
  createListElements(data.ivas, "iva");

  //Inicializar irpf
  createListElements(data.irpfs, "irpf");
}

function loadOptions() {
  var option1 = document.createElement("option");
  option1.value = "standar";
  option1.text = "Standar";

  var option2 = document.createElement("option");
  option2.value = "standarIRPF";
  option2.text = "Standar + IRPF";

  var option3 = document.createElement("option");
  option3.value = "defaultDB";
  option3.text = "Base de datos";

  formatosSelector.appendChild(option1);
  formatosSelector.appendChild(option2);
  formatosSelector.appendChild(option3);
}

async function loadDataInDefaultDB(invoicesList) {
  var tabla = document.getElementById("tabla_facturas");

  // Crear los elementos <th> primero
  var thElements = [
    "Nº serie",
    "Fecha de expedición",
    "Nombre",
    "Unidades",
    "Concepto",
    "Base Imponible",
    "Cuota (IVA)",
    "Retenido IRPF",
    "Forma de pago"
  ];

  var trHeader = document.createElement("tr");
  thElements.forEach(text => {
    var th = document.createElement("th");
    th.textContent = text;
    trHeader.appendChild(th);
  });
  tabla.appendChild(trHeader);

  invoicesList.forEach((element) => {
    var newFacturaEntry = document.createElement("tr");

    var nSerie = document.createElement("td");
    nSerie.innerHTML = element.nSerie;

    var fecha = document.createElement("td");
    fecha.innerHTML = element.fecha;

    var nombre = document.createElement("td");
    nombre.innerHTML = element.nombre;

    var unidades = document.createElement("td");
    unidades.innerHTML = element.unidades;

    var concepto = document.createElement("td");
    concepto.innerHTML = element.concepto;

    var bi = document.createElement("td");
    bi.innerHTML = Number(element.bi).toFixed(2) + "€";

    var tipo = document.createElement("td");
    tipo.innerHTML = element.tipo.join(' ');

    var cuota = document.createElement("td");
    cuota.innerHTML = Number(element.cuota).toFixed(2) + "€";

    var retenidoIRPF = document.createElement("td");
    retenidoIRPF.innerHTML = Number(element.irpf).toFixed(2) + "€";

    var formaDePago = document.createElement("td");
    formaDePago.innerHTML = element.formaPago;

    newFacturaEntry.appendChild(nSerie);
    newFacturaEntry.appendChild(fecha);
    newFacturaEntry.appendChild(nombre);
    newFacturaEntry.appendChild(unidades);
    newFacturaEntry.appendChild(concepto);
    newFacturaEntry.appendChild(bi);
    newFacturaEntry.appendChild(cuota);
    newFacturaEntry.appendChild(retenidoIRPF);
    newFacturaEntry.appendChild(formaDePago);

    tabla.appendChild(newFacturaEntry);
  });
}

//Carga los datos en el formato de Hacienda + el IRPF
async function loadDataInStandarIRPFMode(invoicesList) {
  var tabla = document.getElementById("tabla_facturas");

  // Crear los elementos <th> primero
  var thElements = [
    "Nº serie",
    "Fecha de expedición",
    "Nombre",
    "NIF",
    "Base imponible",
    "Tipo (IVA)",
    "Cuota",
    "Retenido IRPF"
  ];

  var trHeader = document.createElement("tr");
  thElements.forEach(text => {
    var th = document.createElement("th");
    th.textContent = text;
    trHeader.appendChild(th);
  });
  tabla.appendChild(trHeader);

  invoicesList.forEach((element) => {
    var newFacturaEntry = document.createElement("tr");

    var nSerie = document.createElement("td");
    nSerie.innerHTML = element.nSerie;

    var fecha = document.createElement("td");
    fecha.innerHTML = element.fecha;

    var nombre = document.createElement("td");
    nombre.innerHTML = element.nombre;

    var nif = document.createElement("td");
    nif.innerHTML = element.nif;

    var bi = document.createElement("td");
    bi.innerHTML = Number(element.bi).toFixed(2) + "€";

    var tipo = document.createElement("td");
    tipo.innerHTML = element.tipo.join(' ');

    var cuota = document.createElement("td");
    cuota.innerHTML = Number(element.cuota).toFixed(2) + "€";

    var retenidoIRPF = document.createElement("td");
    retenidoIRPF.innerHTML = Number(element.irpf).toFixed(2) + "€";

    newFacturaEntry.appendChild(nSerie);
    newFacturaEntry.appendChild(fecha);
    newFacturaEntry.appendChild(nombre);
    newFacturaEntry.appendChild(nif);
    newFacturaEntry.appendChild(bi);
    newFacturaEntry.appendChild(tipo);
    newFacturaEntry.appendChild(cuota);
    newFacturaEntry.appendChild(retenidoIRPF);

    tabla.appendChild(newFacturaEntry);
  });
}

//Carga los datos en el modo standar (Listo para enviar a hacienda) 
async function loadDataInStandarMode(invoicesList) {
  var tabla = document.getElementById("tabla_facturas");

  // Crear los elementos <th> primero
  var thElements = [
    "Nº serie",
    "Fecha de expedición",
    "Nombre",
    "NIF",
    "Base imponible",
    "Tipo (IVA)",
    "Cuota"
  ];

  var trHeader = document.createElement("tr");
  thElements.forEach(text => {
    var th = document.createElement("th");
    th.textContent = text;
    trHeader.appendChild(th);
  });
  tabla.appendChild(trHeader);

  invoicesList.forEach((element) => {
    var newFacturaEntry = document.createElement("tr");

    var nSerie = document.createElement("td");
    nSerie.innerHTML = element.nSerie;

    var fecha = document.createElement("td");
    fecha.innerHTML = element.fecha;

    var nombre = document.createElement("td");
    nombre.innerHTML = element.nombre;

    var nif = document.createElement("td");
    nif.innerHTML = element.nif;

    var bi = document.createElement("td");
    bi.innerHTML = Number(element.bi).toFixed(2) + "€";

    var tipo = document.createElement("td");
    tipo.innerHTML = element.tipo.join(' ');

    var cuota = document.createElement("td");
    cuota.innerHTML = Number(element.cuota).toFixed(2) + "€";

    newFacturaEntry.appendChild(nSerie);
    newFacturaEntry.appendChild(fecha);
    newFacturaEntry.appendChild(nombre);
    newFacturaEntry.appendChild(nif);
    newFacturaEntry.appendChild(bi);
    newFacturaEntry.appendChild(tipo);
    newFacturaEntry.appendChild(cuota);

    tabla.appendChild(newFacturaEntry);
  });
}



loadOptions();
refreshTable();
loadListFilter();
