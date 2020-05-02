const fs = require('fs');
const request = require('request');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var url1 = "";
var urllink = `https://archillect.com/${randomint(1000, 30082)}`;



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
        var url1 = feapi(body);
        console.log(url1);
        return url1;
        }
    });
    };

    module.exports = {
        getPage: getPage
    }