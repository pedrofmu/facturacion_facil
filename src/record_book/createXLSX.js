
const ExcelJS = require('exceljs');
const { writeFile } = require('fs');
const { ipcRenderer } = require('electron');

async function saveXLSX(thElements, tableData) {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();

    // Crear matriz de datos para la hoja de cálculo
    const sheetData = [thElements];
    tableData.forEach(row => {
      // Reemplazar <br> por \n si hay más caracteres después de <br>, de lo contrario, por un espacio en blanco
      const rowData = thElements.map(header => {
        let cellData = row[thElements.indexOf(header)];
        if (typeof cellData === 'string') {
          cellData = cellData.replace(/<br\s*\/?>(\s*\S+)?/gi, (match, group) => group ? '\n' + group : ' ');
        }
        return cellData;
      });
      sheetData.push(rowData);
    });

    // Agregar una nueva hoja de cálculo al libro de trabajo
    const worksheet = workbook.addWorksheet('Hoja1');
    worksheet.addRows(sheetData);

    // Aplicar bordes negros oscuros a todas las celdas
    const allCells = worksheet.getCell('A1').address + ':' + worksheet.getCell(worksheet.rowCount, worksheet.columns.length).address;
    const allBorderStyles = {
      style: 'thin',
      color: { argb: 'FF000000' } // Código de color para negro oscuro
    };
    worksheet.getCell(allCells).border = {
      top: allBorderStyles,
      left: allBorderStyles,
      bottom: allBorderStyles,
      right: allBorderStyles
    };

    // Ajustar automáticamente el ancho y el alto de las celdas
    worksheet.columns.forEach((column, columnIndex) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10; // Assuming default width of 10 if cell is empty
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength; // Set minimum width to 10

      // Adjust row heights based on cell content
      worksheet.getColumn(columnIndex + 1).eachCell((cell, rowNumber) => {
        const currentHeight = worksheet.getRow(rowNumber).height || 15; // Default height is 15
        const desiredHeight = Math.ceil((cell.value.toString().length * 1.25) / column.width); // Adjust this factor as needed
        worksheet.getRow(rowNumber).height = Math.max(currentHeight, desiredHeight);
      });
    });

    // Escribir hoja de cálculo en un archivo
    const excelBuffer = workbook.xlsx.writeBuffer()
      .then(buffer => {
        ipcRenderer.send('open-file-dialog', 'xlsx', 'libro-de-registro');

        ipcRenderer.on('selected-file', (event, filePath) => {
          if (filePath) {
            // Guardar el archivo en la ubicación seleccionada
            writeFile(filePath, buffer, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve('Archivo xlsx creado y guardado correctamente.');
              }
            });
          } else {
            reject("Selecciona un lugar para guardar el archivo");
          }
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = { saveXLSX };
