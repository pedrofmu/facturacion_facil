const { readFile } = require('fs');
const { getSettingsPathAsync } = require("./getPath");


async function loadPossibleDB(){
  return new Promise(async (resolve, reject) => {
    const settingPath = await getSettingsPathAsync();
    readFile(settingPath, "utf8", (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      console.log(data);

      const settings = JSON.parse(data);

      const possibleDB = settings.possible_db;
      console.log(possibleDB);
      resolve(possibleDB);
    });
  });
} 

module.exports = {loadPossibleDB};
