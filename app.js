require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const { timestampFile } = require('./filePaths');
const RESET = '\x1b[0m';

require('./chron');

console.log('YouTube API Key:', process.env.YOUTUBE_API_KEY);

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

