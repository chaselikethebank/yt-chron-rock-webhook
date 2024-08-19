const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");


function createDataDirectory() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log(`Data directory created at ${dataDir}`);
  }
}



module.exports = {
  createDataDirectory,

};
