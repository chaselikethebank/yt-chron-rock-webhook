// utils/fileOperations.js
const fs = require("fs");
const path = require("path");


const logLastFetchTime = (logFilePath, lastFetchTime) => {
  const logData = { lastFetchTime };
  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
};

module.exports = {

  logLastFetchTime
};
