const sqlite3 = require("sqlite3").verbose();

//Obiene la lista de las facturas como raw information
function getFacturas(filter) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
      }
    });

    let facturasList = [];

    db.all(`SELECT * FROM facturas`, [], (err, rows) => {
      if (err) {
        console.error("Error obteniendo las facturas");
        reject(err);
      }

      rows.forEach((row) => {
        facturasList.push(row);
      });

      db.close(async (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }

        const filteredData = await filterData(facturasList, filter);
        resolve(filteredData);
      });
    });
  });
}

async function filterData(rawData, filter) {
  return new Promise(async (resolve, reject) => {
    var filteredData = [];

    for (var factura of rawData) {
      const numNoLetra = Number(factura.numero.replace(/\D/g, ''));
      if (!(numNoLetra >= filter.numero1 && numNoLetra <= filter.numero2)) {
        continue;
      }

      const numLetra = String(factura.numero.replace(/\d/g, ''));

      if (filter.letra.length > 0) {
        if (!filter.letra.includes(numLetra)) {
          continue;
        }
      }

      if (filter.cliente.length > 0) {
        if (!filter.cliente.includes(numLetra)) {
          continue;
        }
      }

      var fecha = new Date(factura.fecha);
      if (!(fecha.getTime() >= filter.fecha1 && fecha.getTime() <= filter.fecha2)) {
        continue;
      }

      if (filter.concepto.length > 0) {
        if (!filter.concepto.includes(factura.concepto)) {
          continue;
        }
      }

      var unidadesInfo = await getUnidadesInfo(factura.unidades);
      if (!(unidadesInfo.bi >= filter.baseImponible1 && unidadesInfo.bi <= filter.baseImponible2)) {
        continue;
      }

      if (filter.iva.length > 0) {
        const found = unidadesInfo.ivas.some(elemento => filter.iva.includes(elemento));
        if (!found) {
          continue;
        }
      }


      console.log(factura.irpf);
      if (filter.irpf.length > 0) {
        if (!filter.irpf.includes(String(factura.irpf) + "%")) {
          continue;
        }
      }

      filteredData.push(factura);
    }

    resolve(filteredData);
  });
};

//Obtener el NIF de la persona
function getNIF(table, name) {
  return new Promise(async (resolve, reject) => {
    if (table !== "receptor" && table !== "emisor") {
      reject("tabla invalida al obtener le nif");
    }

    const db = new sqlite3.Database('./database/main.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(`Error al abrir la base de datos: ${err.message}`);
      }
    });

    var nif = "";

    db.get(`SELECT * FROM ${table} WHERE nombre LIKE "${name}"`, [], (err, row) => {
      if (err) {
        console.error("Error obteniendo las facturas");
        reject(err);
      }

      nif = row.id;
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }

      resolve(nif);
    });
  });
}

//Calcular la base imponible, el iva y la cuota
function getUnidadesInfo(facturas) {
  return new Promise((resolve, reject) => {
    try {
      var unidadesList = JSON.parse(facturas);

      var ivas = [];
      var baseImponible = 0;
      var cuota = 0;

      unidadesList.forEach((unidad) => {
        var cantidad = unidad.cantidad;
        var precioUnidad = unidad.precioUnidad;
        var iva = unidad.iva;
        var descuento = unidad.descuento;

        if (!ivas.includes(iva + "%")) {
          ivas.push(iva + "%");
        }

        var bi = cantidad * precioUnidad - (cantidad * precioUnidad * (descuento / 100));
        baseImponible += bi;
        cuota += bi * (iva / 100);
      });

      var returnInfo = {
        ivas: ivas,
        bi: baseImponible,
        cuota: cuota
      };

      resolve(returnInfo);
    } catch (error) {
      reject(error);
    }
  });
};

//Obtener la lista de facturas formateadas para el estandar de hacienda
function getFacturasStandarInfo(rawList) {
  return new Promise(async (resolve, reject) => {
    try {
      // Utilizamos map en lugar de forEach
      var returnInfo = await Promise.all(rawList.map(async (element) => {
        var nSerie = element.numero;
        var fecha = element.fecha;
        var nombre = element.receptor;
        var nif = await getNIF("receptor", nombre);

        var unidadesInfo = await getUnidadesInfo(element.unidades);

        var bi = unidadesInfo.bi;
        var tipo = unidadesInfo.ivas;
        var cuota = unidadesInfo.cuota;

        var facturaElement = {
          nSerie: nSerie,
          fecha: fecha,
          nombre: nombre,
          nif: nif,
          bi: bi,
          tipo: tipo,
          cuota: cuota
        };

        return facturaElement;
      }));

      resolve(returnInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function getFacturasStandarIRPFInfo(rawList) {
  return new Promise(async (resolve, reject) => {
    try {
      // Utilizamos map en lugar de forEach
      var returnInfo = await Promise.all(rawList.map(async (element) => {
        var nSerie = element.numero;
        var fecha = element.fecha;
        var nombre = element.receptor;
        var nif = await getNIF("receptor", nombre);

        var unidadesInfo = await getUnidadesInfo(element.unidades);

        var bi = unidadesInfo.bi;
        var tipo = unidadesInfo.ivas;
        var cuota = unidadesInfo.cuota;

        var irpf = bi * element.irpf;

        var facturaElement = {
          nSerie: nSerie,
          fecha: fecha,
          nombre: nombre,
          nif: nif,
          bi: bi,
          tipo: tipo,
          cuota: cuota,
          irpf: irpf
        };

        return facturaElement;
      }));

      resolve(returnInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function getFacturasInDefaultDB(rawList) {
  return new Promise(async (resolve, reject) => {
    try {
      // Utilizamos map en lugar de forEach
      var returnInfo = await Promise.all(rawList.map(async (element) => {
        var nSerie = element.numero;
        var fecha = element.fecha;
        var nombre = element.receptor;

        var unidadesInfo = await getUnidadesInfo(element.unidades);

        var bi = unidadesInfo.bi;
        var tipo = unidadesInfo.ivas;
        var cuota = unidadesInfo.cuota;

        var irpf = unidadesInfo.bi * element.irpf;

        var facturaElement = {
          nSerie: nSerie,
          fecha: fecha,
          nombre: nombre,
          unidades: element.unidades,
          concepto: element.concepto,
          bi: bi,
          tipo: tipo,
          cuota: cuota,
          irpf: irpf,
          formaPago: element.formaDePago
        };

        return facturaElement;
      }));

      resolve(returnInfo);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getFacturasStandarInfo, getFacturasStandarIRPFInfo, getFacturasInDefaultDB, getFacturas };
