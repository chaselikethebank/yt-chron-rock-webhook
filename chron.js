const cron = require('node-cron');
const fetchYouTubeData = require('./fetch-refactor');  

// Schedule the cron job to run weekly
cron.schedule('0 13 * * 2,5', () => {
  console.log('Running YouTube data fetch job...');
  fetchYouTubeData();

});


//  to run the job every Tuesday and Friday at 1:00 pm cst 
// 0 13 * * 2,5

// monday at 1:30 
// 30 13 * * 1

//every 10 seconds 
// */10 * * * * *