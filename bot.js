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
  console.log('Attempting to connect to the server...');

  const bot = mineflayer.createBot({
    host: 'nl-01.freezehost.pro', 
    port: 8425,              
    username: 'AntiAfkBot',   
    version: '1.20.1'  // CHANGE THIS to your exact server version (e.g., '1.19.4', '1.20.4', etc.)
  });

  // When the bot successfully joins the active world
  bot.on('spawn', () => {
    console.log('✅ Bot has successfully joined the Minecraft server!');
    
    // Anti-AFK jumping every 10 seconds
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 1000); 
    }, 10000);
  });

  // If the bot gets disconnected or kicked
  bot.on('end', (reason) => {
    console.log(`❌ Bot disconnected. Reason: ${reason}`);
    console.log('🔄 Server might be waking up. Retrying in 30 seconds...');
    
    // Wait 30 seconds, then try to reconnect
    setTimeout(connectBot, 30000);
  });

  // Log errors without stopping the app
  bot.on('error', (err) => {
    console.log('⚠️ Bot Error:', err.message);
  });

  // Log when bot is kicked by the server
  bot.on('kicked', (reason) => {
    console.log('🚪 Bot was kicked. Reason:', reason);
  });
}

// Start the bot for the first time
connectBot();
