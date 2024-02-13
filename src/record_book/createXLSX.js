const XLSX = require('xlsx');
const fs = require('fs');

function saveXLSX(thElements, tableData) {
  const workbook = XLSX.utils.book_new();

  // Crear matriz de datos para la hoja de cálculo
  const sheetData = [thElements];
  tableData.forEach(row => {
    const rowData = thElements.map(header => row[thElements.indexOf(header)]);
    sheetData.push(rowData);
  });

  // Convertir matriz de datos en hoja de cálculo
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

  // Escribir hoja de cálculo en un archivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  const filePath = './prueba.xlsx';

  fs.writeFile(filePath, excelBuffer, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Archivo xlsx creado y guardado correctamente.');
    }
  });
}

module.exports = {saveXLSX};
