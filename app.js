require('dotenv').config();  
const fs = require('fs');
const express = require('express');
const app = express();
const { timestampFile } = require('./filePaths');

require('./cron');

const PORT = process.env.PORT || 3000;

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
