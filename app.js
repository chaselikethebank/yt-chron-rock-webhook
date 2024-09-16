require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { timestampFile } = require('./filePaths');

require('./chron');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.get('/', (req, res) => {
  let data = 'No data available.';

  if (fs.existsSync(timestampFile)) {
    data = fs.readFileSync(timestampFile, 'utf8');
  }

  res.send(`Halo, Whirled! Last fetch timestamp: ${data}`);
});

 

app.listen(PORT, () => {
  console.log(`🦌 Server running on port http://localhost:${PORT} 🦌`);
});

