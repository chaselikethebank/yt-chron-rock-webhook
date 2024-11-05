const addPlaylistsToRock = require('./addPlaylistToRock');

// Test data
const testPlaylists = [
    { name: 'Test Playlist 1', id: 'PL12345' },
    { name: 'Test Playlist 2', id: 'PL67890' }
];

// Call the function with test data
addPlaylistsToRock(testPlaylists);