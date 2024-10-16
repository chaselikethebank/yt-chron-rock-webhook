require('dotenv').config();  
const { YOUTUBE_API_KEY } = require('../');

const fs = require('fs');
const path = require('path');
const youtube = require('../youtubeClient'); 
const { addPlaylistToRock } = require('../utils/addPlaylistToRock'); 
const GREEN = '\x1b[32m'; 
 
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';

// Paths to configuration files
const playlistConfigPath = path.join(__dirname, '../playlistConfig.js');
const channelConfigPath = path.join(__dirname, '../channelConfig.js');

// Load existing configurations
const playlistConfig = require(playlistConfigPath);
const channelConfig = require(channelConfigPath);

async function fetchAndUpdatePlaylistNames() {

  try {
    console.log(typeof addPlaylistToRock, "writePlaylistConfig.js");
    for (const [key, channel] of Object.entries(channelConfig)) {
      console.log(`${GREEN}Fetching playlists for channel${RESET}:${BLUE} ${channel.name} (${channel.id}) ${RESET}`);
      
      try {
        const response = await youtube.playlists.list({
          part: 'snippet',
          channelId: channel.id,
          maxResults: 50000,  
          key: YOUTUBE_API_KEY
        });
  
        const playlists = response.data.items;
        let newPlaylists = [];
  
        for (const playlist of playlists) {
          const playlistId = playlist.id;
          const playlistName = playlist.snippet.title;
  
          if (!playlistConfig[playlistName]) {
            playlistConfig[playlistName] = playlistId;
            newPlaylists.push({ name: playlistName, id: playlistId });
            console.log(`New playlist found: ${playlistName} (${playlistId})`);
          }
        }
  
        if (newPlaylists.length > 0) {
          // Send playlists to Rock RMS
          try {
            await addPlaylistToRock(newPlaylists);  // Passing an array of objects
            console.log('[writePlaylistConfig] Successfully send and returned from added playlists to Rock util.');
            
            // Write updated playlist config to file
            try {
              fs.writeFileSync(playlistConfigPath, `module.exports = ${JSON.stringify(playlistConfig, null, 2)};`);
              console.log('Updated playlistConfig file with new playlists.', newPlaylists);
            } catch (error) {
              console.error(`Error writing playlistConfig file:`, error.message);
            }
          } catch (error) {
            console.error(`Error sending playlists to Rock via writePlaylistConfig.js:`, error.message);
            console.error(error.stack);
          }
        } else {
          console.log(`${GREEN}No new playlists for ${RESET}: ${BLUE}${channel.name}${RESET}`);
        }
      } catch (error) {
        console.error(`${RED}Error fetching playlists for channel ${channel.name}${RESET}:`, error.response ? error.response.data : error.message);
      }
    }
  } catch (globalError) {
    console.error(`Global error in fetchAndUpdatePlaylistNames:`, globalError.message);
  }
}

// Execute the function
fetchAndUpdatePlaylistNames();

module.exports = fetchAndUpdatePlaylistNames;
