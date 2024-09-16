# YouTube Cron Webhook Fetcher

## Overview

This project is designed to fetch YouTube data based on the last scheduled cron job and store the timestamp of the last successful data fetch. By using timestamps, it ensures that only new content is retrieved by filtering against the publishedAfter snippet offered by YouTube's API against the last fetch timestamp to determine if there is new content available.

## Features

- **Scheduled Fetching**: Runs at defined intervals to check for new content.
- **Timestamp-Based Filtering**: Only fetches content published after the last successful fetch.
- **Webhook Integration**: Logs and processes new content using a Rock RMS webhook.

## Setup Instructions

### 1. Clone the Repository

bash
git clone https://github.com/chaselikethebank/yt-cron-rock-webhook


bash
cd yt-cron-rock-webhook



### 2. private keys and urls 

add your api key and check the rock webhook url in the dotenv

# youtube api key
YOUTUBE_API_KEY= 

# Rock rms endpoint

ROCK_RMS_WEBHOOK_URL=https://www.something.org/youtube-cache


### 3 Testing

for testing purposes, I have set the cron term to cycle every 10 seconds
'*/10 * * * * *'

for testing set system_logs/logOfLastFetch.json to anytime in the past for new content to pass the filter and log data
this is a good date to use: "2004-08-19T19:22:31.602Z"

### 4 Spinning up:

bash
npm i


bash
npm run start


### 5 Did I win?! 

check the console, the log of last fetch and the data directory => rock rms 


### Prudiction  comands

I have pm2 running the production server 

to set the list
```
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u thewoodlandsumc --hp /home/thewoodlandsumc
```
to save the list setting
```
pm2 save
```
to launch the production server w restarts on failing
```
pm2 startup
```
restart all
```
pm2 restart all

```
double check it is running 
```
pm2 status (should print you a table w green "status: online")
```
