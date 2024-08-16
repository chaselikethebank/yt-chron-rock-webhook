Here is the idea: 

Fetch Data Based on Date or Last Scheduled Cron
Using Timestamps
Store the Last Fetch Timestamp; store the timestamp of the last successful data fetch after a successful webhook response.
To then check last logged against youtube's "publishedAfter" key value to check for new content at any cron term. 

For testing:

set cron term to 10 seconds
'*/10 * * * * *'

set logOfLastFetch to anytime in the past
"1970-01-01T00:00:00.000Z"

for testing purposes, I am also pushing all the data to a new file named {dateTime} to kind of eye ball, what playlists ids are logging and how many are there ect 
/Users/cdemaster/cd.t/yt-cron-rock-webhook/data/youtubeCache_2024-08-16.json

spinning up:

git clone https://github.com/chaselikethebank/yt-cron-rock-webhook

add your api key and the playlist id you are interested in logging into the .env file and delete "EXAMPLE" from the end of the file name
npm i
npm run start