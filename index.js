const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
let abstract = require('./patternGen');

const TOKEN = process.env.TELEGRAM_TOKEN || '1193764845:AAGmeN1Oekg4u8fgqUHf3jeWLwY56b0-OAo';
// const bot = new TelegramBot(TOKEN, { polling: true });

const options = {
  webHook: {
    port: process.env.PORT || 3000
  }
};


const url = process.env.APP_URL || 'https://aipaints.herokuapp.com:443';

const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

bot.on('message', (msg) => {
  if (msg.text.toString().toLowerCase().indexOf("hi") === 0) {
    bot.sendMessage(msg.chat.id, "Hello dear user");
  }
  else {
    try {
      bot.sendMessage(msg.chat.id, `Dear User, Processing your request  `);
      let prop = JSON.parse(msg.text);
      let hei = prop.height <= 1024 ? prop.height : 1024;
      let wei = prop.width <= 1024 ? prop.width : 1024;

      cppn = new abstract({
        canvasID: 'canvas',
        width: hei,
        height: wei
      });

      cppn.saveHighResFrame("./new.png");
      const buffer = fs.createReadStream("./new.png");
      bot.sendPhoto(msg.chat.id, buffer);
    }
    catch {
    }
  }

});


bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Dear ${msg.from.first_name}, use \/make to fetch randomly generated cppn Abstract art or send a JSON with format {"width" :1040, "height" :1040} for custom resolution.. `);
});

bot.onText(/\/make/, (msg) => {

  cppn = new abstract({
    canvasID: 'canvas',
    height: 1080,
    width: 720
  });
  cppn.saveHighResFrame("./new.png");
  const buffer = fs.createReadStream("./new.png");
  bot.sendPhoto(msg.chat.id, buffer);
});
