const fs = require('fs');

function loadPossibleDB() {
  return new Promise((resolve, reject) => {
    fs.readFile("./database/.settings.json", "utf8", (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      const settings = JSON.parse(data);
      const possibleDB = settings.possible_db;
      resolve(possibleDB);
    });
  });
} 

module.exports = { loadPossibleDB };
