const { getFacturasStandarInfo, getFacturasStandarIRPFInfo, getFacturasInDefaultDB, getFacturas } = require("../../record_book/getRecordBookInfo.js");
const { saveXLSX } = require("../../record_book/createXLSX.js");

const formatosSelector = document.getElementById("formatos_selector");

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

formatosSelector.addEventListener("click", async () => {
  refreshTable();
});

async function refreshTable() {
  document.getElementById("tabla_facturas").innerHTML = "";

  var selection = formatosSelector.value;

  var rawData = await getFacturas();
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
