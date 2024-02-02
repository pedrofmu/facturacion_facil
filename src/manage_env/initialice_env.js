const path = require('path');
const os = require('os');


function createConfigFolder(){
  const homeDir = os.homedir();
  const folderPath =  path.join(homeDir, ".facturacionfacil/"); 

  console.log(folderPath);
};

function initialiceDB(){

};

module.exports = {createConfigFolder, initialiceDB};
