const cron = require('node-cron');
const fetchAndUpdatePlaylistNames = require('./utils/writePlaylistConfig.js');
const fetchYouTubeData = require('./fetch-refactor');  

// Schedule the cron job to run at 2:30 PM from Monday to Friday
cron.schedule('30 14 * * 1,2,3,4,5', async () => {
  console.log('Running YouTube data fetch job at 2:30 PM...');
  
  try {
    await fetchAndUpdatePlaylistNames();
    await fetchYouTubeData();
  } catch (error) {
    console.error('Error running scheduled tasks:', error);
  }
});

// Schedule the cron job to run at 9:30 AM from Monday to Friday
cron.schedule('30 9 * * 1,2,3,4,5', async () => {
  console.log('Running YouTube data fetch job at 9:30 AM...');
  
  try {
    await fetchAndUpdatePlaylistNames();
    await fetchYouTubeData();
  } catch (error) {
    console.error('Error running scheduled tasks:', error);
  }
});

/*
Cron expressions are used to schedule tasks based on time. Here’s a breakdown of each field in a cron expression:

Field          Description                      Meaning
*              Minute                            The job will run at every minute.
*              Hour                              The job will run at every hour.
*              Day of Month                      The job will run every day of the month.
*              Month                             The job will run every month of the year.
2,5            Day of Week                       The job will run on specified days of the week.

Notes:
- `*` means "every" or "any" value for that field.
- Numbers specify specific values.
- Lists (e.g., `2,5`) specify multiple values.
- Ranges and other special characters can be used for more complex schedules.
*/

 
//every 10 seconds 
// */10 * * * * *