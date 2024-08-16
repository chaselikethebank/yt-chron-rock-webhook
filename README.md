Here is the idea: 

Fetch Data Based on Date or Last Scheduled Cron
A. Using Timestamps
Store the Last Fetch Timestamp: You can store the timestamp of the last successful data fetch either in a file on your VM or as an environment variable.

Example: Create a JSON file (e.g., lastFetch.json) that stores the last fetch date and time.
Updating the Timestamp: After each successful data fetch, update this file with the current timestamp.
Fetch Data After This Timestamp: When your cron job runs, read the timestamp from this file and request only the videos uploaded after this date from the YouTube API.

YouTube API: Use the publishedAfter parameter in the YouTube API to fetch videos uploaded after the stored timestamp.
B. Using Cron Scheduling
Track Last Run Time: Instead of storing the timestamp, you could use the cron job's schedule to infer the last run time.
Fetch Data Since Last Run: Calculate the difference between the current time and the last scheduled run time and fetch data uploaded during this interval.
