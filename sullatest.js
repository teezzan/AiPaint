// Supports ES6
// import { create, Whatsapp } from 'sulla';
var chatId = "2347025866322@c.us";
const sulla = require('sulla');
var instance = "";
var tee = sulla.create().then((client) => start(client));


function start(client) {
    console.log(client);
    instance = client;
    console.log("type ", typeof (client))
    client.onMessage((message) => {
        if (message.body === 'Hi') {
            client.sendText(message.from, '👋 Hello from sulla!');
            client.sendLocation(
                message.from,
                25.6801987,
                -100.4060626,
                'Some address, Washington DC',
                'Subtitle'
                );
            console.log(message.from);
        }
    });
}

// const contacts = await client.getAllContacts();