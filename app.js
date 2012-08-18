var express = require('express')
    ,app = express.createServer(
        express.bodyParser()
        , express.responseTime())
    , util = require('util')
    , httpStatus = require('http-status')
    , config = require(__dirname + '/config')
    , Entry = require(__dirname + '/models/entry.js')
    , INVALID_JSON_ERROR = 'Only valid JSON is supported via HTTP POST';

var entry = new Entry(config.mongodb.connectionUrl);

app.post('/*', function(req, res){
    if(req.is('application/json')) {
        entry.save({body: req.body,
                    feed: req.params[0],
                    selfHref: config.server.domain + req.params[0]},
                    function(error, returnedEntry) {
            if(error) {
                res.send(error.message, httpStatus.INTERNAL_SERVER_ERROR);
            } else {
                res.send(returnedEntry, httpStatus.CREATED);
            }
        });
    } else {
        res.send(INVALID_JSON_ERROR, httpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
});

app.get('/*', function(req, res){
    if(req.query.id != undefined) {
		entry.getId(req.query.id, function (error, returnedEntry) {
			if(error) {
				res.send(error.message, httpStatus.INTERNAL_SERVER_ERROR);
			} else {
				if(returnedEntry != undefined) {
					res.json(returnedEntry);
				} else {
					res.send('The id specified was not found', httpStatus.NOT_FOUND);
				}
			}
		});
    } else {
        var feedLimit = (req.query.limit == undefined) ? config.feed.limit : req.query.limit
            , skip = (req.query.skip == undefined) ? config.feed.skip : req.query.skip;
        entry.getFeed({ feed: req.params[0], limit: feedLimit, skip: skip }, function (error, returnedEntries) {
            if(error) {
                res.send(error.message, httpStatus.INTERNAL_SERVER_ERROR);
            } else {
                var entriesJSON = {}
                    , firstEntryID
                    , lastEntryID
                    , entryCount = 0;

                for(var entry in returnedEntries){
                    if(entryCount === 0) {
                        firstEntryID = returnedEntries[entry].id;
                    }
                    // If there is only one entry the weak ETag should be the same unique id seperated by a dash
                    lastEntryID = returnedEntries[entry].id;

                    var tempJSONObj = {};
                    // TODO: This will "de-stringify" the body, there should be a better way to do this...
                    tempJSONObj.body = JSON.parse(returnedEntries[entry].body);
                    tempJSONObj.selfHref = returnedEntries[entry].selfHref;
                    tempJSONObj.entryDate = returnedEntries[entry].entryDate;
                    entriesJSON[returnedEntries[entry].id] = tempJSONObj;
                    entryCount++;
                }

                if(entryCount > 0) {
                    res.header('ETag', 'W/"' + firstEntryID + '-' + lastEntryID + '"');
                    res.json(entriesJSON);
                } else {
                    res.send('The requested feed does not exist', httpStatus.NOT_FOUND);
                }
            }
        });
    }
});

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.responseTime());

    app.use(function(err, req, res, next){
        res.send(INVALID_JSON_ERROR, httpStatus.UNSUPPORTED_MEDIA_TYPE);
    });
});

app.listen(config.server.port);
console.log('Listening on port %d', config.server.port);