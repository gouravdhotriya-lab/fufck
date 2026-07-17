const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. Fake Web Server for Render ---
const app = express();
app.get('/', (req, res) => res.send('Minecraft Bot is running online!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// --- 2. Minecraft Bot Code with Auto-Reconnect ---
function connectBot() {
  console.log('Connecting to the server...');

  const bot = mineflayer.createBot({
    host: 'nl-01.freezehost.pro', 
    port: 8425,              
    username: 'AntiAfkBot',   
    version: false            
  });

  // When the bot successfully joins the active world
  bot.on('spawn', () => {
    console.log('Bot has successfully joined the Minecraft server!');
    
    // Anti-AFK jumping
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 1000); 
    }, 10000);
  });

  // If the bot gets kicked (like when waking up the server)
  bot.on('end', (reason) => {
    console.log(`Bot disconnected. Reason: ${reason}`);
    console.log('Server might be waking up or offline. Retrying in 30 seconds...');
    
    // Wait 30 seconds, then try to connect again
    setTimeout(connectBot, 30000);
  });

  // Log errors without crashing the app
  bot.on('error', (err) => {
    console.log('Bot Error: ', err.message);
  });
}

// Start the bot for the first time
connectBot();
