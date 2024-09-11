require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { timestampFile } = require('./filePaths');
const { getDirectorySize } = require('./utils/getDirectorySize');  

require('./cron');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const MAX_SIZE_MB = 5000; // 5 GB in MB

app.get('/', (req, res) => {
  let data = 'No data available.';

  if (fs.existsSync(timestampFile)) {
    data = fs.readFileSync(timestampFile, 'utf8');
  }

  res.send(`Halo, Whirled! Last fetch timestamp: ${data}`);
});

//  app.get('/check-size', async (req, res) => {
//   try {
//     const sizeInBytes = await getDirectorySize(DATA_DIR);
//     const sizeInMB = sizeInBytes / (1024 * 1024);

//     if (sizeInMB > MAX_SIZE_MB) {
//       res.status(400).send('The directory size exceeds 5 GB.');
//     } else {
//       res.send(`The directory size is ${sizeInMB.toFixed(2)} MB.`);
//     }
//   } catch (error) {
//     res.status(500).send('Error calculating directory size.');
//   }
// });

app.listen(PORT, () => {
  console.log(`🦌 Server running on port http://localhost:${PORT} 🦌`);
});

