

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
// const bot = new TelegramBot(TOKEN, { polling: true });

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





var idlist = [];
var url1 = "";
var url2 = "";
var urllink = `https://archillect.com/${randomint(1000, 30082)}`;
var imglink = "";
var master = "";

// console.log(urllink);


function paint(id) {
  getPage();
  getPage2();
  (async function () {
    var resp = await deepai.callStandardApi("deepdream", {
      image: url1,
    });
    //console.log(resp.output_url);
    var url = resp.output_url;
    (async function () {
      var resp = await deepai.callStandardApi("CNNMRF", {
        content: "https://source.unsplash.com/random/2048*760",
        style: "https://source.unsplash.com/random/2048*760",
      });
      console.log(resp);
      bot.sendPhoto(id, resp.output_url);
    })()
  })()
}


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
  urllink = `https://archillect.com/${randomint(1000, 30082)}`;
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

  getPage();
  getPage2();
  url2 = "https://source.unsplash.com/random/?space";
  url1 = "https://source.unsplash.com/1600x900/?nature,water";
  console.log("hshhh", url2);
  setTimeout(() => {
    (async function () {
      var resp = await deepai.callStandardApi("CNNMRF", {
        content: url1,
        style: url2, // fs.createReadStream("./img.png"),
      });
      console.log(resp);
      bot.sendPhoto(id, resp.output_url);
      bot.sendPhoto(master, resp.output_url);
    })().catch(() => {
      console.log("here");
      bot.sendMessage(id, "error");

    })
  }, 7000);
}


//sendToGrid("http://localhost:3000","kitt", "test1.png");
function sendToGrid(url, name, image) {
  var fs = require("fs");
  var request = require("request");

  var options = {
    method: 'POST',
    url: `${url}/api/artwork/upload`,
    headers:
    {
      'postman-token': '6fcc56a0-bf47-a756-c0a4-3030c8e5d2dc',
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData:
    {
      file:
      {
        value: fs.createReadStream(`${image}`),
        options: { filename: `${image}`, contentType: null }
      },
      name: name
    }
  };
  var code = 0;
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(response.statusCode);
    code = response.statusCode;
  });
  return code;
}


bot.on('message', (msg) => {
  var prop = {};
  var Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, "Hello dear user");
  }
  else{
    try{
      bot.sendMessage(msg.chat.id, `Dear ${msg.chat.id}, cppn coming `);
      var prop = JSON.parse(msg.text);
      cppn = new abstract({
        canvasID: 'canvas',
        width: prop.height<=1024?prop.height:1024,
        height: prop.width<=1024?prop.width:1024
      });
      cppn.saveHighResFrame("./new.png");
      const buffer = fs.createReadStream("./new.png");
      bot.sendPhoto(msg.chat.id, buffer);
     bot.sendPhoto(master, buffer);
    }
    catch {
    }
  }

});

bot.onText(/\/getpic/, (msg) => {

  bot.sendMessage(msg.chat.id, `Processing your Request, ${msg.from.first_name}.`);
  bot.sendMessage(master, `${msg.from.first_name}`);
  getimage(msg.chat.id);
});
bot.onText(/\/enroll/, (msg) => {
  if (idlist.includes(msg.chat.id)) {
    bot.sendMessage(msg.chat.id, `Your are already a subscriber`);
  }
  else {
    bot.sendMessage(msg.chat.id, `Processing your Request, ${msg.from.first_name}.`);
    idlist.push(msg.chat.id);
    // console.log(idlist)
    bot.sendMessage(msg.chat.id, `Now, you will receive daily update of my paintings. `);
  }
});


bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, `Dear ${msg.from.first_name}, use \/make to fetch randomly generated cppn Abstract art or send a JSON with format {"width" :1040, "height" :1040} for custom resolution.. `);
});

bot.onText(/\/make/, (msg) => {
  //master = msg.chat.id;
  //bot.sendMessage(msg.chat.id, `Dear ${msg.chat.id}, cppn coming `);

  cppn = new abstract({
    canvasID: 'canvas',
    height: 1080,
    width: 720
  });
  cppn.saveHighResFrame("./new.png");
  const buffer = fs.createReadStream("./new.png");
  bot.sendPhoto(msg.chat.id, buffer);
bot.sendPhoto(master, buffer);
});

bot.onText(/\/cppn/, (msg) => {
  master = msg.chat.id;
  bot.sendMessage(msg.chat.id, `Dear Master ${msg.from.first_name}, Processing request `);
  paint(msg.chat.id);
});

bot.onText(/\/send/, (msg) => {

  bot.sendMessage(msg.chat.id, `Dear ${msg.from.first_name}, Processing request `);
  sendToGrid("http://localhost:3000", randomint(5010010, 100001000).toString(), "test1.png");
});

//setInterval(function () {
//  bot.sendMessage(575511262, "Here is another Pic. Share if you like");
 // paint(575511262);
//}, 900000);
