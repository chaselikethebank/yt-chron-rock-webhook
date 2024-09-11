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
    console.log('Environment Variables:', process.env);

    console.log('YouTube API Key:', process.env.YOUTUBE_API_KEY);

  // Iterate over each channel in the channelConfig
  for (const [key, channel] of Object.entries(channelConfig)) {
    console.log(`Fetching playlists for channel: ${channel.name} (${channel.id})`);

    try {
      // Log API key for debugging (remove in production)
      console.log('API Key:', process.env.YOUTUBE_API_KEY);

      // Fetch playlists from the channel
      const response = await youtube.playlists.list({
        part: 'snippet',
        channelId: channel.id,
        maxResults: 50000,
      });

      // Log the response for debugging
      console.log('Playlists response:', response.data);

      // Extract playlist IDs and names
      const playlists = response.data.items;
      let updated = false;

      for (const playlist of playlists) {
        const playlistId = playlist.id;
        const playlistName = playlist.snippet.title;

        if (!playlistConfig[playlistName]) {
          // If the playlist is not in the playlistConfig, add it
          playlistConfig[playlistName] = playlistId;
          updated = true;
          console.log(`New playlist found: ${playlistName} (${playlistId})`);
        }
      }

      if (updated) {
        // Save updated playlistConfig
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

