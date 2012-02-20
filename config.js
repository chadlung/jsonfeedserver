var config = {};

config.server = {};
config.feed = {};
config.mongodb = {};

config.server.port = 8080;
config.server.domain = 'http://localhost:8080/';

config.feed.limit = 25;
config.feed.skip = 0;

config.mongodb.connectionUrl = 'mongodb://localhost/jsonfeedserver';

module.exports = config;
