const XLSX = require('xlsx');
const fs = require('fs');

function saveXLSX() {
  const workbook = XLSX.utils.book_new();
  const sheetData = [['Nombre', 'Edad'], ['John Doe', 30], ['Jane Doe', 25]];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

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
