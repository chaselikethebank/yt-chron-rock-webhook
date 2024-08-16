const cron = require('node-cron');
const fetchYouTubeData = require('./fetch');  

// Schedule the cron job to run weekly
cron.schedule('*/10 * * * * *', () => {
  console.log('Running YouTube data fetch job...');
  fetchYouTubeData();
});
