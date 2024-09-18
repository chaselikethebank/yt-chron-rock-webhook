require('dotenv').config();  

const fs = require('fs');
const path = require('path');
const youtube = require('../youtubeClient'); 



// Path to the configuration files
const playlistConfigPath = path.join(__dirname, '../playlistConfig.js');
const channelConfigPath = path.join(__dirname, '../channelConfig.js');

// Load and parse the existing configurations
const playlistConfig = require(playlistConfigPath);
const channelConfig = require(channelConfigPath);

async function fetchAndUpdatePlaylistNames() {
    // console.log('Environment Variables:', process.env);

    // console.log('YouTube API Key:', process.env.YOUTUBE_API_KEY);

  for (const [key, channel] of Object.entries(channelConfig)) {
    console.log(`Fetching playlists for channel: ${channel.name} (${channel.id})`);

    try {
      console.log('API Key:', process.env.YOUTUBE_API_KEY);

      const response = await youtube.playlists.list({
        part: 'snippet',
        channelId: channel.id,
        maxResults: 50000,
      });

      console.log('Playlists response:', response.data);

      const playlists = response.data.items;
      let updated = false;

      for (const playlist of playlists) {
        const playlistId = playlist.id;
        const playlistName = playlist.snippet.title;

        if (!playlistConfig[playlistName]) {
          playlistConfig[playlistName] = playlistId;
          updated = true;
          console.log(`New playlist found: ${playlistName} (${playlistId})`);
        }
      }

      if (updated) {
        fs.writeFileSync(playlistConfigPath, `module.exports = ${JSON.stringify(playlistConfig, null, 2)};`);
        console.log('Updated playlistConfig file with new playlists.');
      } else {
        console.log('No new playlists found for this channel.');
      }
    } catch (error) {
      console.error(`Error fetching playlists for channel ${channel.name}:`, error.response ? error.response.data : error.message);
    }
  }
}

fetchAndUpdatePlaylistNames();

