const { utils, write } = require('xlsx');
const { writeFile } = require('fs');
const { ipcRenderer } = require('electron');

function saveXLSX(thElements, tableData) {
  const workbook = utils.book_new();

  // Crear matriz de datos para la hoja de cálculo
  const sheetData = [thElements];
  tableData.forEach(row => {
    const rowData = thElements.map(header => row[thElements.indexOf(header)]);
    sheetData.push(rowData);
  });

  // Convertir matriz de datos en hoja de cálculo
  const worksheet = utils.aoa_to_sheet(sheetData);
  utils.book_append_sheet(workbook, worksheet, 'Hoja1');

  // Escribir hoja de cálculo en un archivo
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
  ipcRenderer.send('open-file-dialog', 'xlsx', 'libro-de-registro');

  ipcRenderer.on('selected-file', (event, filePath) => {
    if (filePath) {
      // Convierte HTML a PDF y guarda el archivo en la ubicación seleccionada
      writeFile(filePath, excelBuffer, (err) => {
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
