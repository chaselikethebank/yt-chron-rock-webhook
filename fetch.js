require('dotenv').config();
const fs = require('fs');
const path = require('path');
const youtube = require('./youtubeClient');
const playlistConfig = require('./playlistConfig');

// Create 'data' directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

async function fetchYouTubeData() {
  const playlistIds = Object.values(playlistConfig);
  let allVideos = [];

  // Fetch videos from all playlists
  for (const playlistId of playlistIds) {
    let nextPageToken = null;

    do {
      const response = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      const videos = response.data.items;
      allVideos = allVideos.concat(videos);

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
  }

  // Get current date and time for the filename
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `youtubeCache_${currentDate}.json`;
  const filePath = path.join(dataDir, filename);

  // Write data to a new file in the 'data' folder
  fs.writeFileSync(filePath, JSON.stringify(allVideos, null, 2));
  console.log(`Data successfully saved to ${filePath}`);
}

module.exports = fetchYouTubeData;
