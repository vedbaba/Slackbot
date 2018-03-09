'use strict';

var vedbot = require('../lib/vedbot');
var chatbot = require('../lib/chatbot');
const winston = require('winston')

winston.log('info', 'Hello log files!', {
    someKey: JSON.stringify(chatbot)
})

var token = chatbot.token; //process.env.BOT_API_KEY;
var dbPath = chatbot.dbpath; //process.env.BOT_DB_PATH;
var name = chatbot.name; //process.env.BOT_NAME;



var vedbot = new vedbot({
    token: token,
    dbPath: dbPath,
    name: name
});

vedbot.run();