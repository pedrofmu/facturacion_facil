const { getFacturasStandarInfo } = require("../../record_book/getRecordBookInfo.js"); 

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

//         <th>Nº serie</th>
//         <th>Fecha de expedición</th>
//         <th>Nombre</th>
//         <th>NIF</th>
//         <th>Base imponible</th>
//         <th>Tipo (IVA)</th>
//         <th>Cuota</th>

async function initialLoad(){
    let invoicesList = await getFacturasStandarInfo();

    var tabla = document.getElementById("tabla_facturas"); 
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
        bi.innerHTML = element.bi;

        var tipo = document.createElement("td");
        tipo.innerHTML = element.tipo;

        var cuota = document.createElement("td");
        cuota.innerHTML = element.cuota;
        
        newFacturaEntry.appendChild(nSerie);
        newFacturaEntry.appendChild(fecha);
        newFacturaEntry.appendChild(nombre);
        newFacturaEntry.appendChild(nif);
        newFacturaEntry.appendChild(bi);
        newFacturaEntry.appendChild(tipo);
        newFacturaEntry.appendChild(cuota);

        tabla.appendChild(newFacturaEntry);
    });
};

initialLoad();
