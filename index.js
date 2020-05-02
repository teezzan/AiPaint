

const fs = require('fs');
const request = require('request');


const port = process.env.PORT || 3000;
const deepai = require('deepai');
const apidai = process.env.TOKEN_DPAI || 'd445b643-fb85-4816-ac2d-95a0e660fe81';
deepai.setApiKey(apidai);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN_BOT || '1193764845:AAGmeN1Oekg4u8fgqUHf3jeWLwY56b0-OAo';
const bot = new TelegramBot(token, { polling: true });

var idlist =[];
var url1 = "";
var url2 = "";
var urllink = `https://archillect.com/${randomint(1000, 30082)}`;
var imglink = "";

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
