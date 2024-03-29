const { readFile } = require('fs');
const fs = require('fs').promises;
const { join } = require('path');
const { homedir } = require('os');

//Impedir dependencias circulares
function getSettingsPathAsync() {
  return new Promise((resolve, reject) => {
    const homeDir = homedir();
    const folderPath = join(homeDir, ".facturacionfacil/");
    const settingsPath = join(folderPath, ".settings.json");
    resolve(settingsPath);
  });
}

async function loadPossibleDB() {
  return new Promise(async (resolve, reject) => {
    const settingPath = await getSettingsPathAsync();
    readFile(settingPath, "utf8", (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const settings = JSON.parse(data);

      const { current_database, possible_db } = settings;
      const currentIndex = possible_db.indexOf(current_database);
      const reorderedDBs = [
        possible_db[currentIndex], // Current DB first
        ...possible_db.slice(0, currentIndex), // Remaining before current DB
        ...possible_db.slice(currentIndex + 1) // Remaining after current DB
      ];

      resolve(reorderedDBs);
    });
  });
}

async function loadCurrectDB() {
  return new Promise(async (resolve, reject) => {
    const settingPath = await getSettingsPathAsync();
    readFile(settingPath, "utf8", (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const settings = JSON.parse(data);

      const possibleDB = settings.current_database;
      resolve(possibleDB);
    });
  });
}

function changeCurrentDB(database) {
  return new Promise(async (resolve, reject) => {
    try {
      const settingPath = await getSettingsPathAsync();
      const data = await fs.readFile(settingPath, "utf8");
      const settings = JSON.parse(data);

      // Actualiza el valor de current_database en el objeto settings
      settings.current_database = database;

      // Convierte el objeto settings actualizado de nuevo a JSON
      const updatedData = JSON.stringify(settings, null, 2);

      // Escribe los datos actualizados de vuelta al archivo
      await fs.writeFile(settingPath, updatedData, "utf8");

      // Indica que la operación se ha completado exitosamente
      resolve("Datos actualizados correctamente en el archivo .json");
    } catch (error) {
      // Rechaza la promesa con el mensaje de error
      reject(error.message);
    }
  });
}

function changeCurrentDB(database) {
  return new Promise(async (resolve, reject) => {
    try {
      const settingPath = await getSettingsPathAsync();
      const data = await fs.readFile(settingPath, "utf8");
      const settings = JSON.parse(data);

      // Actualiza el valor de current_database en el objeto settings
      settings.current_database = database;

      // Convierte el objeto settings actualizado de nuevo a JSON
      const updatedData = JSON.stringify(settings, null, 2);

      // Escribe los datos actualizados de vuelta al archivo
      await fs.writeFile(settingPath, updatedData, "utf8");

      // Indica que la operación se ha completado exitosamente
      resolve("Datos actualizados correctamente en el archivo .json");
    } catch (error) {
      // Rechaza la promesa con el mensaje de error
      reject(error.message);
    }
  });
}

async function addPossibleDB(newDB) {
  return new Promise(async (resolve, reject) => {
    try {
      const settingPath = await getSettingsPathAsync();
      const data = await fs.readFile(settingPath, "utf8");
      const settings = JSON.parse(data);

      // Verifica si la nueva base de datos ya existe en la lista
      if (!settings.possible_db.includes(newDB)) {
        settings.possible_db.push(newDB);
      } else {
        resolve("La base de datos ya existe en la lista de posibles bases de datos.");
        return;
      }

      await fs.writeFile(settingPath, JSON.stringify(settings, null, 2));
      resolve();
    } catch (error) {
      reject(error); 
    }
  });
}

async function removePossibleDB(dbToRemove) {
  return new Promise(async (resolve, reject) => {
    try {
      const settingPath = await getSettingsPathAsync();
      const data = await fs.readFile(settingPath, "utf8");
      const settings = JSON.parse(data);

      const index = settings.possible_db.indexOf(dbToRemove);
      if (index !== -1) {
        settings.possible_db.splice(index, 1);
      } else {
        resolve("La base de datos no existe en la lista de posibles bases de datos.");
        return;
      }

      await fs.writeFile(settingPath, JSON.stringify(settings, null, 2));
      resolve();
    } catch (error) {
      reject(error); 
    }
  });
}

module.exports = { loadPossibleDB, loadCurrectDB, changeCurrentDB, addPossibleDB, removePossibleDB };
