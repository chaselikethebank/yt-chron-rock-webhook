require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { timestampFile } = require('./filePaths');
const youtube = require('./youtubeClient');

async function fetchYouTubeData() {
  let lastFetchTime = new Date(0);

  if (fs.existsSync(timestampFile)) {
    try {
      const data = fs.readFileSync(timestampFile, 'utf8');
      const json = JSON.parse(data);
      lastFetchTime = new Date(json.lastFetchTime);
    } catch (error) {
      console.error('Error reading or parsing the timestamp file:', error);
    }
  }

  const currentTime = new Date();
  let dataFetched = false;
  let allVideos = [];
  let nextPageToken = null;

  try {
    do {
      const response = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: process.env.HARVEST_PLAYLIST_ID,
        maxResults: 50,
        publishedAfter: lastFetchTime.toISOString(),
        pageToken: nextPageToken
      });

      const videos = response.data.items;
      allVideos = allVideos.concat(videos);

      if (videos.length > 0) {
        console.log('Fetched videos:', videos);
        dataFetched = true;
      } else {
        console.log('No new videos found.');
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    if (dataFetched) {
      fs.writeFileSync(timestampFile, JSON.stringify({ lastFetchTime: currentTime }));
      console.log('Timestamp updated.');
    }
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
  }

  return allVideos;
}

module.exports = fetchYouTubeData;
