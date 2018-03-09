var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-326134688405-TgKV0gWLWyP9U4wGegwXpHwF',
    name: '@vedchatbot',
    dbpath: 'E:\\study\\node.js\\slackbot\\lib\\data\\vedbot.db'
};

/*
var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('general', 'Hello from vedbaba channel!');
    bot.postMessageToUser('Vedchatbot', 'hello bro!');
    bot.postMessageToGroup('iris', 'hello group chat!');
});*/


module.exports = settings;