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
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';
const CYAN = `\x1b[95m`;
const RED = `\x1b[31m`;


const logFilePath = path.join(__dirname, "system_logs", "logOfLastFetch.json");
const dataDir = path.join(__dirname, "data");

const rockRmsWebhookContentChannelUrl = process.env.ROCK_RMS_WEBHOOK_CONTENT_CHANNEL_URL;

async function fetchYouTubeData() {
  createDataDirectory();

  const lastFetchTime = readLastFetchTime();
  console.log(
    `${CYAN} Date of last fetch from inside fetchYouTubeData()${RESET}:${RED},
    ${lastFetchTime}${RESET}`
  );

  const playlistEntries = Object.entries(playlistConfig);

  let allVideos = [];

  for (const [playlistName, playlistId] of playlistEntries) {
    let nextPageToken = null;
    // console.log(playlistEntries.playlistName, playlistEntries.playlistId,)
    do {
      try {
        const response = await youtube.playlistItems.list({
          part: "snippet",
          playlistId: playlistId, 
          maxResults: 50,
          pageToken: nextPageToken,
        });

        const videos = response.data.items.filter((video) => {
          const publishedAt = new Date(video.snippet.publishedAt);
          // console.log(lastFetchTime, ">", publishedAt);
          return !lastFetchTime || publishedAt > lastFetchTime;
        });

        allVideos = allVideos.concat(
          videos.map((video) => ({
            ...video,
            playlistName, 
          }))
         
        );
        
        nextPageToken = response.data.nextPageToken;
      } catch (error) {
        console.error(
          `Error fetching videos for playlist "${playlistName}":`,
          error
        );
      }
    } while (nextPageToken);
    // console.log(allVideos)
  }

  if (allVideos.length > 0) {
    // console.log("allVideos" + allVideos)
    const now = new Date();
    const currentDateTime = now.toISOString().replace(/[:.]/g, "-");
    const filename = `youtubeCache_${currentDateTime}.json`;

    try {
      for (const video of allVideos) {
        try {
          const videoData = {
            video: video.snippet,
            playlistName: video.playlistName,
              
          };

          const response = await axios.post(rockRmsWebhookContentChannelUrl, videoData);
          console.log(`${RESET}New Video Title:${BLUE} ${JSON.stringify(videoData.video.title, null, 2)}${RESET}`);
        } catch (error) {
          console.error(
            `Error sending video ${video.snippet.resourceId.videoId} from playlist "${video.playlistName}" to Rock RMS:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Error sending data to Rock RMS:", error);
    }

    try {
      saveDataToFile(dataDir, filename, allVideos, allVideos.length);
      console.log('on the save data to file step')
    } catch (error) {
      console.error("Error saving data to file:", error);
    }

    try {
      logLastFetchTime(logFilePath, now.toISOString());
    } catch (error) {
      console.error("Error logging last fetch time:", error);
    }
  } else {
    console.log(` ${YELLOW} No new videos found since the last fetch. ${RESET}`);
  }
}

module.exports = fetchYouTubeData;
