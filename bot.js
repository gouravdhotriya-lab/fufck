const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. Fake Web Server for Render ---
// This stops Render from shutting down the bot.
const app = express();
app.get('/', (req, res) => res.send('Minecraft Bot is running online!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// --- 2. Minecraft Bot Code ---
const bot = mineflayer.createBot({
  host: 'nl-01.freezehost.pro', // IMPORTANT: Change this to your real server IP
  port: 8425,              // Change this if your server uses a different port
  username: 'AntiAfkBot',   // The name your bot will use in the game
  version: false            // Automatically detects your Minecraft server version
});

// When the bot spawns in the world
bot.on('spawn', () => {
  console.log('Bot has successfully joined the Minecraft server!');
  
  // Anti-AFK: Make the bot jump every 10 seconds
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 1000); // Stop jumping after 1 second
  }, 10000);
});

// Log any errors so you can fix them
bot.on('error', (err) => {
  console.log('Bot Error: ', err);
});

// Tell you if the bot gets kicked or disconnected
bot.on('end', () => {
  console.log('Bot disconnected from the server.');
});
