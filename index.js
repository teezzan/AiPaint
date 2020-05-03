

const fs = require('fs');
const request = require('request');
var abstract = require('./patternGen');

//const port = process.env.PORT || 3000;
const deepai = require('deepai');
const apidai = process.env.TOKEN_DPAI || 'd445b643-fb85-4816-ac2d-95a0e660fe81';
deepai.setApiKey(apidai);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const TelegramBot = require('node-telegram-bot-api');
//const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

const TOKEN = process.env.TELEGRAM_TOKEN || '1193764845:AAGmeN1Oekg4u8fgqUHf3jeWLwY56b0-OAo';
//const bot = new TelegramBot(token, { polling: true });

const options = {
  webHook: {
    port: process.env.PORT
    }
};


const url = process.env.APP_URL || 'https://aipaints.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);





var idlist =[];
var url1 = "";
var url2 = "";
var urllink = `https://archillect.com/${randomint(1000, 30082)}`;
var imglink = "";
var master="";
var cppn = abstract.cppn;
// console.log(urllink);

function randomint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function feapi(markup) {
  var url;
  const dom = new JSDOM(markup);
  url = dom.window.document.getElementById("ii").src;
  console.log(dom.window.document.getElementById("ii").src);
  return url;
}

const getPage = (cb) => {
  request(urllink, {
    timeout: 3000
  }, (error, response, body) => {
    if (!error) {
      url1 = feapi(body);
      console.log(url1);
    }
  });
};
const getPage2 = (cb) => {
  var urllink = `https://archillect.com/${randomint(1000, 30082)}`;
  request(urllink, {
    timeout: 3000
  }, (error, response, body) => {
    if (!error) {
      url2 = feapi(body);
    }
  });
};


function getimage(id) {
  urllink = `https://archillect.com/${randomint(1000, 30082)}`;
  getPage();
  getPage2();
  console.log("hshhh", url2);
  setTimeout(() => {
    (async function () {
      var resp = await deepai.callStandardApi("CNNMRF", {
        content: url1,
        style: url2, // fs.createReadStream("./img.png"),
      });
      console.log(resp);
      bot.sendPhoto(id,resp.output_url);
      bot.sendPhoto(master,resp.output_url);
    })().catch(() => { 
      console.log("here");
      bot.sendMessage(id, "error");

   })
  }, 7000);
}



bot.on('message', (msg) => {

  var Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, "Hello dear user");
  }

});

bot.onText(/\/getpic/, (msg) => {

  bot.sendMessage(msg.chat.id, `Processing your Request, ${msg.from.first_name}.`);
  bot.sendMessage(master, `${msg.from.first_name}`);
  getimage(msg.chat.id);
});
bot.onText(/\/enroll/, (msg) => {
  if(idlist.includes(msg.chat.id)){
    bot.sendMessage(msg.chat.id, `Your are already a subscriber`);
  }
  else{
  bot.sendMessage(msg.chat.id, `Processing your Request, ${msg.from.first_name}.`);
  idlist.push(msg.chat.id);
  // console.log(idlist)
  bot.sendMessage(msg.chat.id, `Now, you will receive daily update of my paintings. `);}
});


bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, `Dear ${msg.from.first_name}, use \/getpic to fetch randomly generated pictures. `);
});

bot.onText(/\/starxz/, (msg) => {
  //master = msg.chat.id;
  bot.sendMessage(msg.chat.id, `Dear ${msg.chat.id}, you're master `);
  bot.sendMessage(msg.chat.id, `Dear ${msg.chat.id}, cppn coming `);
  
  const buffer = fs.createReadStream("./cppn1.png");
  bot.sendPhoto(msg.chat.id, buffer);
});

bot.onText(/\/cppn/, (msg) => {
  
  bot.sendMessage(msg.chat.id, `Dear ${msg.chat.id}, cppn coming `);
  
  // cppn.saveHighResFrame("c1");
  const buffer = fs.createReadStream("./cppn1.png");
 bot.sendPhoto(msg.chat.id, buffer);
});


