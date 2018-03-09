'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var Vedbot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name;
    this.dbPath = settings.dbPath; //|| path.resolve(process.cwd(), 'data', 'bedbot.db');

    this.user = {};
    this.user.id = "@vedchatbot";
    this.db = "Vedbot.db";

};

Vedbot.prototype.run = function() {
    Vedbot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

Vedbot.prototype._onStart = function() {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
};

Vedbot.prototype._loadBotUser = function() {
    var self = this;
    this.user = this.users.filter(function(user) {
        return user.name === self.name;
    })[0];
};


Vedbot.prototype._connectDb = function() {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

Vedbot.prototype._firstRunCheck = function() {
    var self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function(err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var currentTime = (new Date()).toJSON();

        // this is a first run
        if (!record) {
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        // updates with new last running time
        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

Vedbot.prototype._welcomeMessage = function() {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
        '\n I can tell jokes, but very honest ones. Just say `vedabab` or `' + this.name + '` to invoke me!', { as_user: true });
};

Vedbot.prototype._onMessage = function(message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromVedbot(message) &&
        this._isMentioningVedbot(message)
    ) {
        this._replyWithRandomJoke(message);
    }
};



Vedbot.prototype._isChatMessage = function(message) {
    return message.type === 'message' && Boolean(message.text);
};

Vedbot.prototype._isChannelConversation = function(message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};


Vedbot.prototype._isFromVedbot = function(message) {
    return message.user === "@vedchatbot";
};

Vedbot.prototype._isMentioningVedbot = function(message) {
    return message.text.toLowerCase().indexOf('Vedbaba') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};


Vedbot.prototype._replyWithRandomJoke = function(originalMessage) {
    var self = this;
    self.db.get('SELECT id, joke FROM jokes ORDER BY used ASC, RANDOM() LIMIT 1', function(err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var channel = self._getChannelById(originalMessage.channel);
        self.postMessageToChannel(channel.name, record.joke, { as_user: true });
        self.db.run('UPDATE jokes SET used = used + 1 WHERE id = ?', record.id);
    });
};


Vedbot.prototype._getChannelById = function(channelId) {
    return this.channels.filter(function(item) {
        return item.id === channelId;
    })[0];
};









// inherits methods and properties from the Bot constructor
util.inherits(Vedbot, Bot);

module.exports = Vedbot;