const XLSX = require('xlsx');
const fs = require('fs');
const { ipcRenderer } = require('electron');

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
  ipcRenderer.send('open-file-dialog', 'xlsx', 'libro-de-registro');

  ipcRenderer.on('selected-file', (event, filePath) => {
    if (filePath) {
      // Convierte HTML a PDF y guarda el archivo en la ubicación seleccionada
      fs.writeFile(filePath, excelBuffer, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Archivo xlsx creado y guardado correctamente.');
        }
      });    
    } else {
      resolve(); 
    }
  });
}

module.exports = {saveXLSX};
