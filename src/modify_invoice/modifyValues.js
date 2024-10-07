const { getDBPath } = require('../manage_env/getPath');
const sqlite3 = require('sqlite3').verbose();

function modifyInvoice(invoiceID, receptor, emisor, fechaVencimiento, fechaEmision, unidades, concepto, irpf, detalles, formaDePago) {
    return new Promise(async (resolve, reject) => {
        const dbPath = await getDBPath();

        // Validación de parámetros de entrada
        if (!invoiceID || !receptor || !emisor || !fechaVencimiento || !unidades || !concepto || irpf == null || !detalles || !formaDePago) {
            reject("Rellena todos los datos correctamente.");
            return;
        }

        // Si la fecha de vencimiento está vacía, asigna "PENDIENTE"
        if (fechaVencimiento.length === 0) {
            fechaVencimiento = "PENDIENTE";
        }

        // Variables de cálculo
        let importeTotal = 0;
        let baseImponible = 0;
        let ivaAdd = 0;
        let ivas = [];

        // Calcular el importe total
        unidades.forEach((element) => {
            const cantidad = element.cantidad;
            const precioUnidad = element.precioUnidad;

            // Verificar si ya se ha añadido ese porcentaje de IVA
            if (!ivas.includes(`${element.iva}%`)) {
                ivas.push(`${element.iva}%`);
            }

            const iva = element.iva;
            const descuento = element.descuento || 0;

            // Calcular la base imponible y el IVA
            const bi = cantidad * precioUnidad - (cantidad * precioUnidad * (descuento / 100));
            baseImponible += bi;
            ivaAdd += bi * (iva / 100);
        });

        // Aplicar IRPF si corresponde
        if (irpf > 0) {
            importeTotal = baseImponible + ivaAdd - (baseImponible * (irpf / 100));
        } else {
            importeTotal = baseImponible + ivaAdd;
        }

        // Obtener datos del cliente y proveedor
        const clienteData = await getPersona("receptor", receptor);
        const proveedorData = await getPersona("emisor", emisor);

        // Crear el PDF de la factura
        let save = await createInvoicePDF(proveedorData, clienteData, invoiceID, fechaEmision, fechaVencimiento, unidades, baseImponible, baseImponible * irpf / 100, ivaAdd, ivas, importeTotal, formaDePago, detalles);

        if (!save) {
            reject("Selecciona una ubicación para guardar");
            return;
        }

        // Conexión a la base de datos SQLite
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(err.message);
                return;
            }
            console.log('Conexión exitosa a la base de datos SQLite');
        });

        // Consulta SQL para actualizar los valores de la factura excepto `numero`
        const sql = `
            UPDATE facturas 
            SET receptor = ?, 
                emisor = ?, 
                fechaVencimiento = ?, 
                unidades = ?, 
                concepto = ?, 
                importeTotal = ?, 
                irpf = ?, 
                detalles = ?, 
                formaDePago = ? 
            WHERE numero = ?
        `;

        // Ejecutar la consulta SQL con los valores proporcionados
        db.run(sql, [receptor, emisor, fechaVencimiento, JSON.stringify(unidades), concepto, importeTotal, irpf, detalles, formaDePago, invoiceID], function(err) {
            if (err) {
                reject(err.message);
                return;
            }
            resolve(`Se actualizó correctamente la factura con número: ${invoiceID}`);
        });

        // Cerrar la conexión a la base de datos
        db.close((err) => {
            if (err) {
                reject(err.message);
            }
        });
    });
}

module.exports = { modifyInvoice };

