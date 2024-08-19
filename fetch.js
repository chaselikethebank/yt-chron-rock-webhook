require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const youtube = require("./youtubeClient");
const playlistConfig = require("./playlistConfig");
const { createDataDirectory } = require("./utils/createDataDirectory.js");
const { readLastFetchTime } = require("./utils/readLastFetchTime.js");
const { saveDataToFile } = require("./utils/saveDataToFile.js");
const { logLastFetchTime } = require("./utils/logLastFetchTime.js");

const logFilePath = path.join(__dirname, "system_logs", "logOfLastFetch.json");
const dataDir = path.join(__dirname, "data");

const rockRmsWebhookUrl = process.env.ROCK_RMS_WEBHOOK_URL;

async function fetchYouTubeData() {
  createDataDirectory();

  const lastFetchTime = readLastFetchTime();
  console.log("Date of last fetch from inside fetchYouTubeData():", lastFetchTime);

  const playlistIds = Object.values(playlistConfig);
  console.log(playlistIds);
  let allVideos = [];

  for (const playlistId of playlistIds) {
    let nextPageToken = null;

    do {
      const response = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      const videos = response.data.items.filter(video => {
        const publishedAt = new Date(video.snippet.publishedAt);
        console.log(lastFetchTime, ">", publishedAt);
        return !lastFetchTime || publishedAt > lastFetchTime;
      });

      allVideos = allVideos.concat(videos);
      console.log(allVideos);

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
  }

  if (allVideos.length > 0) {
    const now = new Date();
    const currentDateTime = now.toISOString().replace(/[:.]/g, "-");
    const filename = `youtubeCache_${currentDateTime}.json`;

    try {
      await axios.post(rockRmsWebhookUrl, allVideos);
      console.log('New YouTube data successfully sent to Rock RMS');
    } catch (error) {
      console.error('Error sending data to Rock RMS:', error);
    }

    try {
      saveDataToFile(dataDir, filename, allVideos, allVideos.length);
    } catch (error) {
      console.error('Error saving data to file:', error);
    }

    try {
      logLastFetchTime(logFilePath, now.toISOString());
    } catch (error) {
      console.error(error, "unable to log last fetch time");
    }
  } else {
    console.log("No new videos found since the last fetch.");
  }
}

module.exports = fetchYouTubeData;

