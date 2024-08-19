// utils/fileOperations.js
const fs = require("fs");
const path = require("path");

const saveDataToFile = (dataDir, filename, data, allVideosArrayLength) => {
  const filePath = path.join(dataDir, filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`${allVideosArrayLength} videos successfully saved to ${filePath}`);
  } catch (error){
    console.error("Error saving data ", error);
  }
 
};

module.exports = {
  saveDataToFile,

};
