const axios = require('axios');

async function addPlaylistsToRock(playlists) {
    try {
        // Log playlists to console
        console.log('Playlists to be sent:', playlists);

        // Ensure the webhook URL is set in your environment variables
        const webhookUrl = process.env.ROCK_RMS_WEBHOOK_PLAYLIST;
        if (!webhookUrl) {
            throw new Error('ROCK_RMS_WEBHOOK_PLAYLIST environment variable is not set.');
        }

        // Make POST request to Rock RMS
        const response = await axios.post(webhookUrl, { playlists });
        console.log('Response from Rock RMS:', response.data);

    } catch (error) {
        console.error('Error sending playlists to Rock:', error.message);
        throw error; // Ensure errors are thrown so they can be caught where the function is called
    }
}

module.exports = addPlaylistsToRock;

