const fs = require('fs');
const path = require('path');
const moment = require('moment');

const filePath = path.join(__dirname, 'logOfLastFetch.json');

function logReadableDate() {
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    const date = new Date(data.lastFetchTime);
    const readableDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
    console.log(`The last fetch time was: ${readableDate}`);
}

logReadableDate();