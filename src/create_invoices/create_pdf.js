const { ipcRenderer } = require('electron');
const path = require('path');
const pdf = require('html-pdf');

function createInvoicePDF(){
return new Promise((resolve, reject) => {
  const htmlRendering = '<html><body><h1>Hello, World!</h1></body></html>';

  const pdfOptions = {
    format: 'Letter', 
    base: 'file://' + path.join(__dirname), 
  };

  ipcRenderer.send('open-file-dialog');

  ipcRenderer.on('selected-file', (event, filePath) => {
    if (filePath) {
      // Convierte HTML a PDF y guarda el archivo en la ubicación seleccionada
      pdf.create(htmlRendering, pdfOptions).toFile(filePath, (err, res) => {
        if (err) reject(err);
        console.log(res); // Información sobre el archivo generado
      });
    } else {
      resolve(); 
    }
  });
});
};

module.exports = { createInvoicePDF };
