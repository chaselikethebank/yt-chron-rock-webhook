const path = require('path');

const timestampFile = path.join(__dirname, 'logOfLastFetch.json');

module.exports = { timestampFile };