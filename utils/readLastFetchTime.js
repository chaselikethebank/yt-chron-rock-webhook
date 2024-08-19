const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "../system_logs/logOfLastFetch.json");

function readLastFetchTime() {
  let lastFetchTime = null;
  if (fs.existsSync(logFilePath)) {
    const logData = JSON.parse(fs.readFileSync(logFilePath, "utf8"));
    lastFetchTime = new Date(logData.lastFetchTime);
  }
  return lastFetchTime;
}

module.exports = {
  readLastFetchTime
};
